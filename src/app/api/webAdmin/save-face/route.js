import { NextResponse } from "next/server";
import { connectDb } from "@/helper/db";
import WebAdmin from "@/models/WebAdmin";

export async function POST(request) {
    console.log("Received request to save face");
    try {
        const formData = await request.formData();
        const faceImage = formData.get('faceImage');

        if (!faceImage) {
            console.error("No face image received");
            return NextResponse.json(
                {
                    message: "Face image is required",
                    success: false,
                },
                { status: 400 }
            );
        }

        console.log("Connecting to database...");
        await connectDb();
        console.log("Connected to database");

        const admin = await WebAdmin.findOne({ email: "hamizasghar@gmail.com" });

        if (!admin) {
            console.error("Admin account not found");
            return NextResponse.json(
                {
                    message: "Admin account not found.",
                    success: false,
                },
                { status: 404 }
            );
        }

        console.log("Converting image to base64...");
        const buffer = await faceImage.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        console.log("Image converted to base64");

        console.log("Saving face image to admin document...");
        admin.faceImage = base64Image;
        admin.faceVerificationSetup = true;
        await admin.save();
        console.log("Face image saved successfully");
        console.log("Face image length:", admin.faceImage.length);
        console.log("Face verification setup:", admin.faceVerificationSetup);

        return NextResponse.json({
            message: "Face verification setup successful",
            success: true,
        });
    } catch (error) {
        console.error("Face setup error:", error);
        return NextResponse.json(
            {
                message: "Failed to set up face verification",
                error: error.message,
                success: false,
            },
            { status: 500 }
        );
    }
}