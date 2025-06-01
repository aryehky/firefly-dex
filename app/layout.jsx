// path: ./app/layout.jsx
import '../styles/globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'FireFlyDex',
  description: 'FireFly DEX',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-skyblue font-pixel">
        <Navbar />
        <main className="pt-8 px-2 md:px-0">{children}</main>
      </body>
    </html>
  );
} 