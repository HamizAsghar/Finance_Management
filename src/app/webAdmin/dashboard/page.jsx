"use client"

import { useState, useEffect } from "react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { FaUsers, FaMoneyBillWave, FaChartLine } from "react-icons/fa"

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        stats: {
            totalUsers: 0,
            totalTransactions: 0,
            totalAmount: 0,
        },
        chartData: {
            userGrowth: [],
            transactionVolume: [],
            categoryDistribution: [],
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/webAdmin/dashboard")
                const result = await response.json()
                if (result.success) {
                    setData(result.data)
                }
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <FaUsers className="text-amber-500 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-white">{data.stats.totalUsers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <FaMoneyBillWave className="text-amber-500 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-gray-400">Total Transactions</p>
                            <p className="text-2xl font-bold text-white">{data.stats.totalTransactions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300">
                    <div className="flex items-center">
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <FaChartLine className="text-amber-500 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-gray-400">Total Amount</p>
                            <p className="text-2xl font-bold text-white">₨{data.stats.totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-6">User Growth</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.chartData.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderColor: "#4B5563" }} />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transaction Volume Chart */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-6">Transaction Volume</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.chartData.transactionVolume}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderColor: "#4B5563" }} />
                                <Legend />
                                <Bar dataKey="income" fill="#F59E0B" />
                                <Bar dataKey="expenses" fill="#EF4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}