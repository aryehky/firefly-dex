// path: ./app/not-found.jsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-pixel text-deepblue">
      <h1 className="text-5xl mb-4">404</h1>
      <p className="text-2xl mb-8">Page Not Found</p>
      <a href="/" className="bg-coral text-white border-2 border-deepblue rounded-pixel px-6 py-2 shadow-pixel hover:scale-105 transition-transform text-lg">Go Home</a>
    </div>
  );
} 