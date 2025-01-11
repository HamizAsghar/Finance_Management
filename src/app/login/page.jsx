// 'use client'

// import Link from "next/link";
// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { RiLockPasswordFill } from "react-icons/ri";
// import { MdEmail } from "react-icons/md";
// import { FaGoogle } from "react-icons/fa";

// export default function LoginForm() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const res = await signIn("credentials", {
//                 email,
//                 password,
//                 redirect: false,
//             });

//             if (res.error) {
//                 setError("Invalid credentials");
//                 return;
//             }

//             router.replace("/admin");
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGoogleLogin = () => {
//         signIn("google", { callbackUrl: "/admin" });
//     };

//     return (
//         <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-amber-500">
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 opacity-10 animate-pulse"></div>
//             <div className="bg-black bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-md relative z-10">
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <h1 className="text-2xl font-bold text-center">LOGIN</h1>

//                     <div className="space-y-4">
//                         <button
//                             type="button"
//                             onClick={handleGoogleLogin}
//                             className="w-full flex items-center justify-center gap-2 bg-black border border-amber-500 text-amber-500 px-4 py-2 rounded-lg hover:bg-amber-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
//                         >
//                             <FaGoogle className="text-red-500" />
//                             Continue with Google
//                         </button>

//                         <div className="relative flex items-center">
//                             <div className="flex-grow border-t border-amber-500"></div>
//                             <span className="flex-shrink mx-4">or</span>
//                             <div className="flex-grow border-t border-amber-500"></div>
//                         </div>
//                     </div>

//                     <div className="relative">
//                         <input
//                             onChange={(e) => setEmail(e.target.value)}
//                             type="email"
//                             name="email"
//                             placeholder="Email id"
//                             required
//                             className="w-full bg-black text-amber-500 border border-amber-500 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-amber-500"
//                         />
//                         <MdEmail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
//                     </div>
//                     <div className="relative">
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             type="password"
//                             name="password"
//                             placeholder="Password"
//                             required
//                             className="w-full bg-black text-amber-500 border border-amber-500 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-amber-500"
//                         />
//                         <RiLockPasswordFill className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
//                     </div>
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-500 disabled:opacity-50"
//                         >
//                             {loading ? "Logging in..." : "Login"}
//                         </button>
//                     </div>
//                     <div className="text-center">
//                         <p>
//                             Don't have an account?{' '}
//                             <Link href="/register" className="font-bold hover:underline">
//                                 Register
//                             </Link>
//                         </p>
//                     </div>
//                 </form>
//             </div>
//             {error && (
//                 <div className="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
//                     <h2 className="font-semibold text-sm italic">{error}</h2>
//                 </div>
//             )}
//         </div>
//     );
// }






'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import './animations.css'

const BackgroundAnimation = () => {
    useEffect(() => {
        const canvas = document.getElementById('background-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: `rgba(245, 158, 11, ${Math.random() * 0.5 + 0.1})` // Amber color with varying opacity
            };
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });
            requestAnimationFrame(drawParticles);
        };

        const init = () => {
            resizeCanvas();
            particles = Array(50).fill().map(createParticle);
            drawParticles();
        };

        init();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas id="background-canvas" className="absolute inset-0 z-0" />;
};

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                setError("Invalid credentials");
                return;
            }

            router.replace("/admin");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/admin" });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-amber-500">
            <BackgroundAnimation />
            <div className="bg-black bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-md relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h1 className="text-2xl font-bold text-center text-white">LOGIN</h1>

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 bg-black border border-amber-500 text-amber-500 px-4 py-2 rounded-lg hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300"
                        >
                            <FaGoogle className="text-red-500" />
                            Continue with Google
                        </button>

                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-amber-500"></div>
                            <span className="flex-shrink mx-4">or</span>
                            <div className="flex-grow border-t border-amber-500"></div>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            placeholder="Email id"
                            required
                            className="w-full bg-black text-amber-500 border border-amber-500 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-amber-500 transition-colors duration-300"
                            aria-label="Email"
                        />
                        <MdEmail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500" aria-hidden="true" />
                    </div>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full bg-black text-amber-500 border border-amber-500 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-amber-500 transition-colors duration-300"
                            aria-label="Password"
                        />
                        <RiLockPasswordFill className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-500" aria-hidden="true" />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-500 disabled:opacity-50 transition-colors duration-300"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    <div className="text-center">
                        <p>
                            <span className=" text-white">Don't have an account?</span>{' '}
                            <Link href="/register" className="font-bold hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            {error && (
                <div className="absolute top-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg" role="alert">
                    <h2 className="font-semibold text-sm italic">{error}</h2>
                </div>
            )}
        </div>
    );
}









