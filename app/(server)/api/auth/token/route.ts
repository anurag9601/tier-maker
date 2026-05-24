import { userDataI } from "@/lib/global.interface";
import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    try {
        const token = req.headers.get("authorization");

        if (!token) {
            return NextResponse.json({ success: false, error: "Token not found." }, { status: 400 });
        };

        const userData: userDataI = verifyToken(token);

        if (!userData) {
            const response = NextResponse.json({ success: false, error: "Invalid token." }, { status: 400 });

            response.cookies.delete("authToken");

            return response;
        };

        const data: userDataI = {
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
        };

        return NextResponse.json({ success: true, data: data }, { status: 200 });
    } catch (error) {
        console.log("Error in /api/auth/token", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}