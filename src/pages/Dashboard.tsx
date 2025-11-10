import { useEffect, useState } from "react";

interface Slot {
    sid: number;
    uid: number | string | null;
    username: string | null;
}

export default function Dashboard() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [upiId, setUpiId] = useState("");
    const [amount, setAmount] = useState("");
    const [unparkSlot, setUnparkSlot] = useState<number | null>(null); // ✅ for confirm modal
    const user = JSON.parse(localStorage.getItem("qr_user") || "{}");

    // --------------------------
    // Fetch Dashboard Data
    // --------------------------
    const fetchDashboard = async () => {
        try {
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
            setMessage("Error fetching data.");
        }
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
            alert("⚠️ Insufficient balance! Please recharge your wallet.");
            return;
        }

        const res = await fetch("https://aislyn.in/QRPARK/r-api.php?action=park", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, sid }),
        });

        const data = await res.json();
        setMessage(data.message);
        fetchDashboard();
    };

    // --------------------------
    // Unpark Car (React modal confirm)
    // --------------------------
    const confirmUnpark = (sid: number) => {
        setUnparkSlot(sid); // show modal
    };

    const handleUnparkConfirm = async () => {
        if (!unparkSlot) return;
        setMessage("Processing unpark... Please wait ⏳");

        try {
            const res = await fetch("https://aislyn.in/QRPARK/r-api.php?action=unpark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, sid: unparkSlot }),
            });

            const data = await res.json();
            setMessage(data.message);
            setUnparkSlot(null);
            setTimeout(() => fetchDashboard(), 1000);
        } catch (err) {
            console.error("Unpark Error:", err);
            setMessage("⚠️ Failed to unpark. Please try again.");
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
            alert("Please enter valid UPI ID and amount!");
            return;
        }

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
        setMessage(data.message);
        setShowRechargeModal(false);
        setUpiId("");
        setAmount("");
        fetchDashboard();
    };

    // --------------------------
    // JSX Render
    // --------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Smart Parking Dashboard
                    </h1>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <p className="font-semibold text-lg">💰 Balance: ₹{balance.toFixed(2)}</p>
                        <button
                            onClick={() => setShowRechargeModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md"
                        >
                            Recharge
                        </button>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className="text-center mb-4">
                        <p className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 py-2 px-4 rounded-md inline-block shadow">
                            {message}
                        </p>
                    </div>
                )}

                {/* Parking Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {slots.map((slot) => {
                        const slotUid = Number(slot.uid);
                        const userId = Number(user.id);

                        const isAvailable = !slotUid || slotUid === 0;
                        const isUserSlot = slotUid === userId;

                        return (
                            <div
                                key={slot.sid}
                                className={`p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white transition transform hover:scale-105 ${isUserSlot
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : isAvailable
                                        ? "bg-green-500 hover:bg-green-600 animate-pulse"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                <p className="text-2xl font-bold mb-1">Slot #{slot.sid}</p>
                                <p className="text-sm mb-3">
                                    {isUserSlot
                                        ? "Your Car 🚗"
                                        : isAvailable
                                            ? "Available"
                                            : `Occupied by ${slot.username || "Unknown"}`}
                                </p>

                                {isUserSlot ? (
                                    <button
                                        onClick={() => confirmUnpark(slot.sid)}
                                        className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-200"
                                    >
                                        Unpark (₹100)
                                    </button>
                                ) : isAvailable ? (
                                    <button
                                        onClick={() => handlePark(slot.sid)}
                                        className="bg-white text-green-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-200"
                                    >
                                        Park
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-md cursor-not-allowed"
                                    >
                                        Occupied
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 🚗 Unpark Confirmation Modal */}
            {unparkSlot && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
                            🚗 Confirm Unpark
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Are you sure you want to unpark from <b>Slot #{unparkSlot}</b>? <br />
                            <span className="text-red-500 font-semibold">₹100</span> will be deducted from your balance.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleUnparkCancel}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnparkConfirm}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Yes, Unpark
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 💳 Recharge Modal */}
            {showRechargeModal && (
                <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-4 text-center text-blue-600 dark:text-blue-400">
                            💳 Recharge Wallet
                        </h3>

                        <input
                            type="text"
                            placeholder="Enter UPI ID (e.g., ajay@upi)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                        />

                        <input
                            type="number"
                            placeholder="Enter Amount (₹)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRechargeModal(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRechargeSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Recharge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
