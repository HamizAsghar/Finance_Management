'use client';

import './LoadingAnimation.css'; // Import your CSS file

const LoadingAnimation = () => {
    const text = 'Finance Flow';

    return (
        <div className="container">
            <div className="glow"></div>
            {text.split('').map((letter, index) => (
                <div key={index} className="letter-container">
                    <span
                        className={`letter ${letter === 'F' || letter === 'f' || letter === 'o' || letter === 'l' || letter === 'w' ? 'amber' : 'white'}`}
                        style={{
                            animationDelay: `${index * 0.1 + 0.5}s`,
                        }}
                    >
                        {letter}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default LoadingAnimation;
