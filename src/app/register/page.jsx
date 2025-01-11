// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { FaUser, FaCamera } from "react-icons/fa";
// import { RiLockPasswordFill } from "react-icons/ri";
// import { MdEmail } from "react-icons/md";
// import { CldUploadWidget } from "next-cloudinary";
// import Swal from "sweetalert2";

// const RegisterForm = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleImageUploadSuccess = (results) => {
//         if (results.info?.secure_url && results.event === "success") {
//             setImage(results.info.secure_url);
//             setImagePreview(results.info.secure_url);
//         }
//     };

//     const handleImageUploadError = (error) => {
//         console.error("Cloudinary upload error:", error);
//         setError("Error uploading the image. Please try again.");
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         if (!name || !email || !password || !confirmPassword || !image) {
//             setError("All fields are necessary.");
//             setLoading(false);
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             setLoading(false);
//             return;
//         }

//         try {
//             const resUserExists = await fetch("api/userExists", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email }),
//             });

//             const { user } = await resUserExists.json();
//             if (user) {
//                 setError("User already exists.");
//                 setLoading(false);
//                 return;
//             }

//             const res = await fetch("api/register", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     name,
//                     email,
//                     password,
//                     image,
//                 }),
//             });

//             if (res.ok) {
//                 const form = e.target;
//                 form.reset();
//                 Swal.fire({
//                     icon: "success",
//                     title: "Registration Successful",
//                     text: "You have been successfully registered!",
//                     confirmButtonText: "OK",
//                 }).then(() => {
//                     router.push("/");
//                 });
//             } else {
//                 setError("Registration failed");
//             }
//         } catch (error) {
//             console.error("Error during registration", error);
//             setError("Registration failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen grid md:grid-cols-2 bg-black relative overflow-hidden">
//             {/* Left side - Welcome Message */}
//             <div className="hidden md:flex flex-col justify-center p-12 relative">
//                 <div className="relative z-10">
//                     <h1 className="text-4xl font-bold text-amber-500 mb-4">Welcome to FinanceFlow!</h1>
//                     <p className="text-amber-400 text-lg">
//                         Create your account to start managing your finances effectively
//                     </p>
//                 </div>
//                 {/* Animated Background Elements */}
//                 <div className="absolute top-0 left-0 w-full h-full">
//                     <div
//                         className="absolute top-10 left-10 w-20 h-20 border border-amber-500 rounded-full animate-move"
//                     />
//                     <div
//                         className="absolute bottom-10 right-10 w-40 h-40 border border-amber-500 rounded-full animate-move-alt"
//                     />
//                     <div
//                         className="absolute top-1/2 left-1/2 w-60 h-60 border border-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-move"
//                     />
//                 </div>
//             </div>

//             {/* Right side - Form */}
//             <div className="flex items-center justify-center p-6">
//                 <div className="w-full max-w-md bg-amber-900 rounded-2xl shadow-xl p-8">
//                     <h2 className="text-2xl font-bold text-center text-amber-500 mb-8">Create Account</h2>

//                     <div className="flex justify-center mb-6">
//                         <div className="relative">
//                             {imagePreview ? (
//                                 <img
//                                     src={imagePreview}
//                                     alt="Profile preview"
//                                     className="w-24 h-24 rounded-full object-cover border-4 border-amber-500"
//                                 />
//                             ) : (
//                                 <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-500">
//                                     <FaUser className="w-12 h-12 text-amber-500" />
//                                 </div>
//                             )}
//                             <CldUploadWidget
//                                 uploadPreset="hwlqikvn"
//                                 onSuccess={handleImageUploadSuccess}
//                                 onError={handleImageUploadError}
//                                 options={{
//                                     cloudName: "dpuw5wqyp",
//                                     multiple: false,
//                                 }}
//                             >
//                                 {({ open }) => (
//                                     <button
//                                         type="button"
//                                         className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 cursor-pointer hover:bg-amber-700 transition-colors"
//                                         onClick={open}
//                                     >
//                                         <FaCamera className="text-black" />
//                                     </button>
//                                 )}
//                             </CldUploadWidget>
//                         </div>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="relative">
//                             <input
//                                 onChange={(e) => setName(e.target.value)}
//                                 type="text"
//                                 name="username"
//                                 placeholder="Username"
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
//                                 required
//                             />
//                             <FaUser className="absolute top-3.5 right-3 text-gray-400" />
//                         </div>
//                         <div className="relative">
//                             <input
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 type="email"
//                                 name="email"
//                                 placeholder="Email"
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
//                                 required
//                             />
//                             <MdEmail className="absolute top-3.5 right-3 text-gray-400" />
//                         </div>
//                         <div className="relative">
//                             <input
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 type="password"
//                                 name="password"
//                                 placeholder="Password"
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
//                                 required
//                             />
//                             <RiLockPasswordFill className="absolute top-3.5 right-3 text-gray-400" />
//                         </div>
//                         <div className="relative">
//                             <input
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 type="password"
//                                 name="confirmPassword"
//                                 placeholder="Confirm Password"
//                                 className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
//                                 required
//                             />
//                             <RiLockPasswordFill className="absolute top-3.5 right-3 text-gray-400" />
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full py-3 text-black bg-amber-600 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
//                         >
//                             {loading ? "Creating Account..." : "Create Account"}
//                         </button>
//                     </form>

//                     {error && (
//                         <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
//                             {error}
//                         </div>
//                     )}

//                     <p className="mt-6 text-sm text-white text-center">
//                         Already have an account?{" "}
//                         <Link href="/login" className="font-semibold text-white hover:text-amber-600 hover:underline">
//                             Login
//                         </Link>
//                     </p>
//                 </div>
//             </div>


//         </div>
//     );
// };

// export default RegisterForm;


"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaCamera } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { CldUploadWidget } from "next-cloudinary";
import Swal from "sweetalert2";
import './RegisterForm.css'
const RegisterForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImageUploadSuccess = (results) => {
        if (results.info?.secure_url && results.event === "success") {
            setImage(results.info.secure_url);
            setImagePreview(results.info.secure_url);
        }
    };

    const handleImageUploadError = (error) => {
        console.error("Cloudinary upload error:", error);
        setError("Error uploading the image. Please try again.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!name || !email || !password || !confirmPassword || !image) {
            setError("All fields are necessary.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const { user } = await resUserExists.json();
            if (user) {
                setError("User already exists.");
                setLoading(false);
                return;
            }

            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    image,
                }),
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful",
                    text: "You have been successfully registered!",
                    confirmButtonText: "OK",
                }).then(() => {
                    router.push("/");
                });
            } else {
                setError("Registration failed");
            }
        } catch (error) {
            console.error("Error during registration", error);
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-black to-amber-900 relative overflow-hidden">
            <BackgroundAnimation />
            {/* Left side - Welcome Message */}
            <div className="hidden md:flex flex-col justify-center p-12 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold text-amber-500 mb-4">Welcome to <span className=" text-white">FinanceFlow!</span></h1>
                    <p className="text-white text-lg">
                        Create your account to start managing your finances effectively
                    </p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md bg-black bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center text-amber-500 mb-8"> <span className=" text-white">Create</span> Account</h2>

                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-500"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center border-4 border-amber-500">
                                    <FaUser className="w-12 h-12 text-amber-500" />
                                </div>
                            )}
                            <CldUploadWidget
                                uploadPreset="hwlqikvn"
                                onSuccess={handleImageUploadSuccess}
                                onError={handleImageUploadError}
                                options={{
                                    cloudName: "dpuw5wqyp",
                                    multiple: false,
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 bg-amber-600 rounded-full p-2 cursor-pointer hover:bg-amber-700 transition-colors"
                                        onClick={open}
                                    >
                                        <FaCamera className="text-black" />
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-black bg-opacity-50 text-white"
                                required
                            />
                            <FaUser className="absolute top-3.5 right-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-black bg-opacity-50 text-white"
                                required
                            />
                            <MdEmail className="absolute top-3.5 right-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-black bg-opacity-50 text-white"
                                required
                            />
                            <RiLockPasswordFill className="absolute top-3.5 right-3 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-black bg-opacity-50 text-white"
                                required
                            />
                            <RiLockPasswordFill className="absolute top-3.5 right-3 text-gray-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-black bg-amber-600 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <p className="mt-6 text-sm text-white text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-white hover:text-amber-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const BackgroundAnimation = () => {
    useEffect(() => {
        const svg = document.querySelector('.background-animation');
        const animate = () => {
            const paths = svg.querySelectorAll('path');
            paths.forEach((path, index) => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.style.animation = `dash ${10 + index * 2}s linear infinite`;
            });
        };
        animate();
    }, []);

    return (
        <svg className="background-animation absolute top-10  inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 Q100,200 200,0 T400,0" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" fill="none" />
            <path d="M0,40 Q120,240 240,40 T480,40" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" fill="none" />
            <path d="M0,80 Q140,280 280,80 T560,80" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" fill="none" />
            <path d="M0,120 Q160,320 320,120 T640,120" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" fill="none" />
            <path d="M0,160 Q180,360 360,160 T720,160" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" fill="none" />
        </svg>
    );
};

export default RegisterForm;








