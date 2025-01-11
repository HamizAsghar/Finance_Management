// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';

// // Slides data
// const slides = [
//     {
//         src: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80',
//         title: 'Smart Budgeting',
//         subtitle: 'Plan your expenses and savings with precision.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1920&q=80',
//         title: 'Investment Strategies',
//         subtitle: 'Grow your wealth with sound financial planning.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&w=1920&q=80',
//         title: 'Secure Transactions',
//         subtitle: 'Ensuring safe and transparent money transfers.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80',
//         title: 'Debt Management',
//         subtitle: 'Eliminate debt and build financial freedom.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1920&q=80',
//         title: 'Retirement Planning',
//         subtitle: 'Prepare for a stress-free and secure future.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1920&q=80',
//         title: 'Wealth Monitoring',
//         subtitle: 'Track your assets and financial health with ease.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80',
//         title: 'Financial Education',
//         subtitle: 'Empower yourself with knowledge for better decisions.',
//     },
//     {
//         src: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1920&q=80',
//         title: 'Tax Optimization',
//         subtitle: 'Maximize your returns with smart tax strategies.',
//     },
// ];

// // Logo Component
// const Logo = ({ className = '' }) => (
//     <div className={`flex items-center ${className}`}>
//         <svg
//             className="text-white w-10 h-10 mr-2"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//         >
//             <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//         <span className="text-3xl font-bold tracking-tight text-white">
//             Finance <span className="text-amber-500">Flow</span>
//         </span>
//     </div>
// );

// // NavLink Component
// const NavLink = ({ href, onClick, children }) => (
//     <Link
//         href={href}
//         className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
//         onClick={onClick}
//     >
//         {children}
//     </Link>
// );

// // Navigation Component
// const Navigation = ({ isOpen, onClose }) => {
//     useEffect(() => {
//         if (isOpen) {
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }
//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);

//     return (
//         <div
//             className={`fixed inset-0 z-50 transform transition-transform duration-1000 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
//         >
//             <div className="absolute inset-0 bg-black/90" />
//             <div className="relative flex h-full flex-col items-center justify-center">
//                 <button
//                     onClick={onClose}
//                     className="absolute right-4 top-4 md:right-6 md:top-6 text-white"
//                     aria-label="Close menu"
//                 >
//                     <svg className="h-8 w-8 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>

//                 <Logo className="text-white mb-8 md:mb-12" />

//                 <nav className="flex flex-col items-center space-y-4 md:space-y-6">
//                     <NavLink href="/" onClick={onClose}>Home</NavLink>
//                     <NavLink href="/login" onClick={onClose}>Dashboard</NavLink>
//                     <NavLink href="/investments" onClick={onClose}>Investments</NavLink>
//                     <NavLink href="/about" onClick={onClose}>About</NavLink>
//                     <NavLink href="/contact" onClick={onClose}>Contact</NavLink>
//                 </nav>
//             </div>
//         </div>
//     );
// };

// // Main HomePage Component
// export default function HomePage() {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const goToNext = () => {
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
//     };

//     const goToPrevious = () => {
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? slides.length - 1 : prevIndex - 1
//         );
//     };

//     useEffect(() => {
//         const interval = setInterval(goToNext, 4000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <main className="relative h-screen w-full overflow-hidden">
//             {/* Navigation Bar */}
//             <header className="absolute top-0 left-0 z-30 w-full p-4 md:p-6 flex items-center justify-between">
//                 <Link href="/">
//                     <Logo className="text-white" />
//                 </Link>
//                 <button
//                     onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     className="text-white p-2"
//                     aria-label="Toggle menu"
//                 >
//                     <svg
//                         className="w-8 h-8 md:w-10 md:h-10"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M4 6h16M4 12h16M4 18h16"
//                         />
//                     </svg>
//                 </button>
//             </header>
//             <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

//             {/* Carousel */}
//             {slides.map((slide, index) => (
//                 <div
//                     key={index}
//                     className={`absolute w-full h-full transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
//                 >
//                     <img
//                         src={slide.src}
//                         alt={slide.title}
//                         className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black/50 z-10"></div>
//                     <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
//                         <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 md:mb-4">{slide.title}</h1>
//                         <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-8 max-w-md md:max-w-lg">{slide.subtitle}</p>
//                         <Link
//                             href="/register"
//                             className="bg-amber-500 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded-md font-bold transition hover:bg-gray-100 text-sm md:text-base"
//                         >
//                             Get Started
//                         </Link>
//                     </div>
//                 </div>
//             ))}

//             {/* Controls */}
//             <button
//                 onClick={goToPrevious}
//                 className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full"
//                 aria-label="Previous slide"
//             >
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-4 h-4 md:w-6 md:h-6 text-white"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//             </button>
//             <button
//                 onClick={goToNext}
//                 className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full"
//                 aria-label="Next slide"
//             >
//                 <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     className="w-4 h-4 md:w-6 md:h-6 text-white"
//                 >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//             </button>

//             {/* Indicators */}
//             <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
//                 {slides.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => setCurrentIndex(index)}
//                         className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
//                         aria-label={`Go to slide ${index + 1}`}
//                     />
//                 ))}
//             </div>
//         </main>
//     );
// }







'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <main className="relative h-screen w-full overflow-hidden">
            {/* Navigation Bar */}
            <header className="absolute top-0 left-0 z-30 w-full p-4 md:p-6 flex items-center justify-between">
                <Link href="/" className="z-50">
                    <div className="flex items-center">
                        <svg
                            className="text-white w-10 h-10 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-3xl font-bold tracking-tight text-white">
                            Finance <span className="text-amber-500">Flow</span>
                        </span>
                    </div>
                </Link>
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="text-white p-2 z-50"
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

            {/* Full Screen Navigation Menu */}
            <div
                className={`fixed inset-0 bg-black/90 z-40 transform transition-all duration-500 ease-in-out ${isMenuOpen
                        ? 'translate-y-0 opacity-100 visible pointer-events-auto'
                        : '-translate-y-full opacity-0 invisible pointer-events-none'
                    }`}
            >
                <div className="relative flex h-full flex-col items-center justify-center">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute right-4 top-4 md:right-6 md:top-6 text-white z-50"
                        aria-label="Close menu"
                    >
                        <svg className="h-8 w-8 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex items-center mb-8 md:mb-12">
                        <svg
                            className="text-white w-10 h-10 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-3xl font-bold tracking-tight text-white">
                            Finance <span className="text-amber-500">Flow</span>
                        </span>
                    </div>

                    <nav className="flex flex-col items-center space-y-4 md:space-y-6">
                        <Link
                            href="/"
                            className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/login"
                            className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/investments"
                            className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Investments
                        </Link>
                        <Link
                            href="/about"
                            className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>

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
                        <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 md:mb-4">
                            {slide.title}
                        </h1>
                        <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-8 max-w-md md:max-w-lg">
                            {slide.subtitle}
                        </p>
                        <Link
                            href="/register"
                            className="bg-amber-500 text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded-md font-bold transition hover:bg-gray-100 text-sm md:text-base"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            ))}

            {/* Carousel Controls */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full z-20"
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
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 md:p-3 rounded-full z-20"
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

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
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

