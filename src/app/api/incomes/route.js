// import { NextResponse } from 'next/server';
// import Income from '@/models/Income';
// import { connectDb } from '@/helper/db';

// export async function GET() {
//     try {
//         await connectDb();
//         const incomes = await Income.find().sort({ date: -1 });

//         return NextResponse.json({
//             success: true,
//             data: incomes,
//         });
//     } catch (error) {
//         console.error('Error fetching incomes:', error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: 'Failed to fetch incomes',
//             },
//             { status: 500 }
//         );
//     }
// }

// // POST new income
// export async function POST(req) {
//     try {
//         const body = await req.json();
//         await connectDb();
//         const income = await Income.create(body);

//         return NextResponse.json(
//             {
//                 success: true,
//                 data: income,
//             },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error('Error creating income:', error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error?.message || 'Failed to create income',
//             },
//             { status: 400 }
//         );
//     }
// }




import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Income from '@/models/Income';
import { connectDb } from '@/helper/db';

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

        const incomes = await Income.find({ userId: session.user.id }).sort({ date: -1 });
        console.log("User incomes:", incomes);

        return NextResponse.json(
            { message: 'Incomes retrieved successfully', success: true, data: incomes },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in GET handler:", error);
        return NextResponse.json(
            { message: 'Failed to fetch incomes', success: false },
            { status: 500 }
        );
    }
}

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

        const { amount, category, description, date } = await request.json();
        if (!amount || !category || !description || !date) {
            console.error("Missing fields in request body.");
            return NextResponse.json(
                { message: 'All fields are required.', success: false },
                { status: 400 }
            );
        }

        const income = new Income({
            amount,
            category,
            description,
            date,
            userId: session.user.id,
        });

        const createIncome = await income.save();
        console.log("Income created:", createIncome);

        return NextResponse.json(
            { message: 'Income added successfully', success: true, data: createIncome },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json(
            { message: 'Failed to add income', success: false },
            { status: 500 }
        );
    }
}


