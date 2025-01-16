'use client';

import { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
    const text = 'Finance Flow';
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 4 + 2}px`, // Random size between 2px and 6px
            duration: `${2 + Math.random() * 3}s`,
            delay: `${Math.random() * 2}s`,
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="loader-container">
            <div className="loader-text">
                {text.split('').map((letter, index) => (
                    <span
                        key={index}
                        style={{
                            animationDelay: `${index * 0.2}s`,
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            {/* Particle effects */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: particle.left,
                        top: particle.top,
                        animationDuration: particle.duration,
                        animationDelay: particle.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default LoadingAnimation;






