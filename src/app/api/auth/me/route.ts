import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware";

async function handler(req: AuthenticatedRequest) {
  // In a real app, you might fetch fresh user data from DB here
  // For now, we return the JWT payload info directly
  return NextResponse.json({
    data: {
      id: req.userId,
    },
  });
}

export const GET = withAuth(handler);
