import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, getCookieOptions } from "@/lib/auth";
import { loginSchema } from "@/schemas/authSchemas";
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
    const parsed = loginSchema.safeParse(body);
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

    const { email, password } = parsed.data;

    await dbConnect();

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    // Set cookie
    const response = NextResponse.json({
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
    });

    response.cookies.set("token", token, getCookieOptions());

    return response;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Login error:", error);
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
