'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts'
import { LogOut, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Swal from 'sweetalert2'
import LoadingAnimation from '@/Components/Loading'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

 
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    value: Math.random() * 100 + 50
  }))

  useEffect(() => {
    // Check authentication status
    if (status === 'loading') return // Wait for the session to load

    if (!session) {
      router.replace('/login') // Use replace instead of push to avoid browser history issues
      return
    }

    // Fetch data only when we have a session
    fetchData()
  }, [session, status])

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Logout',
        html: '<div class="text-center"><div class="text-4xl mb-4">👋</div>See you soon!</div>',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#ef4444',
      })

      if (result.isConfirmed) {
        await signOut({ redirect: false })

        // Show goodbye animation
        await Swal.fire({
          html: `
            <div class="text-center">
              <div class="text-4xl mb-4">👋</div>
              <div class="text-xl">Goodbye, ${session?.user?.name?.split(' ')[0]}!</div>
            </div>
          `,
          timer: 1500,
          showConfirmButton: false,
          backdrop: `
            rgba(0,0,0,0.4)
            url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_P7sC%7Banimation:spinner_svv2.4s linear infinite;transform-origin:center%7D.spinner_Poke%7Banimation:spinner_YpZS.4s linear infinite%7D@keyframes spinner_svv2%7B100%25%7Btransform:rotate(360deg)%7D%7D@keyframes spinner_YpZS%7B0%25%7Btransform:translate(0,0)%7D50%25%7Btransform:translate(0,15px)%7D100%25%7Btransform:translate(0,0)%7D%7D%3C/style%3E%3Cpath class='spinner_P7sC' d='M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21' opacity='0.4'%3E%3C/path%3E%3Cpath class='spinner_P7sC' d='M12,21L8.4,16.2C7.05,15.45 6,14.1 6,12.5C6,9.46 8.69,7 12,7C15.31,7 18,9.46 18,12.5C18,14.1 16.95,15.45 15.6,16.2L12,21' opacity='0.6'%3E%3C/path%3E%3Cpath class='spinner_P7sC' d='M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21' opacity='0.8'%3E%3C/path%3E%3Cpath class='spinner_P7sC' d='M12,21L8.4,16.2C7.05,15.45 6,14.1 6,12.5C6,9.46 8.69,7 12,7C15.31,7 18,9.46 18,12.5C18,14.1 16.95,15.45 15.6,16.2L12,21'%3E%3C/path%3E%3C/svg%3E")
            center center no-repeat
          `
        })

        router.push('/')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchData = async () => {
    if (!session?.user?.id) return // Don't fetch if we don't have a user ID

    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch('/api/incomes'),
        fetch('/api/expenses')
      ])

      const [incomeData, expenseData] = await Promise.all([
        incomeRes.json(),
        expenseRes.json()
      ])

      if (incomeData.success) {
        const total = incomeData.data
          .filter(income => income.userId === session.user.id)
          .reduce((sum, income) => sum + income.amount, 0)
        setTotalIncome(total)
      }

      if (expenseData.success) {
        const total = expenseData.data
          .filter(expense => expense.userId === session.user.id)
          .reduce((sum, expense) => sum + expense.amount, 0)
        setTotalExpenses(total)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || (loading && session)) {
    return <LoadingAnimation />
  }


  const waveAnimation = {
    animate: {
      rotate: [0, 14, -8, 14, -4, 10, 0],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-semibold text-gray-900"></div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <img
                  src={session?.user?.image || '/placeholder.svg'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-l from-amber-500 to-black text-white relative overflow-hidden shadow-xl"

      >
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              Welcome back, {session?.user?.name?.split(' ')[0]}
              <motion.span
                className="inline-block origin-[70%_70%]"
                variants={waveAnimation}
                animate="animate"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-amber-100 text-lg">
              Here's what's happening with your finances today
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +12.5%
                </span>
              </div>
              <h3 className="text-2xl font-bold">₨{totalIncome.toLocaleString()}</h3>
              <p className="text-sm text-green-600">+2.5% last week</p>
            </div>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="natural"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Total Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  +4.1%
                </span>
              </div>
              <h3 className="text-2xl font-bold">₨{totalExpenses.toLocaleString()}</h3>
              <p className="text-sm text-red-600">+4.1% last week</p>
            </div>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="natural"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Net Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  +8.4%
                </span>
              </div>
              <h3 className="text-2xl font-bold">₨{(totalIncome - totalExpenses).toLocaleString()}</h3>
              <p className="text-sm text-blue-600">+1.2% last week</p>
            </div>
            <div className="h-16 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line
                    type="natural"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
















