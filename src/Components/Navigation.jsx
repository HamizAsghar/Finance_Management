'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
const Navigation = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-50 transform transition-transform duration-1000 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative flex h-full flex-col items-center justify-center">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 md:right-6 md:top-6 text-white"
                    aria-label="Close menu"
                >
                    <svg className="h-8 w-8 md:h-10 md:w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <Logo className="text-white mb-8 md:mb-12" />

                <nav className="flex flex-col items-center space-y-4 md:space-y-6">
                    <NavLink href="/" onClick={onClose}>Home</NavLink>
                    <NavLink href="/login" onClick={onClose}>Dashboard</NavLink>
                    <NavLink href="/investments" onClick={onClose}>Investments</NavLink>
                    <NavLink href="/about" onClick={onClose}>About</NavLink>
                    <NavLink href="/contact" onClick={onClose}>Contact</NavLink>
                </nav>
            </div>
        </div>
    );
};
const NavLink = ({ href, onClick, children }) => (
    <Link
        href={href}
        className="text-2xl md:text-3xl font-serif text-white transition-all duration-300 hover:text-gray-300"
        onClick={onClick}
    >
        {children}
    </Link>
);
export default Navigation;
