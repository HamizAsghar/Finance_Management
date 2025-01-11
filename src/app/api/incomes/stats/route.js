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

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session in Stats GET:", session);

        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const incomes = await Income.find({ userId: session.user.id }).sort({ date: -1 });

        // Calculate various statistics
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;

        // Group by category
        const categoryStats = {};
        incomes.forEach(income => {
            if (!categoryStats[income.category]) {
                categoryStats[income.category] = 0;
            }
            categoryStats[income.category] += income.amount;
        });

        // Monthly stats for the current year
        const currentYear = new Date().getFullYear();
        const monthlyStats = Array(12).fill(0);
        incomes.forEach(income => {
            const date = new Date(income.date);
            if (date.getFullYear() === currentYear) {
                monthlyStats[date.getMonth()] += income.amount;
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
                totalTransactions: incomes.length,
                categoryStats,
                monthlyStats,
                recentIncomes: incomes.slice(0, 5) // Last 5 transactions
            },
        });
    } catch (error) {
        console.error('Error fetching income stats:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch income statistics',
            },
            { status: 500 }
        );
    }
}

