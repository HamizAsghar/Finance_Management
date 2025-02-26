import { NextResponse } from "next/server"
import { connectDb } from "@/helper/db"
import WebAdmin from "@/models/WebAdmin"
import jwt from "jsonwebtoken"

export async function POST(request) {
    try {
        const { password } = await request.json()

        // Check if password is provided
        if (!password) {
            return NextResponse.json(
                {
                    message: "Password is required",
                    success: false,
                },
                { status: 400 },
            )
        }

        console.log("Starting admin login...")
        await connectDb()
        console.log("DB connected for login")

        // Find admin account
        const admin = await WebAdmin.findOne({ email: "hamizasghar@gmail.com" })

        if (!admin) {
            console.log("Admin account not found")
            return NextResponse.json(
                {
                    message: "Admin account not found. Please reset the account first.",
                    success: false,
                },
                { status: 404 },
            )
        }

        // Verify password
        if (password !== "adminhami9361") {
            return NextResponse.json(
                {
                    message: "Invalid password",
                    success: false,
                },
                { status: 401 },
            )
        }

        console.log("Password verified, generating token...")

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || "webadmin-secret-key",
            { expiresIn: "1d" },
        )

        console.log("Token generated successfully")

        // Set HTTP-only cookie
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
            redirectTo: "/webAdmin/dashboard",
        })

        response.cookies.set("webadmin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day
            path: "/",
        })

        console.log("Login successful")
        return response
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json(
            {
                message: "Failed to perform login",
                error: error.message,
                success: false,
            },
            { status: 500 },
        )
    }
}

