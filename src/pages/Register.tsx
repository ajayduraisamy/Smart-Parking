import { useState } from "react";
import { Link } from "react-router-dom";

import {
    User,
    Mail,
    Car,
    ArrowLeft,
    Shield,
    CheckCircle,
    XCircle
} from "lucide-react";

export default function Register() {
   
    const [form, setForm] = useState({
        username: "",
        email: "",
        licence_plat: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const res = await fetch("https://aislyn.in/QRPARK/r-register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log("Response:", data);

            if (data.success) {
                setMessage(data.message || "Registration successful!");
                setIsSuccess(true);
                // Reset form on success
                setForm({ username: "", email: "", licence_plat: "" });
            } else {
                setMessage(data.message || "Registration failed. Please try again.");
                setIsSuccess(false);
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Network or server error. Please try again.");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            {/* Back Button */}
            <Link
                to="/login"
                className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </Link>

            <div className="w-full max-w-md">
                {/* Header */}
               

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <Car className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join Smart Parking and start your journey
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <User size={16} />
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Mail size={16} />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none"
                                    required
                                    disabled={isLoading}
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* License Plate Field */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Shield size={16} />
                                License Plate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter your license plate"
                                    value={form.licence_plat}
                                    onChange={(e) => setForm({ ...form, licence_plat: e.target.value })}
                                    className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none uppercase"
                                    required
                                    disabled={isLoading}
                                />
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Create Account
                                </>
                            )}
                        </button>

                        {/* Message */}
                        {message && (
                            <div className={`p-4 rounded-xl border ${isSuccess
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {isSuccess ? (
                                        <CheckCircle size={20} className="flex-shrink-0" />
                                    ) : (
                                        <XCircle size={20} className="flex-shrink-0" />
                                    )}
                                    <span className="text-sm font-medium">{message}</span>
                                </div>
                            </div>
                        )}

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}