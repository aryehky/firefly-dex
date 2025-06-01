// path: ./app/loading.jsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-pixel text-deepblue animate-pulse">
      <span className="text-5xl mb-4">⏳</span>
      <p className="text-2xl">Loading...</p>
    </div>
  );
} 