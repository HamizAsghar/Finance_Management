import { NextResponse } from "next/server"
import { connectDb } from "@/helper/db"
import WebAdmin from "@/models/WebAdmin"

export async function POST(request) {
    try {
        console.log("Received request to reset face verification")
        const { password, secretKey } = await request.json()

        // Validate inputs
        if (!password || !secretKey) {
            return NextResponse.json(
                {
                    message: "Password and secret key are required",
                    success: false,
                },
                { status: 400 },
            )
        }

        // Validate password and secret key
        if (password !== "adminhami9361" || secretKey !== "kiajahilhoyr") {
            console.log("Invalid credentials for face reset")
            return NextResponse.json(
                {
                    message: "Invalid credentials. You are not authorized to reset face verification.",
                    success: false,
                },
                { status: 401 },
            )
        }

        console.log("Connecting to database...")
        await connectDb()
        console.log("Connected to database")

        const admin = await WebAdmin.findOne({ email: "hamizasghar@gmail.com" })
        console.log("Admin found:", admin ? "Yes" : "No")

        if (!admin) {
            console.log("Admin account not found")
            return NextResponse.json(
                {
                    message: "Admin account not found.",
                    success: false,
                },
                { status: 404 },
            )
        }

        // Reset face verification
        console.log("Resetting face verification...")
        admin.faceImage = null
        admin.faceVerificationSetup = false
        await admin.save()
        console.log("Face verification reset successfully")

        return NextResponse.json({
            message: "Face verification has been reset successfully.",
            success: true,
        })
    } catch (error) {
        console.error("Face reset error:", error)
        return NextResponse.json(
            {
                message: "Failed to reset face verification",
                error: error.message,
                success: false,
            },
            { status: 500 },
        )
    }
}

