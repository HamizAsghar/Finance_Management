// /app/api/webAdmin/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectDb } from '@/helper/db';
import User from '@/models/User';
import Income from '@/models/Income';
import Expense from '@/models/Expense';

export async function GET(request) {
    try {
        await connectDb();

        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: today }
        });

        // Get financial data
        const totalIncome = await Income.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');

        // Get user growth data (monthly)
        const userGrowth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    users: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format user growth data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedUserGrowth = userGrowth.map(item => ({
            month: months[item._id.month - 1],
            users: item.users
        }));

        // Get transaction volume data (monthly)
        const incomeByMonth = await Income.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    income: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const expensesByMonth = await Expense.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    expenses: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Merge income and expenses by month
        const transactionVolume = [];
        const allMonths = new Set([
            ...incomeByMonth.map(i => `${i._id.year}-${i._id.month}`),
            ...expensesByMonth.map(e => `${e._id.year}-${e._id.month}`)
        ]);

        allMonths.forEach(monthKey => {
            const [year, month] = monthKey.split('-').map(Number);
            const income = incomeByMonth.find(i => i._id.year === year && i._id.month === month)?.income || 0;
            const expenses = expensesByMonth.find(e => e._id.year === year && e._id.month === month)?.expenses || 0;

            transactionVolume.push({
                month: months[month - 1],
                income,
                expenses
            });
        });

        // Get expense categories breakdown
        const expenseCategories = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            }
        ]);

        const categoryDistribution = expenseCategories.map(cat => ({
            name: cat._id,
            value: cat.value
        }));

        // Calculate total transactions
        const totalIncomeCount = await Income.countDocuments();
        const totalExpenseCount = await Expense.countDocuments();
        const totalTransactions = totalIncomeCount + totalExpenseCount;

        // Calculate transactions today
        const incomeTodayCount = await Income.countDocuments({
            date: { $gte: today }
        });
        const expenseTodayCount = await Expense.countDocuments({
            date: { $gte: today }
        });
        const transactionsToday = incomeTodayCount + expenseTodayCount;

        // Get recent activity
        const recentExpenses = await Expense.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('userId', 'name');

        const recentIncomes = await Income.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .populate('userId', 'name');

        const recentActivity = [
            ...recentExpenses.map(expense => ({
                id: `expense-${expense._id}`,
                userId: expense.userId._id,
                userName: expense.userId.name,
                action: 'create',
                resourceType: 'expense',
                details: `Added expense of ₨${expense.amount} for ${expense.description}`,
                timestamp: expense.createdAt || expense.date
            })),
            ...recentIncomes.map(income => ({
                id: `income-${income._id}`,
                userId: income.userId._id,
                userName: income.userId.name,
                action: 'create',
                resourceType: 'income',
                details: `Added income of ₨${income.amount} for ${income.description}`,
                timestamp: income.createdAt || income.date
            }))
        ];

        // Sort by timestamp (newest first)
        recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    activeUsers: totalUsers, // This is a placeholder, replace with actual active users count
                    totalTransactions,
                    totalAmount: (totalIncome[0]?.total || 0) + (totalExpenses[0]?.total || 0),
                    newUsersToday,
                    transactionsToday
                },
                recentUsers: recentUsers.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    joinDate: user.createdAt,
                    transactionCount: 0 // This would need a separate query to get actual count
                })),
                recentActivity,
                financialOverview: {
                    income: totalIncome[0]?.total || 0,
                    expenses: totalExpenses[0]?.total || 0,
                    balance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0)
                },
                chartData: {
                    userGrowth: formattedUserGrowth,
                    transactionVolume,
                    categoryDistribution
                }
            }
        });

    } catch (error) {
        console.error('Dashboard data error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch dashboard data', success: false },
            { status: 500 }
        );
    }
}