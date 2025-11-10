import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({ username: "", licence_plat: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🧠 Admin Login (Frontend Check)
        if (form.username === "admin@gmail.com" && form.licence_plat === "Admin123") {
            const adminUser = {
                id: 0,
                username: "Admin",
                email: "admin@gmail.com",
                role: "admin",
            };
            login(adminUser);
            navigate("/admin-dashboard");
            return;
        }

        try {
            const res = await fetch("https://aislyn.in/QRPARK/r-login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            setMessage(data.message);

            if (data.status === "success") {
                login(data.user);
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setMessage("Network or server error.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition">
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-white/30 dark:border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mb-3">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Login to continue your parking journey 🚗
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password / Licence Plate"
                        value={form.licence_plat}
                        onChange={(e) => setForm({ ...form, licence_plat: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
                    >
                        Login
                    </button>

                    {message && (
                        <p className="text-center mt-3 text-sm font-medium">
                            {message}
                        </p>
                    )}
                </form>

                <div className="text-center mt-6 text-xs text-gray-600 dark:text-gray-500">
                    Don’t have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                        Register here
                    </a>
                </div>
            </div>
        </div>
    );
}
