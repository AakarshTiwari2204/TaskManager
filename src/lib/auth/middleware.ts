import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromHeaders, getTokenFromCookie } from "./utils";
import { db } from "@/lib/db";

export const withAuth = (handler: (req: NextRequest, context: any, userId: string) => Promise<NextResponse>) => {
  return async (req: NextRequest, context: any): Promise<NextResponse> => {
    try {
      // Try to get token from Authorization header first, then from cookie
      const token = getTokenFromHeaders(req.headers) || getTokenFromCookie(req.headers);
      
      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }

      // Verify user exists in database
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true }
      });

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 401 }
        );
      }

      return handler(req, context, decoded.userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
};