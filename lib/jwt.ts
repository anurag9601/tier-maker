import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

interface I {
    email: string,
    name: string,
    picture: string,
};

// command to generate public private key files
// for private => openssl genrsa -out private.pem 2048
// for public => openssl rsa -in private.pem -pubout -out public.pem

const privateKey = fs.readFileSync(
    path.join(process.cwd(), '/private.pem'),
    "utf-8"
);

const publicKey = fs.readFileSync(
    path.join(process.cwd(), "/public.pem"),
    "utf-8"
);

export const tokenAge = 1000 * 60 * 60 * 24 * 30;

export function createToken(data: I) {
    const token = jwt.sign(data, privateKey,
        {
            algorithm: "RS256",
            expiresIn: tokenAge
        }
    );

    return token;
};

export function verifyToken(token: string) {
    const userData = jwt.verify(token, publicKey, {
        algorithms: ["RS256"]
    });
    return userData;
};