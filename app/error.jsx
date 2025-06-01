// path: ./app/error.jsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-pixel text-deepblue">
      <h1 className="text-5xl mb-4">Something went wrong!</h1>
      <p className="text-2xl mb-8">{error?.message || 'An unexpected error occurred.'}</p>
      <button onClick={reset} className="bg-coral text-white border-2 border-deepblue rounded-pixel px-6 py-2 shadow-pixel hover:scale-105 transition-transform text-lg">Try Again</button>
    </div>
  );
} 