// import { NextResponse } from 'next/server';
// import Income from '@/models/Income';
// import Expense from '@/models/Expense';
// import { connectDb } from '@/helper/db';

// export async function GET(request) {
//     try {
//         await connectDb();
//         const { searchParams } = new URL(request.url);
//         const interval = searchParams.get('interval') || 'monthly';
//         const type = searchParams.get('type') || 'all';

//         let startDate = new Date();
//         let endDate = new Date();

//         switch (interval) {
//             case 'weekly':
//                 startDate.setDate(startDate.getDate() - 7);
//                 break;
//             case 'monthly':
//                 startDate.setMonth(startDate.getMonth() - 1);
//                 break;
//             case 'yearly':
//                 startDate.setFullYear(startDate.getFullYear() - 1);
//                 break;
//         }

//         const query = {
//             date: {
//                 $gte: startDate,
//                 $lte: endDate
//             }
//         };

//         let incomeData = [];
//         let expenseData = [];

//         if (type === 'all' || type === 'income') {
//             incomeData = await Income.find(query).sort({ date: 1 });
//         }

//         if (type === 'all' || type === 'expense') {
//             expenseData = await Expense.find(query).sort({ date: 1 });
//         }

//         const response = {
//             success: true,
//             data: {
//                 income: incomeData,
//                 expense: expenseData,
//                 interval,
//                 startDate,
//                 endDate
//             }
//         };

//         return NextResponse.json(response);
//     } catch (error) {
//         return NextResponse.json(
//             { success: false, error: 'Failed to fetch reports data' },
//             { status: 500 }
//         );
//     }
// }





import { NextResponse } from 'next/server';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import Report from '@/models/Report';
import { connectDb } from '@/helper/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Authentication required"
            }, { status: 401 });
        }

        await connectDb();
        const { searchParams } = new URL(request.url);
        const interval = searchParams.get('interval') || 'monthly';
        const type = searchParams.get('type') || 'all';

        let startDate = new Date();
        let endDate = new Date();

        switch (interval) {
            case 'weekly':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'monthly':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'yearly':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
        }

        const query = {
            date: {
                $gte: startDate,
                $lte: endDate
            },
            userId: session.user.id // Add user filter
        };

        let incomeData = [];
        let expenseData = [];

        if (type === 'all' || type === 'income') {
            incomeData = await Income.find(query).sort({ date: 1 });
        }

        if (type === 'all' || type === 'expense') {
            expenseData = await Expense.find(query).sort({ date: 1 });
        }

        // Save report for the user
        const categoryBreakdown = new Map();
        const totalAmount = type === 'income' ?
            incomeData.reduce((sum, item) => sum + item.amount, 0) :
            expenseData.reduce((sum, item) => sum + item.amount, 0);

        // Calculate category breakdown
        if (type === 'income') {
            incomeData.forEach(item => {
                const current = categoryBreakdown.get(item.category) || 0;
                categoryBreakdown.set(item.category, current + item.amount);
            });
        } else {
            expenseData.forEach(item => {
                const current = categoryBreakdown.get(item.category) || 0;
                categoryBreakdown.set(item.category, current + item.amount);
            });
        }

        // Create report record
        await Report.create({
            type: type === 'all' ? 'expense' : type,
            startDate,
            endDate,
            data: {
                income: incomeData,
                expense: expenseData
            },
            interval,
            totalAmount,
            categoryBreakdown,
            userId: session.user.id // Add user ID to report
        });

        const response = {
            success: true,
            data: {
                income: incomeData,
                expense: expenseData,
                interval,
                startDate,
                endDate,
                user: {
                    name: session.user.name,
                    email: session.user.email
                }
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reports data' },
            { status: 500 }
        );
    }
}


