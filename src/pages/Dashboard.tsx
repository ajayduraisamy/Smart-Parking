import { useEffect, useState } from "react";
import {
    Car,
    Wallet,
    Plus,
    LogOut,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    User,
    ParkingSquare,
    IndianRupee,
    Shield,
    Zap
} from "lucide-react";

interface Slot {
    sid: number;
    uid: number | string | null;
    username: string | null;
}

export default function Dashboard() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [upiId, setUpiId] = useState("");
    const [amount, setAmount] = useState("");
    const [unparkSlot, setUnparkSlot] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("qr_user") || "{}");

    // --------------------------
    // Fetch Dashboard Data
    // --------------------------
    const fetchDashboard = async () => {
        try {
            setIsLoading(true);
            const userRes = await fetch("https://aislyn.in/QRPARK/r-api.php?action=get_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id }),
            });
            const userData = await userRes.json();
            if (userData.status === "success") {
                setBalance(parseFloat(userData.data.balance) || 0);
            }

            const slotRes = await fetch("https://aislyn.in/QRPARK/r-api.php?action=get_slots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id }),
            });
            const slotData = await slotRes.json();
            if (slotData.status === "success") {
                setSlots(slotData.data || []);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            showMessage("Error fetching data.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const showMessage = (msg: string, type: "success" | "error" | "info" = "info") => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 5000);
    };

    useEffect(() => {
        fetchDashboard();
        const interval = setInterval(fetchDashboard, 5000);
        return () => clearInterval(interval);
    }, []);

    // --------------------------
    // Park Car
    // --------------------------
    const handlePark = async (sid: number) => {
        if (balance <= 0) {
            showMessage("⚠️ Insufficient balance! Please recharge your wallet.", "error");
            return;
        }

        setIsLoading(true);
        const res = await fetch("https://aislyn.in/QRPARK/r-api.php?action=park", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, sid }),
        });

        const data = await res.json();
        showMessage(data.message, data.status === "success" ? "success" : "error");
        fetchDashboard();
    };

    // --------------------------
    // Unpark Car
    // --------------------------
    const confirmUnpark = (sid: number) => {
        setUnparkSlot(sid);
    };

    const handleUnparkConfirm = async () => {
        if (!unparkSlot) return;
        setIsLoading(true);
        showMessage("Processing unpark... Please wait ⏳", "info");

        try {
            const res = await fetch("https://aislyn.in/QRPARK/r-api.php?action=unpark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, sid: unparkSlot }),
            });

            const data = await res.json();
            showMessage(data.message, data.status === "success" ? "success" : "error");
            setUnparkSlot(null);
            setTimeout(() => fetchDashboard(), 1000);
        } catch (err) {
            console.error("Unpark Error:", err);
            showMessage("⚠️ Failed to unpark. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnparkCancel = () => {
        setUnparkSlot(null);
    };

    // --------------------------
    // Recharge Wallet
    // --------------------------
    const handleRechargeSubmit = async () => {
        if (!upiId || !amount || parseFloat(amount) <= 0) {
            showMessage("Please enter valid UPI ID and amount!", "error");
            return;
        }

        setIsLoading(true);
        const res = await fetch("https://aislyn.in/QRPARK/r-api.php?action=recharge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                upi_id: upiId,
                amount: parseFloat(amount),
            }),
        });

        const data = await res.json();
        showMessage(data.message, data.status === "success" ? "success" : "error");
        setShowRechargeModal(false);
        setUpiId("");
        setAmount("");
        fetchDashboard();
    };

    // --------------------------
    // JSX Render
    // --------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <ParkingSquare className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Smart Parking
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <User size={16} />
                                Welcome, {user.username || "User"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                            <Wallet className="h-5 w-5" />
                            <div>
                                <p className="text-sm opacity-90">Wallet Balance</p>
                                <p className="text-xl font-bold">₹{balance.toFixed(2)}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowRechargeModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
                        >
                            <Plus size={20} />
                            Recharge
                        </button>

                        <button
                            onClick={fetchDashboard}
                            disabled={isLoading}
                            className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={`${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-2xl border backdrop-blur-sm ${messageType === "success"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                            : messageType === "error"
                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
                        }`}>
                        <div className="flex items-center gap-3 justify-center">
                            {messageType === "success" ? (
                                <CheckCircle size={24} />
                            ) : messageType === "error" ? (
                                <XCircle size={24} />
                            ) : (
                                <AlertCircle size={24} />
                            )}
                            <span className="font-semibold text-lg">{message}</span>
                        </div>
                    </div>
                )}

                {/* Parking Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {slots.map((slot) => {
                        const slotUid = Number(slot.uid);
                        const userId = Number(user.id);
                        const isAvailable = !slotUid || slotUid === 0;
                        const isUserSlot = slotUid === userId;

                        return (
                            <div
                                key={slot.sid}
                                className={`relative p-6 rounded-2xl shadow-xl backdrop-blur-sm border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isUserSlot
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white"
                                        : isAvailable
                                            ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 text-white animate-pulse"
                                            : "bg-gradient-to-br from-red-500 to-pink-600 border-red-400 text-white"
                                    }`}
                            >
                                {/* Slot Number */}
                                <div className="text-center mb-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <ParkingSquare size={24} />
                                        <h3 className="text-2xl font-bold">#{slot.sid}</h3>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isUserSlot
                                            ? "bg-blue-400/20 text-blue-100"
                                            : isAvailable
                                                ? "bg-green-400/20 text-green-100"
                                                : "bg-red-400/20 text-red-100"
                                        }`}>
                                        {isUserSlot ? (
                                            <>
                                                <Car size={12} />
                                                Your Car
                                            </>
                                        ) : isAvailable ? (
                                            <>
                                                <Zap size={12} />
                                                Available
                                            </>
                                        ) : (
                                            <>
                                                <Shield size={12} />
                                                Occupied
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Occupier Info */}
                                {!isAvailable && !isUserSlot && (
                                    <p className="text-center text-sm opacity-90 mb-4">
                                        by {slot.username || "Unknown"}
                                    </p>
                                )}

                                {/* Action Button */}
                                <div className="mt-4">
                                    {isUserSlot ? (
                                        <button
                                            onClick={() => confirmUnpark(slot.sid)}
                                            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <LogOut size={18} />
                                            Unpark ₹100
                                        </button>
                                    ) : isAvailable ? (
                                        <button
                                            onClick={() => handlePark(slot.sid)}
                                            className="w-full bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <Car size={18} />
                                            Park Now
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl shadow cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Shield size={18} />
                                            Occupied
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Footer */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Car className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Available Slots</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {slots.filter(s => !s.uid || Number(s.uid) === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Occupied Slots</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {slots.filter(s => s.uid && Number(s.uid) !== 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your Parking</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {slots.filter(s => Number(s.uid) === Number(user.id)).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🚗 Unpark Confirmation Modal */}
            {unparkSlot && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <LogOut className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Confirm Unpark
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Are you sure you want to unpark from <span className="font-bold text-blue-600">Slot #{unparkSlot}</span>?
                            </p>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                    <span className="font-bold">₹100</span> will be deducted from your wallet balance.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUnparkCancel}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnparkConfirm}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LogOut className="h-4 w-4" />
                                )}
                                Yes, Unpark
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 💳 Recharge Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4">
                                <Wallet className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Recharge Wallet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Add funds to your parking wallet
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <User size={16} />
                                    UPI ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="username@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <IndianRupee size={16} />
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter amount in ₹"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowRechargeModal(false)}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRechargeSubmit}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                Recharge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}