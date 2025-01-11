import { NextResponse } from 'next/server';
import { connectDb } from '@/helper/db';
import PaymentReminder from '@/models/PaymentReminder';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        await connectDb();
        const data = await request.json();
        data.userId = session.user.id;

        const reminder = await PaymentReminder.create(data);
        return NextResponse.json({ success: true, data: reminder });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        await connectDb();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');

        let query = { userId: session.user.id };
        if (status) query.status = status;
        if (category) query.category = category;

        const reminders = await PaymentReminder.find(query).sort({ dueDate: 1 });
        return NextResponse.json({ success: true, data: reminders });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        await connectDb();
        const data = await request.json();
        const { id, ...updateData } = data;

        const reminder = await PaymentReminder.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            updateData,
            { new: true }
        );

        if (!reminder) {
            return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: reminder });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await connectDb();
        const reminder = await PaymentReminder.findOneAndDelete({ _id: id, userId: session.user.id });

        if (!reminder) {
            return NextResponse.json({ success: false, message: 'Reminder not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: reminder });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

