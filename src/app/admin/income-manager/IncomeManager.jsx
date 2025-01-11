"use client"

import { useState, useEffect } from 'react';
import { PlusCircle, Wallet, ArrowUpCircle, ArrowDownCircle, Edit3, Trash2, Search, SlidersHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Line, LineChart, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import LoadingAnimation from '@/Components/Loading';

const incomeCategories = [
    'Salary',
    'Freelancing',
    'Investments',
    'Business',
    'Rental',
    'Other'
];

function IncomeManager() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [incomes, setIncomes] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [highestIncome, setHighestIncome] = useState(0);
    const [lowestIncome, setLowestIncome] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-new');

    const COLORS = [
        '#4DD0E1',
        '#FF5252',
        '#FFB74D',
        '#FFEB3B',
        '#90CAF9',
        '#81C784',
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        } else if (status === 'authenticated') {
            fetchIncomes();
        }
    }, [status, router]);

    const fetchIncomes = async () => {
        try {
            const response = await fetch('/api/incomes');
            const data = await response.json();
            if (data.success) {
                setIncomes(data.data);
                updateIncomeStatistics(data.data);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch incomes', 'error');
        }
    };

    const updateIncomeStatistics = (incomesData) => {
        const total = incomesData.reduce((acc, income) => acc + income.amount, 0);
        setTotalIncome(total);
        const highest = Math.max(...incomesData.map((inc) => inc.amount), 0);
        setHighestIncome(highest);
        const lowest = Math.min(...incomesData.map((inc) => inc.amount), Infinity);
        setLowestIncome(lowest === Infinity ? 0 : lowest);
    };

    const handleSubmitIncome = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const incomeData = {
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            description: formData.get('description'),
            date: formData.get('date'),
            userId: session.user.id
        };

        const url = editMode ? `/api/incomes/${editingIncome._id}` : '/api/incomes';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(incomeData),
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire('Success', editMode ? 'Income updated successfully' : 'Income added successfully', 'success');
                fetchIncomes();
                setShowForm(false);
                setEditMode(false);
                setEditingIncome(null);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', `Failed to ${editMode ? 'update' : 'add'} income`, 'error');
        }
    };

    const handleEditIncome = (income) => {
        if (income.userId !== session.user.id) {
            Swal.fire('Error', 'You can only edit your own income records', 'error');
            return;
        }
        setEditingIncome(income);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDeleteIncome = async (id) => {
        const income = incomes.find(i => i._id === id);
        if (income.userId !== session.user.id) {
            Swal.fire('Error', 'You can only delete your own income records', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this income record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/incomes/${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Success', 'Income record deleted successfully', 'success');
                    fetchIncomes();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete income record', 'error');
            }
        }
    };

    // Filter and sort incomes
    const filteredAndSortedIncomes = incomes
        .filter(income =>
            income.userId === session.user.id &&
            (searchQuery === '' ||
                income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                income.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'amount-high':
                    return b.amount - a.amount;
                case 'amount-low':
                    return a.amount - b.amount;
                case 'date-old':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'date-new':
                default:
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });

    // Calculate category totals for the pie chart
    const categoryTotals = incomeCategories.reduce((acc, category) => {
        const total = filteredAndSortedIncomes
            .filter(e => e.category === category)
            .reduce((sum, e) => sum + e.amount, 0);
        if (total > 0) {
            acc.push({
                name: category,
                value: total,
                percentage: ((total / totalIncome) * 100).toFixed(0)
            });
        }
        return acc;
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingAnimation />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Income Manager
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your income with ease
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add Income
                    </button>
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
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₨{totalIncome.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <ArrowUpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Highest Income</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₨{highestIncome.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                <ArrowDownCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Lowest Income</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">₨{lowestIncome.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <SlidersHorizontal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Average Income</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{(totalIncome / (filteredAndSortedIncomes.length || 1)).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search incomes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="date-new">Newest First</option>
                                <option value="date-old">Oldest First</option>
                                <option value="amount-high">Highest Amount</option>
                                <option value="amount-low">Lowest Amount</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income by Category</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryTotals}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={2}
                                    >
                                        {categoryTotals.map((entry, index) => (
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
                                                {value} ({categoryTotals[index].percentage}%)
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income Over Time</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={filteredAndSortedIncomes}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                                        className="text-xs"
                                    />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                        formatter={(value) => [`₨${value.toFixed(2)}`, 'Amount']}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            padding: '8px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Income List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Incomes</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Showing {filteredAndSortedIncomes.length} incomes
                        </p>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAndSortedIncomes.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No incomes found
                            </div>
                        ) : (
                            filteredAndSortedIncomes.map((income) => (
                                <div
                                    key={income._id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                                    {income.category.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {income.description}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm rounded-lg">
                                                        {income.category}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {new Date(income.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                ₨{income.amount.toFixed(2)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditIncome(income)}
                                                    className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteIncome(income._id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Income Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
                        <form onSubmit={handleSubmitIncome} className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {editMode ? 'Edit Income' : 'Add New Income'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingIncome(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        defaultValue={editMode ? editingIncome.amount : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        defaultValue={editMode ? editingIncome.category : incomeCategories[0]}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {incomeCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        name="description"
                                        defaultValue={editMode ? editingIncome.description : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter description"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        defaultValue={editMode ? editingIncome.date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingIncome(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                                >
                                    {editMode ? 'Update Income' : 'Add Income'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IncomeManager;