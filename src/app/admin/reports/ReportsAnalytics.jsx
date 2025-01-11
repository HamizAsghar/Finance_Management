'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Calendar, BarChartIcon as ChartBar, PieChartIcon, TrendingUp, Download, Filter, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const COLORS = ['#4DD0E1', '#FF5252', '#FFB74D', '#FFEB3B', '#90CAF9', '#81C784'];

export default function ReportsAnalytics() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [timeframe, setTimeframe] = useState('monthly');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [incomeData, setIncomeData] = useState([]);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        topExpenseCategories: [],
        topIncomeCategories: [],
        monthlyTrend: 0
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        } else if (status === 'authenticated') {
            fetchData();
        }
    }, [status, timeframe, dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/reports?interval=${timeframe}&start=${dateRange.start}&end=${dateRange.end}`);
            const data = await response.json();

            if (data.success) {
                setIncomeData(data.data.income);
                setExpenseData(data.data.expense);
                generateInsights(data.data.income, data.data.expense);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch report data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const generateInsights = (incomes, expenses) => {
        const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

        const expenseByCategory = expenses.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.amount;
            return acc;
        }, {});

        const incomeByCategory = incomes.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.amount;
            return acc;
        }, {});

        const currentMonth = expenses.filter(item =>
            new Date(item.date).getMonth() === new Date().getMonth()
        ).reduce((sum, item) => sum + item.amount, 0);

        const lastMonth = expenses.filter(item =>
            new Date(item.date).getMonth() === new Date().getMonth() - 1
        ).reduce((sum, item) => sum + item.amount, 0);

        const monthlyTrend = lastMonth ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

        const topExpenseCategories = Object.entries(expenseByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => ({
                category,
                amount,
                name: category,
                value: amount,
                percentage: ((amount / totalExpenses) * 100).toFixed(0)
            }));

        const topIncomeCategories = Object.entries(incomeByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => ({
                category,
                amount,
                name: category,
                value: amount,
                percentage: ((amount / totalIncome) * 100).toFixed(0)
            }));

        setInsights({
            totalIncome,
            totalExpenses,
            netSavings: totalIncome - totalExpenses,
            topExpenseCategories,
            topIncomeCategories,
            monthlyTrend
        });
    };

    const exportReport = () => {
        try {
            const doc = new jsPDF();

            // Company Header
            doc.setFontSize(24);
            doc.setTextColor(41, 128, 185);
            doc.text('Financial Report', 105, 20, { align: 'center' });

            // User Information
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Generated for:', 14, 40);
            doc.setFont(undefined, 'bold');
            doc.text(session.user.name, 50, 40);
            doc.setFont(undefined, 'normal');
            doc.text('Email:', 14, 48);
            doc.text(session.user.email, 50, 48);

            // Report Period
            doc.text('Report Period:', 14, 60);
            doc.text(`${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}`, 50, 60);

            // Financial Summary Section
            doc.setFontSize(16);
            doc.setTextColor(41, 128, 185);
            doc.text('Financial Summary', 14, 75);

            const summaryData = [
                ['Total Income', `₨${insights.totalIncome.toFixed(2)}`],
                ['Total Expenses', `₨${insights.totalExpenses.toFixed(2)}`],
                ['Net Savings', `₨${insights.netSavings.toFixed(2)}`],
                ['Monthly Trend', `${insights.monthlyTrend > 0 ? '+' : ''}${insights.monthlyTrend.toFixed(1)}%`]
            ];

            doc.autoTable({
                startY: 85,
                head: [['Metric', 'Amount']],
                body: summaryData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontSize: 12,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 5
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                }
            });

            // Category Breakdown Section
            doc.setFontSize(16);
            doc.setTextColor(41, 128, 185);
            doc.text('Category Breakdown', 14, doc.lastAutoTable.finalY + 20);

            const categoryData = [
                ...insights.topExpenseCategories.map(cat => ['Expense', cat.category, `₨${cat.amount.toFixed(2)}`]),
                ...insights.topIncomeCategories.map(cat => ['Income', cat.category, `₨${cat.amount.toFixed(2)}`])
            ];

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 30,
                head: [['Type', 'Category', 'Amount']],
                body: categoryData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontSize: 12,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 5
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                }
            });

            // Monthly Analysis Section
            doc.setFontSize(16);
            doc.setTextColor(41, 128, 185);
            doc.text('Monthly Analysis', 14, doc.lastAutoTable.finalY + 20);

            const monthlyData = getTimeframeData([...incomeData, ...expenseData])
                .map(item => [
                    item.period,
                    `₨${item.amount.toFixed(2)}`
                ]);

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 30,
                head: [['Period', 'Amount']],
                body: monthlyData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: [255, 255, 255],
                    fontSize: 12,
                    fontStyle: 'bold'
                }
            });

            // Footer with page numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }

            doc.save(`financial-report-${session.user.name}-${dateRange.start}-to-${dateRange.end}.pdf`);
        } catch (error) {
            Swal.fire('Error', 'Failed to generate PDF report', 'error');
        }
    };

    const getTimeframeData = (data) => {
        switch (timeframe) {
            case 'weekly':
                return data.reduce((acc, item) => {
                    const week = new Date(item.date).toLocaleDateString('en-US', { week: 'numeric' });
                    const existing = acc.find(x => x.period === `Week ${week}`);
                    if (existing) {
                        existing.amount += item.amount;
                    } else {
                        acc.push({ period: `Week ${week}`, amount: item.amount });
                    }
                    return acc;
                }, []);
            case 'yearly':
                return data.reduce((acc, item) => {
                    const year = new Date(item.date).getFullYear();
                    const existing = acc.find(x => x.period === year.toString());
                    if (existing) {
                        existing.amount += item.amount;
                    } else {
                        acc.push({ period: year.toString(), amount: item.amount });
                    }
                    return acc;
                }, []);
            default: // monthly
                return data.reduce((acc, item) => {
                    const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short' });
                    const existing = acc.find(x => x.period === month);
                    if (existing) {
                        existing.amount += item.amount;
                    } else {
                        acc.push({ period: month, amount: item.amount });
                    }
                    return acc;
                }, []);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your reports...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Analyze your financial data and trends
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <button
                            onClick={exportReport}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                        >
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{insights.totalIncome.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                <ArrowDownCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{insights.totalExpenses.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <ArrowUpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{insights.netSavings.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Trend</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    {insights.monthlyTrend > 0 ? '+' : ''}{insights.monthlyTrend.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Income vs Expenses Trend */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Income vs Expenses Trend
                        </h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={getTimeframeData([...incomeData, ...expenseData])}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            padding: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        name="Amount"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Expense Category Distribution
                        </h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={insights.topExpenseCategories}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={2}
                                    >
                                        {insights.topExpenseCategories.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="none"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                                                        <p className="font-medium">{data.name}</p>
                                                        <p className="text-gray-600">₨{data.value.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500">{data.percentage}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        formatter={(value, entry, index) => (
                                            <span className="text-sm">
                                                {value} ({insights.topExpenseCategories[index].percentage}%)
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Monthly Comparison */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Monthly Comparison
                        </h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={getTimeframeData([...incomeData, ...expenseData])}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            padding: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="amount"
                                        name="Amount"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Top Categories
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Top Expense Categories
                                </h4>
                                <div className="space-y-3">
                                    {insights.topExpenseCategories.map((category, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {category.category}
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                ₨{category.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Top Income Categories
                                </h4>
                                <div className="space-y-3">
                                    {insights.topIncomeCategories.map((category, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {category.category}
                                            </span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                ₨{category.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Financial Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Spending Patterns
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Monthly spending trend is {insights.monthlyTrend > 0 ? 'up' : 'down'} by{' '}
                                        {Math.abs(insights.monthlyTrend).toFixed(1)}% compared to last month
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Top expense category: {insights.topExpenseCategories[0]?.name || 'N/A'} (
                                        ₨{insights.topExpenseCategories[0]?.value.toFixed(2) || '0.00'})
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Savings Analysis
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Current savings rate:{' '}
                                        {insights.totalIncome > 0
                                            ? ((insights.netSavings / insights.totalIncome) * 100).toFixed(1)
                                            : 0}
                                        % of income
                                    </p>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Net savings this period: ₨{insights.netSavings.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

