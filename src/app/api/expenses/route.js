// import { connectDb } from "@/helper/db";
// import Expense from "@/models/Expense";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         await connectDb();
//         const { amount, category, description, date } = await request.json();

//         if (!amount || !category || !description || !date) {
//             return NextResponse.json(
//                 { message: 'All fields are required.', success: false },
//                 { status: 400 }
//             );
//         }
//         const existingExpense = await Expense.findOne({
//             amount,
//             category,
//             description,
//         });

//         if (existingExpense) {
//             return NextResponse.json(
//                 { message: 'This expense already exists.', success: false },
//                 { status: 400 }
//             );
//         }

//         const expense = new Expense({ amount, category, description, date });
//         const createExpense = await expense.save();

//         return NextResponse.json(
//             { message: 'Expense added successfully', success: true, data: createExpense },
//             { status: 201 }
//         );
//     }
//     catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json(
//             { message: 'Failed to add expense', success: false },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(request) {
//     try {
//         await connectDb();

//         // Fetch all expenses from the database
//         const expenses = await Expense.find();

//         if (expenses.length === 0) {
//             return NextResponse.json(
//                 { message: 'No expenses found.', success: false },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             { message: 'Expenses fetched successfully', success: true, data: expenses },
//             { status: 200 }
//         );
//     }
//     catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json(
//             { message: 'Failed to fetch expenses', success: false },
//             { status: 500 }
//         );
//     }
// }

// OKKKKKKKKKKKKKKKKK

// import { connectDb } from "@/helper/db";
// import Expense from "@/models/Expense";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         await connectDb();
//         const { amount, category, subcategory, description, date } = await request.json();

//         if (!amount || !category || !subcategory || !description || !date) {
//             return NextResponse.json(
//                 { message: 'All fields are required.', success: false },
//                 { status: 400 }
//             );
//         }
//         const existingExpense = await Expense.findOne({
//             amount,
//             category,
//             subcategory,
//             description,
//         });

//         if (existingExpense) {
//             return NextResponse.json(
//                 { message: 'This expense already exists.', success: false },
//                 { status: 400 }
//             );
//         }

//         const expense = new Expense({ amount, category, subcategory, description, date });
//         const createExpense = await expense.save();

//         return NextResponse.json(
//             { message: 'Expense added successfully', success: true, data: createExpense },
//             { status: 201 }
//         );
//     }
//     catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json(
//             { message: 'Failed to add expense', success: false },
//             { status: 500 }
//         );
//     }
// }

// export async function GET(request) {
//     try {
//         await connectDb();
//         const expenses = await Expense.find();

//         if (expenses.length === 0) {
//             return NextResponse.json(
//                 { message: 'No expenses found.', success: false },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json(
//             { message: 'Expenses fetched successfully', success: true, data: expenses },
//             { status: 200 }
//         );
//     }
//     catch (error) {
//         console.error('Error:', error);
//         return NextResponse.json(
//             { message: 'Failed to fetch expenses', success: false },
//             { status: 500 }
//         );
//     }
// }



import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Expense from '@/models/Expense';
import { connectDb } from '@/helper/db';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session in POST:", session);

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();

        const { amount, category, subcategory, description, date } = await request.json();
        if (!amount || !category || !subcategory || !description || !date) {
            console.error("Missing fields in request body.");
            return NextResponse.json(
                { message: 'All fields are required.', success: false },
                { status: 400 }
            );
        }

        const expense = new Expense({
            amount,
            category,
            subcategory,
            description,
            date,
            userId: session.user.id,
        });

        const createExpense = await expense.save();
        console.log("Expense created:", createExpense);

        return NextResponse.json(
            { message: 'Expense added successfully', success: true, data: createExpense },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { message: 'Failed to add expense', success: false },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session in GET:", session);

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();

        const expenses = await Expense.find({ userId: session.user.id }).sort({ date: -1 });
        console.log("User expenses:", expenses);

        return NextResponse.json(
            { message: 'Expenses retrieved successfully', success: true, data: expenses },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
            { message: 'Failed to fetch expenses', success: false },
            { status: 500 }
        );
    }
}



// export async function GET() {
//     try {
//         const session = await getServerSession(authOptions);
//         console.log("Session in GET:", session);

//         if (!session) {
//             return NextResponse.json(
//                 { message: 'Unauthorized', success: false },
//                 { status: 401 }
//             );
//         }

//         await connectDb();

//         const expenses = await Expense.find({ userId: session.user.id });
//         console.log("Fetched expenses:", expenses);

//         return NextResponse.json(
//             {
//                 message: expenses.length ? 'Expenses fetched successfully' : 'No expenses found',
//                 success: true,
//                 data: expenses,
//             },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error in GET handler:", error);
//         return NextResponse.json(
//             { message: 'Failed to fetch expenses', success: false },
//             { status: 500 }
//         );
//     }
// }










