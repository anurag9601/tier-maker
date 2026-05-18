import connectMongoDB from "@/db/db";
import UsersModel from "@/db/models/Users.model";
import { createToken, tokenAge } from "@/lib/jwt";
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

        await connectMongoDB();

        const userData = await UsersModel.findOneAndUpdate(
            {
                email: googleUser.email,
            },
            {
                $setOnInsert: {
                    email: googleUser.email,
                    name: googleUser.name,
                    picture: googleUser.picture
                }
            },
            {
                upsert: true,
                new: true
            }
        );

        const data = {
            email: userData.email,
            name: userData.name,
            picture: userData.picture
        };

        const token = createToken(data);

        const response = NextResponse.redirect(
            new URL("/", req.url)
        );

        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.Environment === "Production",
            sameSite: "strict",
            maxAge: tokenAge,
            path: "/"
        });

        return response;
    } catch (error) {
        console.log("Error in /api/auth api", error);
        return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
    }
}