import { useEffect, useState } from "react";
import { Car, Users, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, slots: 0, balance: 0 });

    useEffect(() => {
        // Example: Fetch stats
        fetch("https://aislyn.in/QRPARK/admin-stats.php")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch(() => setStats({ users: 5, slots: 25, balance: 45000 }));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Car className="h-7 w-7 text-blue-400" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Admin Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                    >
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <Users className="h-8 w-8 text-blue-400 mb-2" />
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p className="text-3xl font-bold">{stats.users}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <Car className="h-8 w-8 text-green-400 mb-2" />
                        <h2 className="text-lg font-semibold">Total Slots</h2>
                        <p className="text-3xl font-bold">{stats.slots}</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <CreditCard className="h-8 w-8 text-yellow-400 mb-2" />
                        <h2 className="text-lg font-semibold">Total Balance</h2>
                        <p className="text-3xl font-bold">₹{stats.balance}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
