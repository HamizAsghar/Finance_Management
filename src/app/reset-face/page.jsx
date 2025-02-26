"use client"

import { useState } from "react"
import { MdFace, MdLock, MdRefresh } from "react-icons/md"
import Swal from "sweetalert2"

export default function ResetFaceVerification() {
    const [password, setPassword] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [loading, setLoading] = useState(false)

    const handleReset = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            // First validate the admin credentials
            const response = await fetch("/api/webAdmin/reset-face-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    secretKey,
                }),
            })

            const data = await response.json()

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Face Verification Reset",
                    text: "Face verification has been reset successfully. You'll need to set up a new face on your next login.",
                    confirmButtonText: "Go to Login",
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect to login page
                        window.location.href = "/webAdmin"
                    }
                })
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Reset Failed",
                    text: data.message || "Failed to reset face verification.",
                })
            }
        } catch (error) {
            console.error("Face reset error:", error)
            Swal.fire({
                icon: "error",
                title: "Reset Error",
                text: "An error occurred while resetting face verification: " + error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto bg-black border border-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-center mb-6">
                <MdFace className="text-amber-500 text-5xl mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-amber-500">Reset Face Verification</h2>
                <p className="text-gray-400 mt-1">This will delete the current face data and require setup of a new face.</p>
            </div>

            <form onSubmit={handleReset}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                            Admin Password
                        </label>
                        <div className="relative">
                            <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="secretKey" className="block text-sm font-medium text-gray-300 mb-1">
                            Secret Key
                        </label>
                        <input
                            id="secretKey"
                            type="text"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Enter secret key"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-black font-bold py-3 rounded-lg transition-all hover:from-amber-600 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <MdRefresh className="mr-2" /> Reset Face Verification
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-red-500 text-sm">
                    <strong>Warning:</strong> This action cannot be undone.
                </p>
            </div>
        </div>
    )
}

