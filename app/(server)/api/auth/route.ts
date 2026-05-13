import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export function GET(req: NextApiRequest) {
    try {
        const rootUrl = process.env.GOOGLE_ACCOUNT_URL as string;

        const options = {
            redirect_uri: process.env.GOOGLE_REDIRECT_URL as string,
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "openid",
                "email",
                "profile"
            ].join(" "),
        };

        const qp = new URLSearchParams(options);

        return NextResponse.redirect(`${rootUrl}?${qp.toString()}`);
    } catch (error) {
        console.log("Error in /api/auth api", error);
        return NextResponse.json({ success: false, error: "Internal server error."}, { status: 500 });
    }
}