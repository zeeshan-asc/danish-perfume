import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, getCookieOptions } from "@/lib/auth";
import { registerSchema } from "@/schemas/authSchemas";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIP(req);
    const { allowed, retryAfter } = rateLimit(ip, 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter), "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY" } }
      );
    }

    const body = await req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path.map(p => String(p)).join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      });
      return NextResponse.json(
        { error: "Validation failed", details: fieldErrors },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    await dbConnect();

    // Check for existing user
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists", field: "email" },
        { status: 409 }
      );
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken", field: "username" },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Sign JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    // Set cookie
    const response = NextResponse.json(
      {
        data: {
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          },
        },
        message: "Account created successfully",
      },
      { status: 201 }
    );

    response.cookies.set("token", token, getCookieOptions());

    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Register error:", error);
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
