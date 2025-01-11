'use client'

export default function About() {

    return (
        <div className="min-h-screen bg-white">

            <div className="grid lg:grid-cols-2 min-h-screen">
                {/* Content Section */}
                <div className="px-6 py-12 lg:px-12 lg:py-24 flex flex-col justify-center">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-bold text-black mb-8">
                            About us
                        </h1>
                        <p className="text-black text-lg leading-relaxed mb-12">
                            We're a team of digital natives with deep financial expertise and
                            understanding of the gold industry. Traditionally only the
                            wealthy have been able to hedge their portfolios with gold cost
                            effectively and securely. Our mission is to provide a robust store
                            of wealth to all citizens of the world. This is a way for the masses
                            to store Swiss gold on their mobile device.
                        </p>
                        <button
                            className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 
                         text-black font-semibold rounded-lg transition-colors"
                        >
                            Join our team
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-2"
                            >
                                <path d="M5 12h14M19 12l-7-7M19 12l-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative h-[300px] lg:h-auto">
                    <img
                        src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
                        alt="Modern gold bars"
                        className="absolute inset-0 w-2/3 h-2/3 object-cover mt-20 ml-20"
                    />
                </div>
            </div>
        </div>
    )
}

