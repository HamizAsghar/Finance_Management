'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import Logo from './Logo';
const slides = [
    {
        src: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80',
        title: 'Smart Budgeting',
        subtitle: 'Plan your expenses and savings with precision.',
    },
    {
        src: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1920&q=80',
        title: 'Investment Strategies',
        subtitle: 'Grow your wealth with sound financial planning.',
    },
    {
        src: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=1920&q=80',
        title: 'Secure Transactions',
        subtitle: 'Ensuring safe and transparent money transfers.',
    },
    {
        src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
        title: 'Debt Management',
        subtitle: 'Eliminate debt and build financial freedom.',
    },
    {
        src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80',
        title: 'Retirement Planning',
        subtitle: 'Prepare for a stress-free and secure future.',
    },
    {
        src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80',
        title: 'Wealth Monitoring',
        subtitle: 'Track your assets and financial health with ease.',
    },
    {
        src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80',
        title: 'Financial Education',
        subtitle: 'Empower yourself with knowledge for better decisions.',
    },
    {
        src: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1920&q=80',
        title: 'Tax Optimization',
        subtitle: 'Maximize your returns with smart tax strategies.',
    },
];
export default function HomePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(goToNext, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative h-screen w-full overflow-hidden">
            {/* Navigation Bar */}
            <header className="absolute top-0 left-0 z-30 w-full p-4 md:p-6 flex items-center justify-between">
                <Link href="/">
                    <Logo className="text-white" /> 
                </Link>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-white p-2"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-8 h-8 md:w-10 md:h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </header>
            <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Carousel */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'
                        }`}
                >
                    <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 z-10"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
                        <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 md:mb-4">{slide.title}</h1>
                        <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-8 max-w-md md:max-w-lg">{slide.subtitle}</p>
                        <Link
                            href="/register"
                            className="bg-amber-500 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded-md font-bold transition hover:bg-gray-100 text-sm md:text-base"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full"
                aria-label="Previous slide"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 md:w-6 md:h-6 text-white"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={goToNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full"
                aria-label="Next slide"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 md:w-6 md:h-6 text-white"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </main>
    );
}
