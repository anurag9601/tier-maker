import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get("code");

        if (!code) {
            return NextResponse.json({ success: false, error: "No code found." }, { status: 400 });
        };

        const codeExchangeUrl = process.env.GOOGLE_CODE_EXCHANGE_URL as string;

        const options = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_SECRET as string,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
            grant_type: "authorization_code"
        };

        const tokenRes = await fetch(codeExchangeUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(options)
        });

        const tokenData = await tokenRes.json();

        const accessToken = tokenData.access_token;

        console.log("token data response", tokenData);

        if (!accessToken) {
            return NextResponse.json({ success: false, error: "No access token found." }, { status: 400 });
        };

        const userInfoUrl = process.env.GOOGLE_USER_INFO_URL as string;

        const userRes = await fetch(userInfoUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const googleUser = await userRes.json();

        return NextResponse.json({ success: true, data: googleUser }, { status: 200 });
    } catch (error) {
        console.log("Error in /api/auth api", error);
        return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
    }
}