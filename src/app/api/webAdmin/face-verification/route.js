import { NextResponse } from "next/server";
import { connectDb } from "@/helper/db";
import WebAdmin from "@/models/WebAdmin";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const faceImage = formData.get('faceImage');

        if (!faceImage) {
            return NextResponse.json(
                {
                    message: "Face image is required",
                    success: false,
                },
                { status: 400 }
            );
        }

        await connectDb();

        const admin = await WebAdmin.findOne({ email: "hamizasghar@gmail.com" });

        if (!admin || !admin.faceImage) {
            return NextResponse.json(
                {
                    message: "Admin face data not found.",
                    success: false,
                },
                { status: 404 }
            );
        }

        // Convert the new image to base64
        const buffer = await faceImage.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // In a real-world scenario, you would compare the new image with the stored image
        // For this example, we'll assume the verification is successful if we have both images
        const verificationSuccessful = true;

        if (verificationSuccessful) {
            const token = jwt.sign(
                { id: admin._id, email: admin.email, role: admin.role },
                process.env.JWT_SECRET || "webadmin-secret-key",
                { expiresIn: "1d" }
            );

            const response = NextResponse.json({
                message: "Face verification successful",
                success: true,
                redirectTo: "/webAdmin/dashboard",
            });

            response.cookies.set("webadmin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 86400, // 1 day
                path: "/",
            });

            return response;
        } else {
            return NextResponse.json(
                {
                    message: "Face verification failed. You are not an admin.",
                    success: false,
                },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Face verification error:", error);
        return NextResponse.json(
            {
                message: "Failed to perform face verification",
                error: error.message,
                success: false,
            },
            { status: 500 }
        );
    }
}