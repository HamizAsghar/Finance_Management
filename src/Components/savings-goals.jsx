'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Target, Wallet, TrendingUp, Calendar, Edit3, Trash2, PiggyBank, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const categories = [
    'Emergency Fund',
    'Vacation',
    'Education',
    'House',
    'Car',
    'Retirement',
    'Other'
];

const priorities = ['Low', 'Medium', 'High'];

export default function SavingsGoals() {
    const [goals, setGoals] = useState([]);
    const [editingGoal, setEditingGoal] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showContributeDialog, setShowContributeDialog] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [totalSaved, setTotalSaved] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);

    useEffect(() => {
        fetchGoals();
    }, []);

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
            console.error('Failed to fetch goals:', error);
        }
    };

    const updateStatistics = () => {
        const saved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
        const monthly = goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0);
        setTotalSaved(saved);
        setMonthlyTotal(monthly);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const goalData = {
            name: formData.get('name'),
            targetAmount: parseFloat(formData.get('targetAmount')),
            category: formData.get('category'),
            deadline: formData.get('deadline'),
            monthlyContribution: parseFloat(formData.get('monthlyContribution')),
            priority: formData.get('priority'),
            notes: formData.get('notes'),
            currentAmount: editingGoal ? editingGoal.currentAmount : 0,
            contributions: editingGoal ? editingGoal.contributions : []
        };

        const url = editingGoal ? `/api/savings-goals/${editingGoal._id}` : '/api/savings-goals';
        const method = editingGoal ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData),
            });
            const data = await response.json();
            if (data.success) {
                fetchGoals();
                setShowAddDialog(false);
                setEditingGoal(null);
            }
        } catch (error) {
            console.error('Failed to save goal:', error);
        }
    };

    const handleContribute = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const contribution = {
            amount: parseFloat(formData.get('amount')),
            note: formData.get('note')
        };

        try {
            const response = await fetch(`/api/savings-goals/${selectedGoal._id}/contribute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contribution),
            });
            const data = await response.json();
            if (data.success) {
                fetchGoals();
                setShowContributeDialog(false);
                setSelectedGoal(null);
            }
        } catch (error) {
            console.error('Failed to add contribution:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                const response = await fetch(`/api/savings-goals/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    fetchGoals();
                }
            } catch (error) {
                console.error('Failed to delete goal:', error);
            }
        }
    };

    const getProgressColor = (current, target) => {
        const progress = (current / target) * 100;
        if (progress >= 100) return 'bg-green-500';
        if (progress >= 75) return 'bg-blue-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Savings Goals</h1>
                    <p className="text-gray-600">Track and manage your savings goals</p>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <PlusCircle className="w-4 h-4" />
                            Add New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Goal Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={editingGoal?.name}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetAmount">Target Amount</Label>
                                <Input
                                    id="targetAmount"
                                    name="targetAmount"
                                    type="number"
                                    defaultValue={editingGoal?.targetAmount}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select name="category" defaultValue={editingGoal?.category || categories[0]}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deadline">Target Date</Label>
                                <Input
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    defaultValue={editingGoal?.deadline?.slice(0, 10)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                                <Input
                                    id="monthlyContribution"
                                    name="monthlyContribution"
                                    type="number"
                                    defaultValue={editingGoal?.monthlyContribution}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select name="priority" defaultValue={editingGoal?.priority || 'Medium'}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorities.map((priority) => (
                                            <SelectItem key={priority} value={priority}>
                                                {priority}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={editingGoal?.notes}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => {
                                    setShowAddDialog(false);
                                    setEditingGoal(null);
                                }}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₨{totalSaved.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₨{monthlyTotal.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{goals.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Savings by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ChartContainer
                                config={{
                                    savings: {
                                        label: "Savings",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categories.map(category => ({
                                                name: category,
                                                value: goals
                                                    .filter(goal => goal.category === category)
                                                    .reduce((sum, goal) => sum + goal.currentAmount, 0)
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={({ name, percent }) =>
                                                percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                                            }
                                        >
                                            {categories.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`hsl(${index * 45}, 70%, 50%)`}
                                                />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card>

