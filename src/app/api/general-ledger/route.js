// import { connectDb } from "@/helper/db";
// import GeneralLedger from "@/models/general-ledger";
// import Income from "@/models/Income";
// import Expense from "@/models/Expense";
// import SavingsGoal from "@/models/SavingsGoal";
// import Budget from "@/models/Budget";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//     try {
//         await connectDb();
//         const { searchParams } = new URL(request.url);
//         const startDate = searchParams.get('startDate');
//         const endDate = searchParams.get('endDate');
//         const type = searchParams.get('type');

//         let query = {};

//         if (startDate && endDate) {
//             query.transactionDate = {
//                 $gte: new Date(startDate),
//                 $lte: new Date(endDate)
//             };
//         }

//         if (type) {
//             query.transactionType = type.toUpperCase();
//         }

//         const entries = await GeneralLedger.find(query)
//             .sort({ transactionDate: -1 });

//         // Calculate totals
//         const totals = await GeneralLedger.aggregate([
//             { $match: query },
//             {
//                 $group: {
//                     _id: '$debitCredit',
//                     total: { $sum: '$amount' }
//                 }
//             }
//         ]);

//         const debitTotal = totals.find(t => t._id === 'DEBIT')?.total || 0;
//         const creditTotal = totals.find(t => t._id === 'CREDIT')?.total || 0;

//         return NextResponse.json({
//             success: true,
//             data: {
//                 entries,
//                 summary: {
//                     debitTotal,
//                     creditTotal,
//                     netBalance: creditTotal - debitTotal
//                 }
//             }
//         });
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         }, { status: 500 });
//     }
// }

// // Sync function to update general ledger
// async function syncGeneralLedger() {
//     try {
//         await connectDb();

//         // Sync Incomes
//         const incomes = await Income.find();
//         for (const income of incomes) {
//             await GeneralLedger.findOneAndUpdate(
//                 { referenceId: income._id, referenceModel: 'Income' },
//                 {
//                     transactionDate: income.date,
//                     transactionType: 'INCOME',
//                     description: income.description,
//                     amount: income.amount,
//                     category: income.category,
//                     referenceId: income._id,
//                     referenceModel: 'Income',
//                     debitCredit: 'CREDIT'
//                 },
//                 { upsert: true }
//             );
//         }

//         // Sync Expenses
//         const expenses = await Expense.find();
//         for (const expense of expenses) {
//             await GeneralLedger.findOneAndUpdate(
//                 { referenceId: expense._id, referenceModel: 'Expense' },
//                 {
//                     transactionDate: expense.date,
//                     transactionType: 'EXPENSE',
//                     description: expense.description,
//                     amount: expense.amount,
//                     category: expense.category,
//                     subcategory: expense.subcategory,
//                     referenceId: expense._id,
//                     referenceModel: 'Expense',
//                     debitCredit: 'DEBIT'
//                 },
//                 { upsert: true }
//             );
//         }

//         // Sync Savings Goals
//         const savingsGoals = await SavingsGoal.find();
//         for (const goal of savingsGoals) {
//             if (goal.currentAmount > 0) {
//                 await GeneralLedger.findOneAndUpdate(
//                     { referenceId: goal._id, referenceModel: 'SavingsGoal' },
//                     {
//                         transactionDate: goal.updatedAt,
//                         transactionType: 'SAVINGS',
//                         description: `Savings for ${goal.title}`,
//                         amount: goal.currentAmount,
//                         category: goal.category,
//                         referenceId: goal._id,
//                         referenceModel: 'SavingsGoal',
//                         debitCredit: 'DEBIT'
//                     },
//                     { upsert: true }
//                 );
//             }
//         }

//         // Sync Budgets
//         const budgets = await Budget.find();
//         for (const budget of budgets) {
//             if (budget.spent > 0) {
//                 await GeneralLedger.findOneAndUpdate(
//                     { referenceId: budget._id, referenceModel: 'Budget' },
//                     {
//                         transactionDate: budget.month,
//                         transactionType: 'BUDGET',
//                         description: `Budget spending for ${budget.category}`,
//                         amount: budget.spent,
//                         category: budget.category,
//                         referenceId: budget._id,
//                         referenceModel: 'Budget',
//                         debitCredit: 'DEBIT'
//                     },
//                     { upsert: true }
//                 );
//             }
//         }

//         return true;
//     } catch (error) {
//         console.error('Sync error:', error);
//         return false;
//     }
// }

// export async function POST(request) {
//     try {
//         const { action } = await request.json();

//         if (action === 'sync') {
//             const success = await syncGeneralLedger();
//             return NextResponse.json({
//                 success,
//                 message: success ? 'Ledger synchronized successfully' : 'Failed to synchronize ledger'
//             });
//         }

//         return NextResponse.json({
//             success: false,
//             message: 'Invalid action'
//         }, { status: 400 });
//     } catch (error) {
//         return NextResponse.json({
//             success: false,
//             message: error.message
//         }, { status: 500 });
//     }
// }



import { connectDb } from "@/helper/db";
import GeneralLedger from "@/models/general-ledger";
import Income from "@/models/Income";
import Expense from "@/models/Expense";
import SavingsGoal from "@/models/SavingsGoal";
import Budget from "@/models/Budget";
import { NextResponse } from "next/server";
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
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const type = searchParams.get('type');

        let query = {
            userId: session.user.id // Add user filter
        };

        if (startDate && endDate) {
            query.transactionDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (type) {
            query.transactionType = type.toUpperCase();
        }

        const entries = await GeneralLedger.find(query)
            .sort({ transactionDate: -1 });

        // Calculate totals for user's entries only
        const totals = await GeneralLedger.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$debitCredit',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const debitTotal = totals.find(t => t._id === 'DEBIT')?.total || 0;
        const creditTotal = totals.find(t => t._id === 'CREDIT')?.total || 0;

        return NextResponse.json({
            success: true,
            data: {
                entries,
                summary: {
                    debitTotal,
                    creditTotal,
                    netBalance: creditTotal - debitTotal
                }
            }
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

// Sync function to update general ledger
async function syncGeneralLedger(userId) {
    try {
        await connectDb();

        // Sync Incomes for specific user
        const incomes = await Income.find({ userId });
        for (const income of incomes) {
            await GeneralLedger.findOneAndUpdate(
                { referenceId: income._id, referenceModel: 'Income', userId },
                {
                    transactionDate: income.date,
                    transactionType: 'INCOME',
                    description: income.description,
                    amount: income.amount,
                    category: income.category,
                    referenceId: income._id,
                    referenceModel: 'Income',
                    debitCredit: 'CREDIT',
                    userId // Add user ID
                },
                { upsert: true }
            );
        }

        // Sync Expenses for specific user
        const expenses = await Expense.find({ userId });
        for (const expense of expenses) {
            await GeneralLedger.findOneAndUpdate(
                { referenceId: expense._id, referenceModel: 'Expense', userId },
                {
                    transactionDate: expense.date,
                    transactionType: 'EXPENSE',
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category,
                    subcategory: expense.subcategory,
                    referenceId: expense._id,
                    referenceModel: 'Expense',
                    debitCredit: 'DEBIT',
                    userId // Add user ID
                },
                { upsert: true }
            );
        }

        // Sync Savings Goals for specific user
        const savingsGoals = await SavingsGoal.find({ userId });
        for (const goal of savingsGoals) {
            if (goal.currentAmount > 0) {
                await GeneralLedger.findOneAndUpdate(
                    { referenceId: goal._id, referenceModel: 'SavingsGoal', userId },
                    {
                        transactionDate: goal.updatedAt,
                        transactionType: 'SAVINGS',
                        description: `Savings for ${goal.title}`,
                        amount: goal.currentAmount,
                        category: goal.category,
                        referenceId: goal._id,
                        referenceModel: 'SavingsGoal',
                        debitCredit: 'DEBIT',
                        userId // Add user ID
                    },
                    { upsert: true }
                );
            }
        }

        // Sync Budgets for specific user
        const budgets = await Budget.find({ userId });
        for (const budget of budgets) {
            if (budget.spent > 0) {
                await GeneralLedger.findOneAndUpdate(
                    { referenceId: budget._id, referenceModel: 'Budget', userId },
                    {
                        transactionDate: budget.month,
                        transactionType: 'BUDGET',
                        description: `Budget spending for ${budget.category}`,
                        amount: budget.spent,
                        category: budget.category,
                        referenceId: budget._id,
                        referenceModel: 'Budget',
                        debitCredit: 'DEBIT',
                        userId // Add user ID
                    },
                    { upsert: true }
                );
            }
        }

        return true;
    } catch (error) {
        console.error('Sync error:', error);
        return false;
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                message: "Authentication required"
            }, { status: 401 });
        }

        const { action } = await request.json();

        if (action === 'sync') {
            const success = await syncGeneralLedger(session.user.id);
            return NextResponse.json({
                success,
                message: success ? 'Ledger synchronized successfully' : 'Failed to synchronize ledger'
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Invalid action'
        }, { status: 400 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}



