// path: ./app/page.jsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();
    const features = [
        {
            title: 'Secure Trading',
            description: 'Advanced security measures to protect your assets and transactions',
            icon: <span className="text-4xl">🛡️</span>,
        },
        {
            title: 'Lightning Fast',
            description: 'High-performance trading engine for instant order execution',
            icon: <span className="text-4xl">⚡</span>,
        },
        {
            title: 'Easy Integration',
            description: 'Seamless integration with popular wallets and trading tools',
            icon: <span className="text-4xl">🔗</span>,
        },
    ];
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-4 md:px-0 overflow-hidden">
            {/* Pixelated Cloud Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-10 left-10 w-40 h-20 bg-cloud rounded-full opacity-70 blur-sm"></div>
                <div className="absolute top-32 right-20 w-56 h-24 bg-cloud rounded-full opacity-60 blur-sm"></div>
                <div className="absolute bottom-10 left-1/3 w-48 h-16 bg-cloud rounded-full opacity-50 blur-sm"></div>
            </div>
            {/* Hero Header */}
            <header className="z-10 mt-20 mb-8 text-center">
                <h1 className="font-pixel text-5xl md:text-7xl text-deepblue drop-shadow-pixel tracking-widest">FIREFLY</h1>
                <h2 className="font-pixel text-4xl md:text-6xl text-coral drop-shadow-pixel tracking-widest -mt-4">DEX</h2>
            </header>
            {/* Character Sprite Placeholder */}
            <div className="z-10 flex justify-center mb-8">
                {/* Replace with your sprite image */}
                <div className="w-20 h-20 bg-mint border-2 border-deepblue rounded-pixel pixelated flex items-center justify-center">
                    <span className="text-2xl">🦋</span>
                </div>
            </div>
            {/* Platform Tiles */}
            <main className="z-10 flex flex-row items-end gap-8 mb-16">
                {/* Left platform */}
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-12 h-12 bg-cloud border-2 border-deepblue rounded-pixel shadow-pixel flex items-center justify-center"
                        ></div>
                    ))}
                </div>
                {/* Right platform */}
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-12 h-12 bg-coral border-2 border-deepblue rounded-pixel shadow-pixel flex items-center justify-center"
                        ></div>
                    ))}
                </div>
            </main>
            {/* Features Section */}
            <section className="z-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
                {features.map((feature, index) => (
                    <div key={index} className="glass-card flex flex-col items-center p-8 text-center h-full">
                        <div className="mb-4 text-5xl text-deepblue flex items-center justify-center pixelated">{feature.icon}</div>
                        <div className="font-pixel text-xl md:text-2xl text-deepblue mb-2">{feature.title}</div>
                        <div className="text-deepblue text-base md:text-lg font-pixel opacity-80">{feature.description}</div>
                    </div>
                ))}
            </section>
            {/* Start Button */}
            <button
                onClick={() => router.push('/trading')}
                className="z-10 font-pixel bg-coral text-cloud border-2 border-deepblue rounded-pixel px-8 py-4 shadow-pixel hover:scale-105 transition-transform text-xl mt-4 mb-12"
            >
                START TRADING
            </button>
        </div>
    );
};

export default Home;