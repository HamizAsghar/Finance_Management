'use client';

import { useState, useEffect } from 'react';
import { BookOpen, RefreshCcw, Download, Filter, Search, TrendingUp, ArrowUpCircle, ArrowDownCircle, FileText } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function GeneralLedger() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [entries, setEntries] = useState([]);
    const [summary, setSummary] = useState({
        debitTotal: 0,
        creditTotal: 0,
        netBalance: 0
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [filterType, setFilterType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        } else if (status === 'authenticated') {
            fetchLedgerEntries();
        }
    }, [status, dateRange, filterType]);

    const fetchLedgerEntries = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                ...(filterType && { type: filterType })
            });

            const response = await fetch(`/api/general-ledger?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setEntries(data.data.entries);
                setSummary(data.data.summary);
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch ledger entries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const syncLedger = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/general-ledger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'sync' })
            });
            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', 'Ledger synchronized successfully', 'success');
                fetchLedgerEntries();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to synchronize ledger', 'error');
        } finally {
            setLoading(false);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Company Logo/Header
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185);
        doc.text('General Ledger Report', 105, 20, { align: 'center' });

        // User Information Section
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Generated for:', 14, 40);
        doc.setFont(undefined, 'bold');
        doc.text(session.user.name, 50, 40);
        doc.setFont(undefined, 'normal');
        doc.text('Email:', 14, 48);
        doc.setFont(undefined, 'bold');
        doc.text(session.user.email, 50, 48);

        // Date Range Section
        doc.setFont(undefined, 'normal');
        doc.text('Period:', 14, 60);
        doc.setFont(undefined, 'bold');
        doc.text(`${new Date(dateRange.startDate).toLocaleDateString()} to ${new Date(dateRange.endDate).toLocaleDateString()}`, 50, 60);

        // Financial Summary Section
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text('Financial Summary', 14, 75);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const summaryData = [
            ['Total Credits:', `₨ ${summary.creditTotal.toFixed(2)}`],
            ['Total Debits:', `₨ ${summary.debitTotal.toFixed(2)}`],
            ['Net Balance:', `₨ ${summary.netBalance.toFixed(2)}`],
            ['Status:', summary.netBalance >= 0 ? 'Profit' : 'Loss']
        ];

        summaryData.forEach((row, index) => {
            doc.setFont(undefined, 'normal');
            doc.text(row[0], 20, 90 + (index * 8));
            doc.setFont(undefined, 'bold');
            doc.text(row[1], 70, 90 + (index * 8));
        });

        // Prepare table data
        const tableData = entries.map(entry => [
            new Date(entry.transactionDate).toLocaleDateString(),
            entry.transactionType,
            entry.description,
            entry.category,
            entry.subcategory || '',
            `₨ ${entry.amount.toFixed(2)}`,
            entry.debitCredit
        ]);

        // Add table
        doc.autoTable({
            head: [['Date', 'Type', 'Description', 'Category', 'Subcategory', 'Amount', 'Debit/Credit']],
            body: tableData,
            startY: 130,
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [79, 70, 229],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250]
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 25 },
                2: { cellWidth: 40 },
                3: { cellWidth: 30 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25, halign: 'right' },
                6: { cellWidth: 25, halign: 'center' }
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
            doc.text(
                `Generated on ${new Date().toLocaleString()}`,
                14,
                doc.internal.pageSize.height - 10
            );
        }

        // Save the PDF
        doc.save(`general-ledger-${session.user.name}-${dateRange.startDate}-to-${dateRange.endDate}.pdf`);
    };

    const filteredEntries = entries.filter(entry =>
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.subcategory && entry.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const chartData = entries.reduce((acc, entry) => {
        const date = new Date(entry.transactionDate).toLocaleDateString();
        const existing = acc.find(item => item.date === date);

        if (existing) {
            if (entry.debitCredit === 'DEBIT') {
                existing.debits += entry.amount;
            } else {
                existing.credits += entry.amount;
            }
        } else {
            acc.push({
                date,
                debits: entry.debitCredit === 'DEBIT' ? entry.amount : 0,
                credits: entry.debitCredit === 'CREDIT' ? entry.amount : 0
            });
        }

        return acc;
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-indigo-600 font-medium">Loading your ledger...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            General Ledger
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Complete financial records and transactions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={syncLedger}
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Sync Ledger
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
                        >
                            <FileText className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>
                </div> */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            General Ledger
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Complete financial records and transactions
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={syncLedger}
                            disabled={loading}
                            className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 text-center"
                        >
                            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Sync Ledger
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 text-center"
                        >
                            <FileText className="w-4 h-4" />
                            Export PDF
                        </button>
                    </div>
                </div>


                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                <ArrowUpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₨{summary.creditTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                <ArrowDownCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Debits</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">₨{summary.debitTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₨{summary.netBalance.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {summary.netBalance >= 0 ? 'Profit' : 'Loss'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Overview</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar name="Credits" dataKey="credits" fill="rgb(99, 102, 241)" />
                                <Bar name="Debits" dataKey="debits" fill="rgb(168, 85, 247)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date Range
                            </label>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Transaction Type
                            </label>
                            <div className="relative">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="INCOME">Income</option>
                                    <option value="EXPENSE">Expense</option>
                                    <option value="SAVINGS">Savings</option>
                                    <option value="BUDGET">Budget</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search entries..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Ledger Entries */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ledger Entries</h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                Loading entries...
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                No entries found
                            </div>
                        ) : (
                            filteredEntries.map((entry) => (
                                <div key={entry._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(entry.transactionDate).toLocaleDateString()}
                                            </p>
                                            <h3 className="font-bold text-gray-900 dark:text-white">
                                                {entry.description}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm rounded-lg">
                                                    {entry.category}
                                                </span>
                                                {entry.subcategory && (
                                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-sm rounded-lg">
                                                        {entry.subcategory}
                                                    </span>
                                                )}
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg">
                                                    {entry.transactionType}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-semibold ${entry.debitCredit === 'CREDIT' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {entry.debitCredit === 'CREDIT' ? '+' : '-'}₨{entry.amount.toFixed(2)}
                                            </span>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {entry.debitCredit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}





