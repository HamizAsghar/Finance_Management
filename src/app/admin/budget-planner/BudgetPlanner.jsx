"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusCircle, AlertTriangle, Wallet, TrendingDown, BarChart3, Edit3, Trash2, Bell, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Swal from 'sweetalert2';
import LoadingAnimation from '@/Components/Loading';

// Categories remain unchanged for functionality
const categories = [
    'Food',
    'Transportation',
    'Health',
    'Entertainment',
    'Shopping',
    'Bills',
    'Others'
];

// Custom colors for consistent styling
const COLORS = {
    primary: '#8b5cf6',
    secondary: '#4f46e5',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    blue: '#3b82f6',
};

export default function BudgetPlanner() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [alerts, setAlerts] = useState([]);
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        } else if (status === 'authenticated') {
            fetchBudgets();
        }
    }, [status, selectedMonth, router]);

    useEffect(() => {
        updateStatistics();
        checkBudgetAlerts();
    }, [budgets]);

    const fetchBudgets = async () => {
        try {
            const response = await fetch(`/api/budgets?month=${selectedMonth}`);
            const data = await response.json();
            if (data.success) {
                setBudgets(data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch budgets', 'error');
        }
    };

    const updateStatistics = () => {
        const total = budgets.reduce((acc, budget) => acc + budget.amount, 0);
        const spent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
        setTotalBudget(total);
        setTotalSpent(spent);
    };

    const checkBudgetAlerts = () => {
        const newAlerts = budgets.filter(budget => {
            const percentageSpent = (budget.spent / budget.amount) * 100;
            return percentageSpent >= 80;
        }).map(budget => ({
            category: budget.category,
            message: `${budget.category} budget is ${Math.round((budget.spent / budget.amount) * 100)}% spent`,
            severity: budget.spent >= budget.amount ? 'critical' : 'warning'
        }));
        setAlerts(newAlerts);
    };

    const handleSubmitBudget = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const budgetData = {
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount')),
            month: new Date(selectedMonth),
            spent: editMode ? editingBudget.spent : 0,
            userId: session.user.id
        };

        const url = editMode ? `/api/budgets/${editingBudget._id}` : '/api/budgets';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData),
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire('Success', `Budget ${editMode ? 'updated' : 'added'} successfully`, 'success');
                fetchBudgets();
                setShowForm(false);
                setEditMode(false);
                setEditingBudget(null);
            }
        } catch (error) {
            Swal.fire('Error', `Failed to ${editMode ? 'update' : 'add'} budget`, 'error');
        }
    };

    const handleUpdateSpent = async (budget, newSpent) => {
        if (budget.userId !== session.user.id) {
            Swal.fire('Error', 'You can only update your own budgets', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/budgets/${budget._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...budget, spent: newSpent }),
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire('Success', 'Your expense has been added successfully!', 'success');
                fetchBudgets();
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update spent amount', 'error');
        }
    };

    const handleDeleteBudget = async (id) => {
        const budget = budgets.find(b => b._id === id);
        if (budget.userId !== session.user.id) {
            Swal.fire('Error', 'You can only delete your own budgets', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this budget?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Success', 'Budget deleted successfully', 'success');
                    fetchBudgets();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete budget', 'error');
            }
        }
    };

    if (status === 'loading') {
        return (
        <LoadingAnimation/>
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
                            Budget Planner
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Plan and track your monthly budgets
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Set New Budget
                        </button>
                    </div>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 mb-4">
                            <AlertTriangle className="w-5 h-5" />
                            <h2 className="font-semibold">Budget Alerts</h2>
                        </div>
                        <div className="space-y-3">
                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-sm ${alert.severity === 'critical'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-yellow-600 dark:text-yellow-400'
                                        }`}
                                >
                                    <Bell className="w-4 h-4" />
                                    {alert.message}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{totalBudget.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{totalSpent.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                    ₨{(totalBudget - totalSpent).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Budget vs Spending</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={budgets}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="category"
                                    tick={{ fill: 'currentColor' }}
                                    className="text-gray-600 dark:text-gray-400"
                                />
                                <YAxis
                                    tick={{ fill: 'currentColor' }}
                                    className="text-gray-600 dark:text-gray-400"
                                />
                                <Tooltip
                                    formatter={(value) => `₨${value}`}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.5rem',
                                        padding: '0.75rem'
                                    }}
                                />
                                <Legend />
                                <Bar name="Budget" dataKey="amount" fill={COLORS.primary}>
                                    {budgets.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS.primary} />
                                    ))}
                                </Bar>
                                <Bar name="Spent" dataKey="spent" fill={COLORS.success}>
                                    {budgets.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.spent > entry.amount ? COLORS.danger : COLORS.success}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Budget Details */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Budget Details</h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {budgets.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No budgets set for this month
                            </div>
                        ) : (
                            budgets.map((budget) => (
                                <div key={budget._id} className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {budget.category}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Budget: ₨{budget.amount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingBudget(budget);
                                                    setEditMode(true);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBudget(budget._id)}
                                                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Spent: ₨{budget.spent.toFixed(2)}
                                                </span>
                                                <span className={`font-medium ${budget.spent >= budget.amount
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : budget.spent / budget.amount >= 0.8
                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                        : 'text-green-600 dark:text-green-400'
                                                    }`}>
                                                    {Math.round((budget.spent / budget.amount) * 100)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${budget.spent >= budget.amount
                                                        ? 'bg-red-500'
                                                        : budget.spent / budget.amount >= 0.8
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        }`}
                                                    style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-2 transform  text-gray-400 w-8 h-8"> Rs </span>
                                                <input
                                                    type="number"
                                                    placeholder="Add expense"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const newSpent = parseFloat(e.target.value) + budget.spent;
                                                            handleUpdateSpent(budget, newSpent);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling.querySelector('input');
                                                    const newSpent = parseFloat(input.value) + budget.spent;
                                                    handleUpdateSpent(budget, newSpent);
                                                    input.value = '';
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg">
                        <form onSubmit={handleSubmitBudget} className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {editMode ? 'Edit Budget' : 'Set New Budget'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingBudget(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        defaultValue={editMode ? editingBudget.category : categories[0]}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Budget Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 transform  text-gray-400 w-8 h-8" >Rs</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            defaultValue={editMode ? editingBudget.amount : ''}
                                            required
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingBudget(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                                >
                                    {editMode ? 'Update Budget' : 'Set Budget'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}