"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, Plus, Calendar, DollarSign, Tag, Clock, Check, X, AlertTriangle, Edit, Trash2, Filter, RefreshCw, AlarmClock } from 'lucide-react'
import Swal from 'sweetalert2'
import useSound from 'use-sound'

// Since we don't have access to shadcn components, we'll create minimal versions here
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    const variants = {
        default: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
        outline: "border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    }
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-purple-500 ${className}`}
            {...props}
        />
    )
}

const Select = ({ children, className = "", ...props }) => {
    return (
        <select
            className={`flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-purple-500 ${className}`}
            {...props}
        >
            {children}
        </select>
    )
}

const Label = ({ className = "", ...props }) => {
    return (
        <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
            {...props}
        />
    )
}

const Card = ({ children, className = "" }) => {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 ${className}`}>
            {children}
        </div>
    )
}

const categories = ['Utilities', 'Rent', 'Insurance', 'Subscription', 'Loan', 'Credit Card', 'Other']
const recurringTypes = ['none', 'daily', 'weekly', 'monthly', 'yearly']

export default function PaymentReminders() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [reminders, setReminders] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingReminder, setEditingReminder] = useState(null)
    const [filters, setFilters] = useState({
        status: '',
        category: ''
    })
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        overdue: 0,
        paid: 0
    })

    // Prevent multiple fetches
    const fetchInProgress = useRef(false)

    // Add sound effects
    const [playAlertSound] = useSound('/sounds/alert.mp3')
    const [playSuccessSound] = useSound('/sounds/success.mp3')

    const fetchReminders = useCallback(async () => {
        if (fetchInProgress.current) return
        try {
            fetchInProgress.current = true
            setLoading(true)
            const queryParams = new URLSearchParams(filters).toString()
            const response = await fetch(`/api/payment-reminders?${queryParams}`)
            const data = await response.json()

            if (data.success) {
                setReminders(data.data)
                // Calculate stats
                const total = data.data.reduce((acc, rem) => acc + rem.amount, 0)
                const pending = data.data.filter(rem => rem.status === 'pending').length
                const overdue = data.data.filter(rem => rem.status === 'overdue').length
                const paid = data.data.filter(rem => rem.status === 'paid').length
                setStats({ total, pending, overdue, paid })
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Failed to fetch reminders:', error)
            Swal.fire('Error', 'Failed to fetch reminders', 'error')
        } finally {
            setLoading(false)
            fetchInProgress.current = false
        }
    }, [filters])

    const handleStatusUpdate = useCallback(async (id, newStatus) => {
        if (loading) return
        try {
            setLoading(true)
            const response = await fetch('/api/payment-reminders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            })

            const data = await response.json()

            if (data.success) {
                if (newStatus === 'paid') {
                    playSuccessSound()
                }

                Swal.fire({
                    title: 'Success!',
                    text: 'Payment status updated successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                })
                fetchReminders()
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Failed to update status:', error)
            Swal.fire('Error', 'Failed to update status', 'error')
        } finally {
            setLoading(false)
        }
    }, [loading, fetchReminders, playSuccessSound])

    const handleDelete = async (id) => {
        if (loading) return
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            })

            if (result.isConfirmed) {
                setLoading(true)
                const response = await fetch(`/api/payment-reminders?id=${id}`, {
                    method: 'DELETE'
                })

                const data = await response.json()

                if (data.success) {
                    Swal.fire('Deleted!', 'Reminder has been deleted.', 'success')
                    fetchReminders()
                } else {
                    throw new Error(data.message)
                }
            }
        } catch (error) {
            console.error('Failed to delete reminder:', error)
            Swal.fire('Error', 'Failed to delete reminder', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading) return
        try {
            setLoading(true)
            const formData = new FormData(e.target)

            const date = formData.get('dueDate')
            const time = formData.get('dueTime')
            const dueDate = new Date(`${date}T${time}`)

            const reminderData = {
                title: formData.get('title'),
                amount: parseFloat(formData.get('amount')),
                category: formData.get('category'),
                dueDate: dueDate.toISOString(),
                description: formData.get('description'),
                recurringType: formData.get('recurringType'),
                notificationDays: parseInt(formData.get('notificationDays')),
            }

            if (editingReminder) {
                reminderData.id = editingReminder._id
            }

            const response = await fetch('/api/payment-reminders', {
                method: editingReminder ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reminderData),
            })

            const data = await response.json()

            if (data.success) {
                Swal.fire('Success', `Reminder ${editingReminder ? 'updated' : 'added'} successfully`, 'success')
                setShowForm(false)
                setEditingReminder(null)
                fetchReminders()
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            console.error('Failed to submit reminder:', error)
            Swal.fire('Error', `Failed to ${editingReminder ? 'update' : 'add'} reminder`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const checkDueReminders = useCallback(() => {
        const now = new Date()
        reminders.forEach(reminder => {
            const dueDateTime = new Date(reminder.dueDate)
            if (reminder.status === 'pending' &&
                dueDateTime.getTime() <= now.getTime() &&
                dueDateTime.getTime() > now.getTime() - 60000) {
                playAlertSound()

                Swal.fire({
                    title: 'Payment Due!',
                    text: `${reminder.title} is due now! Amount: ₨${reminder.amount}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Mark as Paid',
                    cancelButtonText: 'Snooze 1 hour',
                    showCloseButton: true,
                })
            }
        })
    }, [reminders, playAlertSound])

    // Authentication and initial fetch
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/')
        } else if (status === 'authenticated' && !fetchInProgress.current) {
            fetchReminders()
        }
    }, [status, router, fetchReminders])

    // Reminder checking interval
    useEffect(() => {
        const intervalId = setInterval(checkDueReminders, 60000)
        return () => clearInterval(intervalId)
    }, [checkDueReminders])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Payment Reminders
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Track and manage your upcoming payments
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingReminder(null)
                            setShowForm(true)
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Reminder
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount Due</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        ₨{stats.total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl">
                                    <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.pending}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.overdue}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Paid</p>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        {stats.paid}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full sm:w-[180px]"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </Select>

                            <Select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full sm:w-[180px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </Select>

                            <Button
                                variant="outline"
                                onClick={() => setFilters({ status: '', category: '' })}
                                className="sm:ml-auto"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Reminders List */}
                <div className="space-y-4">
                    {loading ? (
                        <Card className="p-8">
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                            </div>
                        </Card>
                    ) : reminders.length === 0 ? (
                        <Card className="p-8">
                            <div className="text-center">
                                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No reminders found</h3>
                                <p className="text-gray-600 dark:text-gray-400">Add your first payment reminder to get started</p>
                            </div>
                        </Card>
                    ) : (
                        reminders.map((reminder) => (
                            <Card key={reminder._id}>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm ${reminder.status === 'paid'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : reminder.status === 'overdue'
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {reminder.status === 'paid' ? <Check className="w-4 h-4" /> :
                                                        reminder.status === 'overdue' ? <AlertTriangle className="w-4 h-4" /> :
                                                            <Clock className="w-4 h-4" />}
                                                    {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                                                </span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600 dark:text-gray-400">{reminder.category}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {reminder.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                {reminder.description}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                    <DollarSign className="w-4 h-4" />
                                                    Amount: ₨{reminder.amount.toFixed(2)}
                                                </div>
                                                {reminder.recurringType !== 'none' && (
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <RefreshCw className="w-4 h-4" />
                                                        {reminder.recurringType.charAt(0).toUpperCase() + reminder.recurringType.slice(1)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {reminder.status !== 'paid' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(reminder._id, 'paid')}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingReminder(reminder)
                                                    setShowForm(true)
                                                }}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(reminder._id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center py-8">
                        <Card className="w-full max-w-lg">
                            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                                <div className="p-6 space-y-6">
                                    <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-950 z-10 pb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {editingReminder ? 'Update your payment reminder details' : 'Create a new payment reminder'}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setShowForm(false)
                                                setEditingReminder(null)
                                            }}
                                            className="shrink-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                defaultValue={editingReminder?.title}
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                name="amount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                defaultValue={editingReminder?.amount}
                                                required
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                id="category"
                                                name="category"
                                                defaultValue={editingReminder?.category || categories[0]}
                                                className="w-full"
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="dueDate">Due Date</Label>
                                                <Input
                                                    id="dueDate"
                                                    name="dueDate"
                                                    type="date"
                                                    defaultValue={editingReminder?.dueDate?.split('T')[0]}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dueTime">Due Time</Label>
                                                <Input
                                                    id="dueTime"
                                                    name="dueTime"
                                                    type="time"
                                                    defaultValue={editingReminder?.dueDate ? new Date(editingReminder.dueDate).toTimeString().slice(0, 5) : ''}
                                                    required
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                name="description"
                                                defaultValue={editingReminder?.description}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="recurringType">Recurring Type</Label>
                                            <Select
                                                id="recurringType"
                                                name="recurringType"
                                                defaultValue={editingReminder?.recurringType || 'none'}
                                                className="w-full"
                                            >
                                                {recurringTypes.map(type => (
                                                    <option key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="notificationDays">Notification Days Before</Label>
                                            <Input
                                                id="notificationDays"
                                                name="notificationDays"
                                                type="number"
                                                min="0"
                                                defaultValue={editingReminder?.notificationDays || 3}
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white dark:bg-gray-950 z-10">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowForm(false)
                                                    setEditingReminder(null)
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Saving...' : editingReminder ? 'Update Reminder' : 'Add Reminder'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

