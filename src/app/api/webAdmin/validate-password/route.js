import { NextResponse } from "next/server"
import { connectDb } from "@/helper/db"
import WebAdmin from "@/models/WebAdmin"

export async function POST(request) {
    try {
        const { password } = await request.json()

        if (!password) {
            return NextResponse.json(
                {
                    message: "Password is required",
                    success: false,
                },
                { status: 400 },
            )
        }

        await connectDb()

        const admin = await WebAdmin.findOne({ email: "hamizasghar@gmail.com" })

        if (!admin) {
            return NextResponse.json(
                {
                    message: "Admin account not found. Please reset the account first.",
                    success: false,
                },
                { status: 404 },
            )
        }

        if (password !== "adminhami9361") {
            return NextResponse.json(
                {
                    message: "Invalid password. You cannot proceed to face verification.",
                    success: false,
                },
                { status: 401 },
            )
        }

        return NextResponse.json({
            message: "Password validated successfully",
            success: true,
            faceVerificationSetup: admin.faceVerificationSetup || false,
        })
    } catch (error) {
        console.error("Password validation error:", error)
        return NextResponse.json(
            {
                message: "Failed to validate password",
                error: error.message,
                success: false,
            },
            { status: 500 },
        )
    }
}