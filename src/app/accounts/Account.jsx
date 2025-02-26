"use client";

import Link from "next/link";
import { BarChart3, Wallet, Building2, User, Shield, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Account() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-white"
        >
            <h1 className="text-center text-3xl font-bold tracking-tight text-amber-500 sm:text-4xl">
                Finance Management Features
            </h1>

            {/* Icons Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: (i = 1) => ({
                        opacity: 1,
                        x: 0,
                        transition: {
                            delay: i * 0.3,
                            duration: 0.8,
                        },
                    }),
                }}
                className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6"
            >
                {[
                    { Icon: BarChart3, text: "Track Your Budgets Effectively" },
                    { Icon: Wallet, text: "Analyze Expenses with Real-time Data" },
                    { Icon: Shield, text: "Secure Payments and Transactions" },
                    { Icon: FileText, text: "Monthly Reports and Insights" },
                    { Icon: User, text: "User Profiles for Personalized Management" },
                    { Icon: Building2, text: "Set and Achieve Savings Goals" },
                ].map((feature, index) => (
                    <motion.div
                        key={index}
                        className="flex flex-col items-center text-center transform transition duration-300 hover:scale-110"
                        custom={index}
                    >
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white p-4 shadow-lg cursor-pointer">
                            <feature.Icon className="h-12 w-12 text-amber-500" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium">{feature.text}</h3>
                    </motion.div>
                ))}
            </motion.div>

            {/* Features List */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: (i = 1) => ({
                        opacity: 1,
                        x: 0,
                        transition: {
                            delay: i * 0.4,
                            duration: 0.8,
                        },
                    }),
                }}
                className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2"
            >
                <div className="space-y-4">
                    {[
                        "0% COMMISSION ON PAYMENTS",
                        "NO HIDDEN TRANSACTION FEES",
                        "FREE BUDGETING TOOLS",
                        "SECURE DATA ENCRYPTION",
                    ].map((text, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-amber-500" />
                            <p className="text-sm">{text}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[
                        "REAL-TIME EXPENSE TRACKING",
                        "CUSTOM FINANCIAL INSIGHTS",
                        "ACCESS ANYWHERE, ANYTIME",
                        "24/7 CUSTOMER SUPPORT",
                    ].map((text, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ArrowRight className="h-5 w-5 text-amber-500" />
                            <p className="text-sm">{text}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Bottom Text and CTA */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-16 text-center"
            >
                <p className="text-sm text-gray-600">
                    Manage your finances seamlessly with our state-of-the-art tools.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    Track expenses, set budgets, and achieve financial goals—all in one place.
                </p>
                <p className="mt-2 text-sm text-gray-500">Read Our Terms & Conditions</p>
                <Link
                    href="#"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600"
                >
                    Learn more about our features
                    <ArrowRight className="h-5 w-5 text-amber-500" />
                </Link>
            </motion.div>
        </motion.div>
    );
}
