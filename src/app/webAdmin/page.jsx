"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MdLock, MdVpnKey, MdFace, MdRefresh, MdWarning, MdCameraAlt, MdCheck } from "react-icons/md"
import Swal from "sweetalert2"

export default function WebAdminLogin() {
    const [password, setPassword] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [loading, setLoading] = useState(false)
    const [showFaceSetup, setShowFaceSetup] = useState(false)
    const [showFaceVerification, setShowFaceVerification] = useState(false)
    const [cameraError, setCameraError] = useState("")
    const [cameraPermission, setCameraPermission] = useState("prompt")
    const [faceDetected, setFaceDetected] = useState(false)
    const [facePosition, setFacePosition] = useState({ x: 50, y: 50, size: 40 }) // Default position (center)
    const [verificationAttempts, setVerificationAttempts] = useState(0)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)
    const faceCheckInterval = useRef(null)
    const [showGuide, setShowGuide] = useState(true)

    useEffect(() => {
        if (showFaceSetup || showFaceVerification) {
            startCamera()
        }

        return () => {
            stopCamera()
            if (faceCheckInterval.current) {
                clearInterval(faceCheckInterval.current)
            }
        }
    }, [showFaceSetup, showFaceVerification])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user",
                },
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
                console.log("Camera started successfully")
                setCameraError("")
                setCameraPermission("granted")

                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play()
                    // Start face position tracking
                    startFaceTracking()
                }
            } else {
                console.error("Video ref is not available")
                setCameraError("Video element not found")
            }
        } catch (error) {
            console.error("Error accessing camera:", error)
            setCameraError(`Unable to access the camera. Error: ${error.message}`)
            setCameraPermission("denied")
            Swal.fire({
                icon: "error",
                title: "Camera Error",
                text: `Unable to access the camera. Please check your browser settings and try again.`,
            })
        }
    }

    const startFaceTracking = () => {
        if (faceCheckInterval.current) {
            clearInterval(faceCheckInterval.current)
        }

        // Simulate face tracking with random movements for demo
        setFaceDetected(true)

        faceCheckInterval.current = setInterval(() => {
            // Simulate face position changes
            const randomX = 50 + (Math.random() * 10 - 5) // 45-55% horizontal
            const randomY = 50 + (Math.random() * 10 - 5) // 45-55% vertical
            const randomSize = 40 + (Math.random() * 10 - 5) // 35-45% of frame

            setFacePosition({
                x: randomX,
                y: randomY,
                size: randomSize,
            })
        }, 1000)
    }

    const stopCamera = () => {
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks()
            tracks.forEach((track) => track.stop())
            streamRef.current = null
            if (videoRef.current) {
                videoRef.current.srcObject = null
            }
        }
        if (faceCheckInterval.current) {
            clearInterval(faceCheckInterval.current)
        }
    }

    const retryCamera = () => {
        setCameraPermission("prompt")
        startCamera()
    }

    const validatePassword = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/webAdmin/validate-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            })
            const data = await response.json()

            if (data.success) {
                if (data.faceVerificationSetup) {
                    setShowFaceVerification(true)
                    showPositioningGuide("verification")
                } else {
                    setShowFaceSetup(true)
                    showPositioningGuide("setup")
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.message || "Invalid password.",
                })
            }
        } catch (error) {
            console.error("Password validation error:", error)
            Swal.fire({
                icon: "error",
                title: "Login Error",
                text: "An error occurred during password validation",
            })
        } finally {
            setLoading(false)
        }
    }

    const showPositioningGuide = (mode) => {
        const title = mode === "setup" ? "Face Setup - Positioning Guide" : "Face Verification - Positioning Guide"
        const html = `
            <div class="text-left">
                <div class="mb-4 flex justify-center">
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-fKZo6BdK2kfbkF4YLndnSLojcuggzC.png" alt="Face positioning guide" class="w-32 h-32 mx-auto mb-2" />
                </div>
                <p class="mb-3 font-bold">Perfect Face Positioning:</p>
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Distance:</strong> Position your face to occupy 60-70% of the frame height</li>
                    <li><strong>Horizontal:</strong> Center your face (45-55% from left edge)</li>
                    <li><strong>Vertical:</strong> Eyes should be at 40-45% from top of frame</li>
                    <li><strong>Angle:</strong> Face directly toward camera, no tilting</li>
                </ul>
                <p class="mt-3 text-center text-amber-500">Follow the on-screen guide for perfect positioning</p>
            </div>
        `

        Swal.fire({
            title,
            html,
            icon: "info",
            confirmButtonText: "Got it!",
            confirmButtonColor: "#d97706",
        })
    }

    const setupFaceVerification = async () => {
        if (secretKey !== "kiajahilhoyr") {
            Swal.fire({
                icon: "error",
                title: "Invalid Secret Key",
                text: "Please enter the correct secret key to set up face verification.",
            })
            return
        }

        // Check if face is properly positioned
        const isGoodPosition = isFaceProperlyPositioned()
        if (!isGoodPosition) {
            Swal.fire({
                icon: "warning",
                title: "Improve Face Position",
                text: "Please position your face properly in the frame before proceeding. Follow the on-screen guide.",
            })
            return
        }

        try {
            setLoading(true)

            // Capture a single high-quality image
            const imageBlob = await captureImage()
            if (!imageBlob) {
                throw new Error("Failed to capture image")
            }
            console.log("Image captured successfully, size:", imageBlob.size)

            // Create FormData with the single image
            const formData = new FormData()
            formData.append("faceImage", imageBlob, "face.jpg")

            // Log FormData contents for debugging
            for (const [key, value] of formData.entries()) {
                console.log(`FormData contains: ${key}:`, value instanceof Blob ? `Blob of size ${value.size}` : value)
            }

            const response = await fetch("/api/webAdmin/save-face", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Server response:", response.status, errorText)
                throw new Error(`Server error: ${response.status} - ${errorText}`)
            }

            const data = await response.json()

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Face Setup Complete",
                    text: "Your face has been successfully registered. The system will now only recognize you as the admin.",
                    confirmButtonColor: "#d97706",
                })
                setShowFaceSetup(false)
                setShowFaceVerification(true)
            } else {
                throw new Error(data.message || "Unable to set up face verification.")
            }
        } catch (error) {
            console.error("Face setup error:", error)
            Swal.fire({
                icon: "error",
                title: "Setup Error",
                text: "An error occurred during face setup: " + error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    const performFaceVerification = async () => {
        // Check if face is properly positioned
        const isGoodPosition = isFaceProperlyPositioned()
        if (!isGoodPosition) {
            Swal.fire({
                icon: "warning",
                title: "Improve Face Position",
                text: "Please position your face properly in the frame before proceeding. Follow the on-screen guide.",
            })
            return
        }

        try {
            setLoading(true)
            setVerificationAttempts((prev) => prev + 1)

            const imageBlob = await captureImage()
            if (!imageBlob) {
                throw new Error("Failed to capture image")
            }
            console.log("Image captured successfully for verification, size:", imageBlob.size)

            const formData = new FormData()
            formData.append("faceImage", imageBlob, "face.jpg")

            // Log FormData contents for debugging
            for (const [key, value] of formData.entries()) {
                console.log(`FormData contains: ${key}:`, value instanceof Blob ? `Blob of size ${value.size}` : value)
            }

            const response = await fetch("/api/webAdmin/verify-face", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error("Server response:", response.status, errorText)
                throw new Error(`Server error: ${response.status} - ${errorText}`)
            }

            const data = await response.json()

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Welcome, Admin!",
                    text: "Face verification successful.",
                    timer: 1500,
                    showConfirmButton: false,
                })
                router.push(data.redirectTo || "/webAdmin/dashboard")
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Access Denied",
                    text: data.message || "Face verification failed. You are not recognized as the admin.",
                    footer:
                        verificationAttempts >= 3
                            ? '<div class="text-red-500"><strong>Warning:</strong> Multiple failed attempts detected.</div>'
                            : "",
                })
            }
        } catch (error) {
            console.error("Face verification error:", error)
            Swal.fire({
                icon: "error",
                title: "Verification Error",
                text: "An error occurred during face verification: " + error.message,
            })
        } finally {
            setLoading(false)
        }
    }

    const isFaceProperlyPositioned = () => {
        // Check if face position is within acceptable ranges
        const { x, y, size } = facePosition

        const isGoodX = x >= 45 && x <= 55 // 45-55% horizontally centered
        const isGoodY = y >= 45 && y <= 55 // 45-55% vertically centered
        const isGoodSize = size >= 35 && size <= 45 // 35-45% of frame size

        // Calculate how close to perfect the position is (for feedback)
        const isPerfectX = x >= 48 && x <= 52 // 48-52% is perfect horizontal
        const isPerfectY = y >= 48 && y <= 52 // 48-52% is perfect vertical
        const isPerfectSize = size >= 38 && size <= 42 // 38-42% is perfect size

        // Store these values for UI feedback
        const positionQuality = {
            x: isPerfectX ? "excellent" : isGoodX ? "good" : "poor",
            y: isPerfectY ? "excellent" : isGoodY ? "good" : "poor",
            size: isPerfectSize ? "excellent" : isGoodSize ? "good" : "poor",
        }

        // Update state with position quality (if needed)

        return isGoodX && isGoodY && isGoodSize
    }

    const captureImage = () => {
        return new Promise((resolve, reject) => {
            if (!videoRef.current || !canvasRef.current) {
                console.error("Video or canvas ref is not available")
                reject(new Error("Video or canvas not available"))
                return
            }

            try {
                const video = videoRef.current
                const canvas = canvasRef.current

                // Make sure video dimensions are available
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    console.error("Video dimensions not available")
                    reject(new Error("Video dimensions not available"))
                    return
                }

                // Set canvas dimensions to match video
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                const ctx = canvas.getContext("2d")
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // Draw the video frame to the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Add capture effect
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Create a flash effect
                const flash = document.createElement("div")
                flash.style.position = "absolute"
                flash.style.top = "0"
                flash.style.left = "0"
                flash.style.right = "0"
                flash.style.bottom = "0"
                flash.style.backgroundColor = "white"
                flash.style.opacity = "0.5"
                flash.style.transition = "opacity 0.5s"

                if (videoRef.current.parentElement) {
                    videoRef.current.parentElement.appendChild(flash)

                    setTimeout(() => {
                        flash.style.opacity = "0"
                        setTimeout(() => flash.remove(), 500)
                    }, 50)
                }

                // Convert canvas to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            console.error("Failed to create blob from canvas")
                            reject(new Error("Failed to create image blob"))
                            return
                        }

                        console.log("Blob created successfully, size:", blob.size)
                        resolve(blob)
                    },
                    "image/jpeg",
                    0.95,
                )
            } catch (error) {
                console.error("Error capturing image:", error)
                reject(error)
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!showFaceSetup && !showFaceVerification) {
            validatePassword()
        } else if (showFaceSetup) {
            setupFaceVerification()
        } else {
            performFaceVerification()
        }
    }

    const toggleGuide = () => {
        setShowGuide(!showGuide)
    }

    // Calculate if face is properly positioned
    const isGoodPosition = isFaceProperlyPositioned()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-700/20 rounded-2xl blur-xl"></div>

                <div className="relative bg-black border border-gray-800 rounded-2xl shadow-2xl p-8 z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-amber-500 mb-2">WEB ADMIN PORTAL</h1>
                        <p className="text-gray-400">Secure access with facial recognition</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {!showFaceSetup && !showFaceVerification ? (
                            <div className="relative mb-6">
                                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 text-xl" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        ) : (
                            <div className="mb-6">
                                {showFaceSetup && (
                                    <input
                                        type="text"
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        placeholder="Enter Secret Key"
                                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        required
                                    />
                                )}
                                <div className="relative">
                                    {cameraError && <p className="text-red-500 mb-2">{cameraError}</p>}
                                    {cameraPermission === "denied" && (
                                        <button
                                            type="button"
                                            onClick={retryCamera}
                                            className="mb-2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                                        >
                                            <MdRefresh className="mr-2" /> Retry Camera Access
                                        </button>
                                    )}
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className={`w-full rounded-lg border-2 ${isGoodPosition ? "border-green-500" : "border-amber-500"
                                                }`}
                                        />
                                        <canvas ref={canvasRef} className="hidden" />

                                        {/* Face positioning guide */}
                                        {showGuide && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                {/* Horizontal guide lines */}
                                                <div className="absolute top-[40%] left-0 right-0 border-t border-dashed border-amber-500/50"></div>
                                                <div className="absolute top-[60%] left-0 right-0 border-t border-dashed border-amber-500/50"></div>

                                                {/* Vertical guide lines */}
                                                <div className="absolute top-0 bottom-0 left-[45%] border-l border-dashed border-amber-500/50"></div>
                                                <div className="absolute top-0 bottom-0 left-[55%] border-l border-dashed border-amber-500/50"></div>

                                                {/* Center oval */}
                                                <div className="absolute top-[40%] left-[45%] w-[10%] h-[20%] border-2 border-dashed rounded-full border-amber-500/70 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <p className="text-xs text-amber-500/70">Eyes here</p>
                                                    </div>
                                                </div>

                                                {/* Face outline */}
                                                <div className="absolute top-[35%] left-[30%] w-[40%] h-[50%] border-2 border-dashed rounded-full border-amber-500/70"></div>

                                                {/* Position status */}
                                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                                    <p className={`text-sm font-bold ${isGoodPosition ? "text-green-500" : "text-amber-500"}`}>
                                                        {isGoodPosition
                                                            ? facePosition.x >= 48 &&
                                                                facePosition.x <= 52 &&
                                                                facePosition.y >= 48 &&
                                                                facePosition.y <= 52 &&
                                                                facePosition.size >= 38 &&
                                                                facePosition.size <= 42
                                                                ? "✅ EXCELLENT POSITION!"
                                                                : "✓ GOOD POSITION!"
                                                            : "Adjust Position"}
                                                    </p>
                                                </div>

                                                {/* Position indicators */}
                                                <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center">
                                                    <div className="bg-black/70 rounded-lg px-3 py-1 text-center">
                                                        <div className="flex justify-center space-x-4 text-xs">
                                                            <div
                                                                className={`${facePosition.x >= 45 && facePosition.x <= 55 ? "text-green-500" : "text-amber-500"}`}
                                                            >
                                                                X: {facePosition.x.toFixed(0)}%{" "}
                                                                {facePosition.x >= 48 && facePosition.x <= 52
                                                                    ? "✓ Excellent!"
                                                                    : facePosition.x >= 45 && facePosition.x <= 55
                                                                        ? "✓ Good"
                                                                        : ""}
                                                            </div>
                                                            <div
                                                                className={`${facePosition.y >= 45 && facePosition.y <= 55 ? "text-green-500" : "text-amber-500"}`}
                                                            >
                                                                Y: {facePosition.y.toFixed(0)}%{" "}
                                                                {facePosition.y >= 48 && facePosition.y <= 52
                                                                    ? "✓ Excellent!"
                                                                    : facePosition.y >= 45 && facePosition.y <= 55
                                                                        ? "✓ Good"
                                                                        : ""}
                                                            </div>
                                                            <div
                                                                className={`${facePosition.size >= 35 && facePosition.size <= 45 ? "text-green-500" : "text-amber-500"}`}
                                                            >
                                                                Size: {facePosition.size.toFixed(0)}%{" "}
                                                                {facePosition.size >= 38 && facePosition.size <= 42
                                                                    ? "✓ Excellent!"
                                                                    : facePosition.size >= 35 && facePosition.size <= 45
                                                                        ? "✓ Good"
                                                                        : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Toggle guide button */}
                                        <button
                                            type="button"
                                            onClick={toggleGuide}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                                        >
                                            {showGuide ? "Hide Guide" : "Show Guide"}
                                        </button>
                                    </div>

                                    {/* Status indicators */}
                                    <div className="mt-3 space-y-2">
                                        <div className={`flex items-center ${isGoodPosition ? "text-green-500" : "text-amber-500"}`}>
                                            {isGoodPosition ? <MdCheck className="mr-2" /> : <MdWarning className="mr-2" />}
                                            <span className="text-sm">
                                                {isGoodPosition ? "Face perfectly positioned" : "Adjust your face position (follow the guide)"}
                                            </span>
                                        </div>

                                        {/* Position instructions */}
                                        {!isGoodPosition && (
                                            <div className="text-amber-500 text-sm">
                                                {facePosition.x < 45 && "Move face right • "}
                                                {facePosition.x > 55 && "Move face left • "}
                                                {facePosition.y < 45 && "Move face down • "}
                                                {facePosition.y > 55 && "Move face up • "}
                                                {facePosition.size < 35 && "Move closer • "}
                                                {facePosition.size > 45 && "Move back"}
                                            </div>
                                        )}

                                        {showFaceVerification && (
                                            <div className="text-amber-500 text-sm flex items-center">
                                                <MdWarning className="mr-1" />
                                                <span>Only the registered admin face will be accepted</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Instructions */}
                                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                                        <h3 className="text-amber-500 font-medium mb-2">Perfect Face Positioning:</h3>
                                        <ul className="text-gray-300 text-sm space-y-1">
                                            <li>• Center your face between the vertical lines (45-55%)</li>
                                            <li>• Position eyes in the oval area (40-45% from top)</li>
                                            <li>• Face should fill 35-45% of the frame</li>
                                            <li>• Look directly at the camera, no tilting</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full font-bold py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 ${isGoodPosition && (showFaceSetup || showFaceVerification)
                                    ? "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white"
                                    : "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black"
                                }`}
                            disabled={loading || ((showFaceSetup || showFaceVerification) && !isGoodPosition)}
                        >
                            {!showFaceSetup && !showFaceVerification ? (
                                <>
                                    <MdVpnKey className="inline mr-2 text-xl" />
                                    {loading ? "Validating..." : "Validate Password"}
                                </>
                            ) : showFaceSetup ? (
                                <>
                                    <MdCameraAlt className="inline mr-2 text-xl" />
                                    {loading ? "Setting up..." : isGoodPosition ? "Capture Face for Setup" : "Position Your Face"}
                                </>
                            ) : (
                                <>
                                    <MdFace className="inline mr-2 text-xl" />
                                    {loading ? "Verifying Identity..." : isGoodPosition ? "Verify Admin Identity" : "Position Your Face"}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

