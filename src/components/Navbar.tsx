import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
    Moon,
    Sun,
    LogOut,
    LogIn,
    UserPlus,
    LayoutDashboard,
    Menu,
    X,
    Car
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMobileMenuOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
          
            <nav className="relative flex items-center justify-between px-6 py-4 shadow-lg bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 z-50">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Smart Parking
                    </h1>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
                            >
                                <LogIn size={18} />
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <UserPlus size={18} />
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 hover:scale-105 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
                    >
                        {theme === "dark" ? (
                            <Sun size={20} className="text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
                        ) : (
                            <Moon size={20} className="text-blue-600 group-hover:rotate-45 transition-transform duration-300" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    {isMobileMenuOpen ? (
                        <X size={20} className="text-gray-700 dark:text-gray-300" />
                    ) : (
                        <Menu size={20} className="text-gray-700 dark:text-gray-300" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu - Fixed positioning */}
            <div className={`
                md:hidden fixed top-0 left-0 right-0 h-full z-40 
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
            `}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Menu Content - Slides down from top */}
                <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 mt-16 mx-4 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 space-y-3">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                                >
                                    <LogIn size={20} />
                                    <span className="font-medium">Login</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation("/register")}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                                >
                                    <UserPlus size={20} />
                                    <span className="font-medium">Register</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation("/dashboard")}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                                >
                                    <LayoutDashboard size={20} />
                                    <span className="font-medium">Dashboard</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </>
                        )}

                        {/* Mobile Theme Toggle */}
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <Sun size={20} className="text-yellow-400" />
                                        <span className="font-medium">Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon size={20} className="text-blue-600" />
                                        <span className="font-medium">Dark Mode</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}