import { cookies } from "next/headers";

export async function validateLoginUsertoken() {
    const cookiestore = await cookies();

    const tokenCookie = cookiestore.get("authToken");

    if(!tokenCookie) {
        console.error("token not found.");
        return;
    };

    const token = tokenCookie.value;

    const request = await fetch(`${process.env.WEBSITE_URL}/api/auth/token`, {
        method: "GET",
        headers: {
            authorization: token,
        }
    });

    const response = request.json();

    return response;
}