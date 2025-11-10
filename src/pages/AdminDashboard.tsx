import { useEffect, useState } from "react";
import { Car, Users, CreditCard, LogOut, Shield, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserData {
    id: number;
    username: string;
    email: string;
    licence_plat: string;
    slot_id: number | null;
    status: string;
    booked_at: string | null;
    duration: string | null;
    balance: number;
}

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [summary, setSummary] = useState({
        total_users: 0,
        total_slots: 0,
        total_parked: 0,
        available: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchAdminData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("https://aislyn.in/QRPARK/admin.php?action=get_all");
            const data = await res.json();

            if (data.status === "success") {
                setUsers(data.data.users);
                setSummary(data.data.summary);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleUnpark = async (userId: number) => {
        if (!window.confirm(`Are you sure you want to unpark user #${userId}?`)) return;

        setIsLoading(true);
        try {
            const res = await fetch("https://aislyn.in/QRPARK/admin.php?action=admin_unpark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId }),
            });
            const data = await res.json();
            setMessage(data.message);
            fetchAdminData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
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

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <Users className="h-8 w-8 text-blue-400 mb-2 mx-auto" />
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p className="text-3xl font-bold">{summary.total_users}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <Shield className="h-8 w-8 text-green-400 mb-2 mx-auto" />
                        <h2 className="text-lg font-semibold">Total Slots</h2>
                        <p className="text-3xl font-bold">{summary.total_slots}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <Car className="h-8 w-8 text-yellow-400 mb-2 mx-auto" />
                        <h2 className="text-lg font-semibold">Parked</h2>
                        <p className="text-3xl font-bold">{summary.total_parked}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <CreditCard className="h-8 w-8 text-purple-400 mb-2 mx-auto" />
                        <h2 className="text-lg font-semibold">Available</h2>
                        <p className="text-3xl font-bold">{summary.available}</p>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className="text-center mb-4 text-sm text-green-400 font-semibold">
                        {message}
                    </div>
                )}

                {/* User Table */}
                <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg p-4">
                    <table className="min-w-full text-sm text-gray-300">
                        <thead className="bg-gray-700 text-gray-100 uppercase text-xs">
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3 px-4">Username</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Plate</th>
                                <th className="py-3 px-4">Slot</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Time Parked</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className="border-t border-gray-700 hover:bg-gray-700/40 transition"
                                >
                                    <td className="py-3 px-4">{i + 1}</td>
                                    <td className="py-3 px-4">{u.username}</td>
                                    <td className="py-3 px-4">{u.email}</td>
                                    <td className="py-3 px-4">{u.licence_plat}</td>
                                    <td className="py-3 px-4">{u.slot_id || "-"}</td>
                                    <td
                                        className={`py-3 px-4 font-semibold ${u.status === "Available"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {u.status}
                                    </td>
                                    <td className="py-3 px-4">
                                        {u.booked_at ? new Date(u.booked_at).toLocaleString() : "-"}
                                    </td>
                                    <td className="py-3 px-4">{u.duration || "-"}</td>
                                    <td className="py-3 px-4">
                                        {u.status === "Occupied" ? (
                                            <button
                                                onClick={() => handleUnpark(u.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs"
                                            >
                                                Unpark
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Loader */}
                {isLoading && (
                    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                        <RefreshCw className="animate-spin text-blue-400 h-10 w-10" />
                    </div>
                )}
            </div>
        </div>
    );
}
