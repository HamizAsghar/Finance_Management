import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDb } from "@/helper/db";

export async function POST(req) {
    try {
        const { name, email, password, image } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectDb();
        await User.create({
            name,
            email,
            password: hashedPassword,
            image
        });

        return NextResponse.json({ message: "User registered." }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while registering the user." },
            { status: 500 }
        );
    }
}


export async function GET(req) {
    try {
        await connectDb();
        const users = await User.find({}, { password: 0 }); // Exclude the password field for security

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching the users." },
            { status: 500 }
        );
    }
}