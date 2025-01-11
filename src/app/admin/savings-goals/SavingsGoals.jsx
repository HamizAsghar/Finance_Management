'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Target, Wallet, TrendingUp, Edit3, Trash2, PiggyBank, Search, ArrowUpCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Swal from 'sweetalert2';

const goalCategories = [
    'Emergency Fund',
    'Vacation',
    'Education',
    'Home',
    'Vehicle',
    'Retirement',
    'Other'
];

export default function SavingsGoals() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goals, setGoals] = useState([]);
    const [totalSaved, setTotalSaved] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        } else if (status === 'authenticated') {
            fetchGoals();
        }
    }, [status, router]);

    useEffect(() => {
        updateStatistics();
    }, [goals]);

    const fetchGoals = async () => {
        try {
            const response = await fetch('/api/savings-goals');
            const data = await response.json();
            if (data.success) {
                setGoals(data.data);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch savings goals', 'error');
        }
    };

    const updateStatistics = () => {
        const saved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
        const target = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
        setTotalSaved(saved);
        setTotalTarget(target);
    };

    const handleSubmitGoal = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const goalData = {
            title: formData.get('title'),
            targetAmount: parseFloat(formData.get('targetAmount')),
            currentAmount: parseFloat(formData.get('currentAmount') || '0'),
            category: formData.get('category'),
            targetDate: formData.get('targetDate'),
            monthlyContribution: parseFloat(formData.get('monthlyContribution')),
            description: formData.get('description'),
            status: 'In Progress',
            userId: session.user.id
        };

        const url = editMode ? `/api/savings-goals/${editingGoal._id}` : '/api/savings-goals';
        const method = editMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData),
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire('Success', `Savings goal ${editMode ? 'updated' : 'created'} successfully`, 'success');
                fetchGoals();
                setShowForm(false);
                setEditMode(false);
                setEditingGoal(null);
            }
        } catch (error) {
            Swal.fire('Error', `Failed to ${editMode ? 'update' : 'create'} savings goal`, 'error');
        }
    };

    const handleDeleteGoal = async (id) => {
        const goal = goals.find(g => g._id === id);
        if (goal.userId !== session.user.id) {
            Swal.fire('Error', 'You can only delete your own savings goals', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this savings goal?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/savings-goals/${id}`, { method: 'DELETE' });
                const data = await response.json();
                if (data.success) {
                    Swal.fire('Success', 'Savings goal deleted successfully', 'success');
                    fetchGoals();
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to delete savings goal', 'error');
            }
        }
    };

    const handleUpdateProgress = async (goal, amount) => {
        if (goal.userId !== session.user.id) {
            Swal.fire('Error', 'You can only update your own savings goals', 'error');
            return;
        }

        const newAmount = goal.currentAmount + parseFloat(amount);
        if (newAmount > goal.targetAmount) {
            Swal.fire('Warning', 'Amount exceeds the target', 'warning');
            return;
        }

        try {
            const response = await fetch(`/api/savings-goals/${goal._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...goal,
                    currentAmount: newAmount,
                    status: newAmount >= goal.targetAmount ? 'Completed' : 'In Progress'
                }),
            });
            const data = await response.json();
            if (data.success) {
                fetchGoals();
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to update progress', 'error');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-indigo-600 font-medium">Loading your goals...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const filteredGoals = goals.filter(goal =>
        goal.userId === session.user.id &&
        (searchQuery === '' ||
            goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            goal.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            goal.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Savings
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Track and achieve your savings goals
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Add New Goal
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                <PiggyBank className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Saved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₨{totalSaved.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Target</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₨{totalTarget.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <ArrowUpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
                                    </p>
                                    <p className="text-sm text-gray-500">of total target</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search goals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                {/* Goals List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Savings Goals</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Showing {filteredGoals.length} goals
                        </p>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredGoals.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'No matching goals found' : 'No savings goals yet. Start by adding a new goal!'}
                            </div>
                        ) : (
                            filteredGoals.map((goal) => (
                                <div
                                    key={goal._id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                                                    {goal.category.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm rounded-lg">
                                                        {goal.category}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Monthly: ₨{goal.monthlyContribution.toFixed(2)}
                                                </p>
                                                {goal.description && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {goal.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (goal.userId !== session.user.id) {
                                                            Swal.fire('Error', 'You can only edit your own savings goals', 'error');
                                                            return;
                                                        }
                                                        setEditingGoal(goal);
                                                        setEditMode(true);
                                                        setShowForm(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    <Edit3 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGoal(goal._id)}
                                                    className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="w-full sm:w-64">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        ₨{goal.currentAmount.toFixed(2)}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        ₨{goal.targetAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm text-right text-gray-500 dark:text-gray-400 mt-1">
                                                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete
                                                </p>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <input
                                                    type="number"
                                                    placeholder="Add amount"
                                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateProgress(goal, e.target.value);
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        const input = e.currentTarget.previousElementSibling;
                                                        handleUpdateProgress(goal, input.value);
                                                        input.value = '';
                                                    }}
                                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                                                >
                                                    Add
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

            {/* Add/Edit Goal Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSubmitGoal} className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {editMode ? 'Edit Savings Goal' : 'Create New Savings Goal'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingGoal(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Goal Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={editMode ? editingGoal.title : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter goal title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        defaultValue={editMode ? editingGoal.category : goalCategories[0]}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        {goalCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Target Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="targetAmount"
                                        defaultValue={editMode ? editingGoal.targetAmount : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter target amount"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Monthly Contribution
                                    </label>
                                    <input
                                        type="number"
                                        name="monthlyContribution"
                                        defaultValue={editMode ? editingGoal.monthlyContribution : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Enter monthly contribution"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        name="targetDate"
                                        defaultValue={editMode ? editingGoal.targetDate.slice(0, 10) : ''}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        defaultValue={editMode ? editingGoal.description : ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                                        placeholder="Enter description (optional)"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditMode(false);
                                        setEditingGoal(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                                >
                                    {editMode ? 'Update Goal' : 'Create Goal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

