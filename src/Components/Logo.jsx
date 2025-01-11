import React from 'react';

const Logo = ({ className = '' }) => (
    <div className={`flex items-center ${className}`}>
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
);

export default Logo;
