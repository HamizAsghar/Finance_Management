// "use client";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import React, { useState } from "react";
// import {
//     FaChartBar,
//     FaWallet,
//     FaBullseye,
//     FaPiggyBank,
//     FaFileAlt,
//     FaBell,
//     FaBook,
//     FaChevronLeft,
//     FaChevronRight,
//     FaUserShield,
// } from "react-icons/fa";

// const Sidebar = () => {
//     const pathname = usePathname();
//     const [isExpanded, setIsExpanded] = useState(true);

//     const toggleSidebar = () => {
//         setIsExpanded(!isExpanded);
//     };

//     const dashboardLinks = [
//         {
//             label: "Admin Page",
//             href: "/admin",
//             icon: <FaUserShield className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Expense",
//             href: "/admin/expense-tracker",
//             icon: <FaWallet className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Income",
//             href: "/admin/income-manager",
//             icon: <FaChartBar className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Set Budget",
//             href: "/admin/budget-planner",
//             icon: <FaBullseye className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Savings",
//             href: "/admin/savings-goals",
//             icon: <FaPiggyBank className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "General Ledger",
//             href: "/admin/general-ledger",
//             icon: <FaBook className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Reports",
//             href: "/admin/reports",
//             icon: <FaFileAlt className="text-amber-500 text-xl" />,
//         },
//         {
//             label: "Payment Reminder",
//             href: "/admin/payment-reminder",
//             icon: <FaBell className="text-amber-500 text-xl" />,
//         },
//     ];

//     return (
//         <div className="h-screen bg-black flex flex-col justify-between relative border-r border-gray-700">
//             <div className={`p-4 transition-all duration-300 ${isExpanded ? "w-56" : "w-20"}`}>
//                 <div className="flex justify-between items-center">
//                     <Link href={"/"} className="flex items-center">
//                         <span
//                             className={`text-xl font-bold text-amber-500 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
//                         >
//                         DASHBOARD
//                         </span>
//                     </Link>
//                 </div>

//                 <div className="mt-6 space-y-4">
//                     <div className={`grid grid-cols-1 gap-2 ${isExpanded ? "" : "justify-items-center"}`}>
//                         {dashboardLinks.map((link, index) => (
//                             <Link
//                                 key={index}
//                                 href={link.href}
//                                 className={`flex items-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 ${pathname === link.href ? "bg-gray-700 text-white" : ""}`}
//                             >
//                                 <div>{link.icon}</div>
//                                 <span
//                                     className={`ml-3 font-medium transition-opacity duration-300 ${isExpanded ? "opacity-100" : "hidden"}`}
//                                 >
//                                     {link.label}
//                                 </span>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </div>


//             <div className="absolute -right-4 top-5">
//                 <button
//                     onClick={toggleSidebar}
//                     className="w-8 h-8 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-center shadow-lg rounded-full"
//                 >
//                     {isExpanded ? <FaChevronLeft className="text-xl" /> : <FaChevronRight className="text-xl" />}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;




"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
    FaChartBar,
    FaWallet,
    FaBullseye,
    FaPiggyBank,
    FaFileAlt,
    FaBell,
    FaBook,
    FaChevronLeft,
    FaChevronRight,
    FaUserShield,
} from "react-icons/fa";

const Sidebar = () => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLinkClick = () => {
        if (isMobile) {
            setIsExpanded(false);
        }
    };

    const dashboardLinks = [
        {
            label: "Admin Page",
            href: "/admin",
            icon: <FaUserShield className="text-amber-500 text-xl" />,
        },
        {
            label: "Expense",
            href: "/admin/expense-tracker",
            icon: <FaWallet className="text-amber-500 text-xl" />,
        },
        {
            label: "Income",
            href: "/admin/income-manager",
            icon: <FaChartBar className="text-amber-500 text-xl" />,
        },
        {
            label: "Set Budget",
            href: "/admin/budget-planner",
            icon: <FaBullseye className="text-amber-500 text-xl" />,
        },
        {
            label: "Savings",
            href: "/admin/savings-goals",
            icon: <FaPiggyBank className="text-amber-500 text-xl" />,
        },
        {
            label: "General Ledger",
            href: "/admin/general-ledger",
            icon: <FaBook className="text-amber-500 text-xl" />,
        },
        {
            label: "Reports",
            href: "/admin/reports",
            icon: <FaFileAlt className="text-amber-500 text-xl" />,
        },
        {
            label: "Payment Reminder",
            href: "/admin/payment-reminder",
            icon: <FaBell className="text-amber-500 text-xl" />,
        },
    ];

    return (
        <div className="h-screen bg-black flex flex-col justify-between relative border-r border-gray-700">
            <div className={`p-4 transition-all duration-300 ${isExpanded ? "w-56" : "w-20"}`}>
                <div className="flex justify-between items-center">
                    <Link href={"/"} className="flex items-center">
                        <span
                            className={`text-xl font-bold text-amber-500 transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
                        >
                            DASHBOARD
                        </span>
                    </Link>
                </div>

                <div className="mt-6 space-y-4">
                    <div className={`grid grid-cols-1 gap-2 ${isExpanded ? "" : "justify-items-center"}`}>
                        {dashboardLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`flex items-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 ${pathname === link.href ? "bg-gray-700 text-white" : ""}`}
                            >
                                <div>{link.icon}</div>
                                <span
                                    className={`ml-3 font-medium transition-opacity duration-300 ${isExpanded ? "opacity-100" : "hidden"}`}
                                >
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute -right-4 top-5">
                <button
                    onClick={toggleSidebar}
                    className="w-8 h-8 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-center shadow-lg rounded-full"
                >
                    {isExpanded ? <FaChevronLeft className="text-xl" /> : <FaChevronRight className="text-xl" />}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
