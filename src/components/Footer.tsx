import { Car, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // ✅ Show scroll-top when user scrolls down
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {/* 🔼 Scroll-to-Top Floating Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group animate-bounce"
                >
                    <ArrowUp
                        size={20}
                        className="group-hover:-translate-y-1 transition-transform"
                    />
                </button>
            )}

            {/* 🌙 Main Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                {/* ✅ Single Row Container */}
                <div className="relative max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
                    {/* Left: Logo + Name */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Smart Parking
                        </h3>
                    </div>

                    {/* Right: Copyright */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 md:mt-0 text-center md:text-right">
                        © {new Date().getFullYear()} Smart Parking. All rights reserved.
                    </p>
                </div>
            </footer>
        </>
    );
}
