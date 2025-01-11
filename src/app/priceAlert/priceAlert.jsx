'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const data = [
    { year: 2000, price: 8000 },
    { year: 2002, price: 10000 },
    { year: 2004, price: 12000 },
    { year: 2006, price: 15000 },
    { year: 2008, price: 20000 },
    { year: 2010, price: 25000 },
    { year: 2012, price: 35000 },
    { year: 2014, price: 30000 },
    { year: 2015, price: 28000 },
]

export default function PriceAlert() {
    const [hoveredPoint, setHoveredPoint] = useState(null)

    const maxPrice = Math.max(...data.map(d => d.price))
    const minPrice = Math.min(...data.map(d => d.price))

    const getY = (price) => {
        return 350 - ((price - minPrice) / (maxPrice - minPrice)) * 300
    }

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * 900,
        y: getY(d.price),
        ...d
    }))

    const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 16px', fontFamily: 'Arial, sans-serif' }}>
            {/* Animated Heading */}
            <motion.h1
                className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-9"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
            >
                Manage Your Expenses
            </motion.h1>

            {/* Graph Section */}
            <motion.div
                style={{ backgroundColor: '#F59E0B', color: 'white', borderRadius: '8px', overflow: 'hidden' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                viewport={{ once: true }}
            >
                <div style={{ padding: '20px' }}>
                    <svg width="100%" height="400" viewBox="0 0 1000 400" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <line
                                key={i}
                                x1="0"
                                y1={i * 75 + 50}
                                x2="1000"
                                y2={i * 75 + 50}
                                stroke="#333"
                                strokeDasharray="5,5"
                            />
                        ))}
                        {/* Y-axis labels */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <text
                                key={i}
                                x="10"
                                y={395 - i * 75}
                                fill="#666"
                                fontSize="12"
                                textAnchor="start"
                            >
                                {Math.round(minPrice + (i / 4) * (maxPrice - minPrice))}
                            </text>
                        ))}
                        {/* X-axis labels */}
                        {data.map((d, i) => (
                            <text
                                key={i}
                                x={(i / (data.length - 1)) * 900 + 50}
                                y="390"
                                fill="#666"
                                fontSize="12"
                                textAnchor="middle"
                            >
                                {d.year}
                            </text>
                        ))}
                        {/* Chart line */}
                        <path d={pathD} fill="none" stroke="white" strokeWidth="2" />
                        {/* Interactive points */}
                        {points.map((point, i) => (
                            <circle
                                key={i}
                                cx={point.x + 50}
                                cy={point.y}
                                r="5"
                                fill="white"
                                onMouseEnter={() => setHoveredPoint(point)}
                                onMouseLeave={() => setHoveredPoint(null)}
                            />
                        ))}
                        {/* Tooltip */}
                        {hoveredPoint && (
                            <g transform={`translate(${hoveredPoint.x + 50}, ${getY(hoveredPoint.price) - 20})`}>
                                <rect x="-40" y="-25" width="80" height="50" fill="black" stroke="white" />
                                <text x="0" y="-5" fill="white" fontSize="12" textAnchor="middle">
                                    Year: {hoveredPoint.year}
                                </text>
                                <text x="0" y="15" fill="white" fontSize="12" textAnchor="middle">
                                    Price: {hoveredPoint.price}
                                </text>
                            </g>
                        )}
                    </svg>
                </div>
            </motion.div>

            {/* Alert Section */}
            <motion.div
                style={{ margin: '24px 0', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 1.5 }}
            >
                <p style={{ fontSize: '16px', color: '#666' }}>
                    Visualize your expense trends and set alerts to manage your budget effectively.
                </p>
                <motion.button
                    style={{
                        backgroundColor: '#F59E0B',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 2 }}
                >
                    Set FREE Price Alert
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: '8px' }}
                    >
                        <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
                    </svg>
                </motion.button>
            </motion.div>
        </div>
    )
}
