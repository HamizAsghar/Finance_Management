// import { connectDb } from '@/helper/db';
// import Budget from '@/models/Budget';
// import { NextResponse } from 'next/server';


// export async function GET(request) {
//     try {
//         await connectDb();
//         const url = new URL(request.url);
//         const month = url.searchParams.get('month') || new Date().toISOString();

//         const startDate = new Date(month);
//         startDate.setDate(1);
//         const endDate = new Date(startDate);
//         endDate.setMonth(endDate.getMonth() + 1);

//         const budgets = await Budget.find({
//             month: {
//                 $gte: startDate,
//                 $lt: endDate,
//             },
//         });

//         return NextResponse.json({ success: true, data: budgets });
//     } catch (error) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: 'Failed to fetch budgets',
//             },
//             { status: 500 }
//         );
//     }
// }

// export async function POST(request) {
//     try {
//         await connectDb();
//         const body = await request.json();
//         const budget = await Budget.create(body);
//         return NextResponse.json({ success: true, data: budget }, { status: 201 });
//     } catch (error) {
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: error.message || 'Failed to create budget',
//             },
//             { status: 400 }
//         );
//     }
// }



import { connectDb } from '@/helper/db';
import Budget from '@/models/Budget';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const url = new URL(request.url);
        const month = url.searchParams.get('month') || new Date().toISOString();

        const startDate = new Date(month);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const budgets = await Budget.find({
            userId: session.user.id,
            month: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        return NextResponse.json({ success: true, data: budgets });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch budgets',
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const body = await request.json();
        const budget = await Budget.create({
            ...body,
            userId: session.user.id
        });

        return NextResponse.json({ success: true, data: budget }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || 'Failed to create budget',
            },
            { status: 400 }
        );
    }
}



