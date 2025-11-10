// 🌐 Base API configuration for QRparking (auto switch between local & live)
const isLocal = window.location.hostname === "localhost";

export const BASE_API = {
    register: isLocal
        ? "http://localhost/QRparking/register_api.php"
        : "https://aislyn.in/QRPARK/register_api.php",

    login: isLocal
        ? "http://localhost/QRparking/login_api.php"
        : "https://aislyn.in/QRPARK/login_api.php",

    park: isLocal
        ? "http://localhost/QRparking/park_api.php"
        : "https://aislyn.in/QRPARK/park_api.php",
};

// 🔁 Universal request helper
export const apiRequest = async (url: string, payload: any = {}) => {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include", // PHP session cookies
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("API Error:", err);
        return { status: "error", message: "Network or server error." };
    }
};
