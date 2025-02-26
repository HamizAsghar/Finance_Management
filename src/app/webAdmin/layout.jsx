"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    FaTachometerAlt,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from "react-icons/fa"

export default function WebAdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
            setSidebarOpen(window.innerWidth > 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleLogout = async () => {
        await router.push('/webAdmin');
    }

    // Skip layout on login page
    if (pathname === '/webAdmin') {
        return <>{children}</>
    }

    return (
        <div className="flex h-screen bg-black">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                        <span className="text-xl font-bold text-amber-500">HamizAsghar</span>
                        {isMobile && (
                            <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white">
                                <FaTimes className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4">
                        <Link
                            href="/webAdmin/dashboard"
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === '/webAdmin/dashboard'
                                ? "bg-amber-500 text-black"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <FaTachometerAlt className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            <FaSignOutAlt className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Header */}
                <header className="flex items-center h-16 px-6 bg-gray-900 border-b border-gray-800">
                    {isMobile && (
                        <button onClick={() => setSidebarOpen(true)} className="p-2 mr-4 text-gray-400 hover:text-white">
                            <FaBars className="w-6 h-6" />
                        </button>
                    )}
                    <h1 className="text-xl font-semibold text-amber-500">Dashboard</h1>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-black">{children}</main>
            </div>
        </div>
    )
}
