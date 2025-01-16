// 'use client';

// import './LoadingAnimation.css'; // Import your CSS file

// const LoadingAnimation = () => {
//     const text = 'Finance Flow';

//     return (
//         <div className="container">
//             <div className="glow"></div>
//             {text.split('').map((letter, index) => (
//                 <div key={index} className="letter-container">
//                     <span
//                         className={`letter ${letter === 'F' || letter === 'f' || letter === 'o' || letter === 'l' || letter === 'w' ? 'amber' : 'white'}`}
//                         style={{
//                             animationDelay: `${index * 0.1 + 0.5}s`,
//                         }}
//                     >
//                         {letter}
//                     </span>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default LoadingAnimation;


// 'use client';
// import './LoadingAnimation.css';
// const LoadingAnimation = () => {
//     const text = 'Finance Flow';

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50">
//             <div className="relative">
//                 {/* Animated gradient background */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-white/20 blur-3xl animate-gradient" />

//                 {/* Glow effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-white/30 blur-2xl animate-pulse" />

//                 {/* Letters container */}
//                 <div className="relative flex items-center gap-[2px]">
//                     {text.split('').map((letter, index) => (
//                         <div key={index} className="relative">
//                             <span
//                                 className={`inline-block text-4xl md:text-6xl font-bold ${letter.toLowerCase() === 'f' ||
//                                         letter === 'o' ||
//                                         letter === 'l' ||
//                                         letter === 'w'
//                                         ? 'text-amber-500'
//                                         : 'text-white'
//                                     }`}
//                                 style={{
//                                     animation: 'dropIn 0.5s ease-out forwards',
//                                     animationDelay: `${index * 0.1}s`,
//                                     opacity: 0,
//                                     transform: 'translateY(-20px)',
//                                 }}
//                             >
//                                 {letter}
//                             </span>
//                             {/* Letter reflection */}
//                             <span
//                                 className={`absolute left-0 bottom-0 inline-block text-4xl md:text-6xl font-bold opacity-20 ${letter.toLowerCase() === 'f' ||
//                                         letter === 'o' ||
//                                         letter === 'l' ||
//                                         letter === 'w'
//                                         ? 'text-amber-500'
//                                         : 'text-white'
//                                     }`}
//                                 style={{
//                                     animation: 'reflection 2s ease-out infinite',
//                                     animationDelay: `${index * 0.1}s`,
//                                     transform: 'scaleY(-0.2) translateY(1px)',
//                                     opacity: 0,
//                                 }}
//                             >
//                                 {letter}
//                             </span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Particle effects */}
//                 <div className="absolute inset-0 overflow-hidden">
//                     {[...Array(20)].map((_, i) => (
//                         <div
//                             key={i}
//                             className="particle absolute w-1 h-1 bg-amber-500/50 rounded-full"
//                             style={{
//                                 left: `${Math.random() * 100}%`,
//                                 animation: `particle ${2 + Math.random() * 2}s linear infinite`,
//                                 animationDelay: `${Math.random() * 2}s`,
//                             }}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoadingAnimation;
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






