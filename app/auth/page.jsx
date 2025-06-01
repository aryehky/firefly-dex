capp/auth/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Auth = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const steps = [
        'Connect Wallet',
        'Verify Network',
        'Complete Registration',
    ];

    const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const handleBack = () => setStep((s) => Math.max(s - 1, 0));
    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setStep(1);
        }, 1000);
    };
    const handleComplete = () => {
        setIsRegistered(true);
        setTimeout(() => {
            router.push('/trading');
        }, 1500);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] w-full px-4 md:px-0 font-pixel bg-skyblue">
            <div className="w-full max-w-md mt-16 mb-8 bg-cloud border-2 border-deepblue rounded-pixel shadow-pixel p-8 flex flex-col items-center">
                <h1 className="text-3xl text-deepblue mb-4">AUTH</h1>
                <div className="w-full mb-6">
                    {steps.map((label, i) => (
                        <div key={i} className={`flex items-center mb-2 ${i === step ? 'text-coral' : 'text-deepblue'}`}>
                            <span className="mr-2">{i + 1}.</span> {label}
                        </div>
                    ))}
                </div>
                {error && <div className="bg-coral text-cloud p-2 rounded-pixel mb-4 w-full text-center">{error}</div>}
                {isRegistered && <div className="bg-mint text-deepblue p-2 rounded-pixel mb-4 w-full text-center">Wallet connected! Redirecting...</div>}
                <div className="w-full flex flex-col gap-4">
                    {step === 0 && (
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="font-pixel bg-coral text-cloud border-2 border-deepblue rounded-pixel px-6 py-3 shadow-pixel hover:scale-105 transition-transform text-lg"
                        >
                            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </button>
                    )}
                    {step === 1 && (
                        <>
                            <div className="bg-yellow-200 text-deepblue p-2 rounded-pixel mb-2 text-center">Please switch to the correct network</div>
                            <button
                                onClick={handleNext}
                                className="font-pixel bg-mint text-deepblue border-2 border-deepblue rounded-pixel px-6 py-3 shadow-pixel hover:scale-105 transition-transform text-lg"
                            >
                                Switch Network
                            </button>
                        </>
                    )}
                    {step === 2 && (
                        <button
                            onClick={handleComplete}
                            className="font-pixel bg-coral text-cloud border-2 border-deepblue rounded-pixel px-6 py-3 shadow-pixel hover:scale-105 transition-transform text-lg"
                        >
                            Complete Setup
                        </button>
                    )}
                </div>
                <div className="mt-6 text-center text-deepblue text-xs">
                    By connecting your wallet, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </div>
            </div>
        </div>
    );
};

export default Auth;