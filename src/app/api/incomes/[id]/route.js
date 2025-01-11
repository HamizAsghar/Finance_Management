// import { NextResponse } from 'next/server';

// import Income from '@/models/Income';
// import { connectDb } from '@/helper/db';

// // GET single income
// export async function GET(req, { params }) {
//     try {
//         await connectDb();
//         const income = await Income.findById(params.id);

//         if (!income) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Income not found'
//             }, { status: 404 });
//         }

//         return NextResponse.json({
//             success: true,
//             data: income
//         });
//     } catch (error) {
//         console.error('Error fetching income:', error);
//         return NextResponse.json({
//             success: false,
//             message: 'Failed to fetch income'
//         }, { status: 500 });
//     }
// }

// // PUT update income
// export async function PUT(req, { params }) {
//     try {
//         const body = await req.json();
//         await connectDb();

//         const income = await Income.findByIdAndUpdate(
//             params.id,
//             body,
//             { new: true, runValidators: true }
//         );

//         if (!income) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Income not found'
//             }, { status: 404 });
//         }

//         return NextResponse.json({
//             success: true,
//             data: income
//         });
//     } catch (error) {
//         console.error('Error updating income:', error);
//         return NextResponse.json({
//             success: false,
//             message: error.message || 'Failed to update income'
//         }, { status: 400 });
//     }
// }

// // DELETE income
// export async function DELETE(req, { params }) {
//     try {
//         await connectDb();
//         const income = await Income.findByIdAndDelete(params.id);

//         if (!income) {
//             return NextResponse.json({
//                 success: false,
//                 message: 'Income not found'
//             }, { status: 404 });
//         }

//         return NextResponse.json({
//             success: true,
//             message: 'Income deleted successfully'
//         });
//     } catch (error) {
//         console.error('Error deleting income:', error);
//         return NextResponse.json({
//             success: false,
//             message: 'Failed to delete income'
//         }, { status: 500 });
//     }
// }

import { connectDb } from "@/helper/db";
import Income from "@/models/Income";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const { id } = params;
        const { amount, category, description, date } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: 'Income ID is required.', success: false },
                { status: 400 }
            );
        }

        const income = await Income.findOne({
            _id: id,
            userId: session.user.id
        });

        if (!income) {
            return NextResponse.json(
                { message: 'Income not found.', success: false },
                { status: 404 }
            );
        }

        income.amount = amount || income.amount;
        income.category = category || income.category;
        income.description = description || income.description;
        income.date = date || income.date;

        const updatedIncome = await income.save();

        return NextResponse.json(
            { message: 'Income updated successfully', success: true, data: updatedIncome },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating income:', error);
        return NextResponse.json(
            { message: 'Failed to update income', success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: 'Income ID is required.', success: false },
                { status: 400 }
            );
        }

        const deletedIncome = await Income.findOneAndDelete({
            _id: id,
            userId: session.user.id
        });

        if (!deletedIncome) {
            return NextResponse.json(
                { message: 'Income not found.', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Income deleted successfully', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting income:', error);
        return NextResponse.json(
            { message: 'Failed to delete income', success: false },
            { status: 500 }
        );
    }
}

