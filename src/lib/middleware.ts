import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }): Promise<NextResponse> => {
    try {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      (req as AuthenticatedRequest).userId = decoded.userId;

      return handler(req as AuthenticatedRequest, context);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}
