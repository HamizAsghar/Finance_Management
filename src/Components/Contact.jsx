'use client'
import React, { useState } from 'react';
import Swal from 'sweetalert2';

export function ContactUs() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading indicator while submitting the form

        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;

        try {
            // Send the contact data to the backend API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success: Show success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: data.message || 'Your message was sent successfully.',
                }).then(() => {
                    // Clear form fields after success
                    e.target.reset();
                });
            } else {
                // Error: Show error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Send Message',
                    text: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            // Handle any other errors (network, etc.)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred. Please try again later.',
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h3 className="text-4xl font-semibold text-center">Get in Touch</h3>
                <form onSubmit={handleSubmit} className="mt-8 mx-auto max-w-3xl space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-lg">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-lg">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="example@email.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-lg">
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            placeholder="Write your message here..."
                            required
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className={`rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
