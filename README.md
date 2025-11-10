# 🚗 Smart QR Parking System

> **An Intelligent Parking Management Web App** built with **React (TypeScript)**, **PHP**, and **MySQL**  
> Featuring real-time slot tracking, wallet-based payments, and an advanced admin dashboard.

---

## 🧠 Overview

Smart QR Parking System allows users to register, park/unpark vehicles, manage wallet balance,  
and for admins to monitor, control, and manage all parking slots seamlessly.

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React + TypeScript + Tailwind CSS |
| **Backend (API)** | PHP (REST API) |
| **Database** | MySQL |
| **Auth** | LocalStorage-based persistent login |
| **UI Mode** | Light 🌞 / Dark 🌙 |
| **Hosting** | Vercel (Frontend) + PHP Server (Backend) |

---


---

## ✨ Features

### 👤 User
- 🔑 Register & Login via Username + Licence Plate  
- 💰 Wallet Recharge (UPI)  
- 🚗 Park / Unpark Car (₹100 charge per unpark)  
- 🔄 Auto-refreshing slot grid  
- 🌗 Dark/Light mode UI  
- 💬 Live status messages

### 🧑‍💼 Admin
- 🧾 View All Users with Slot, Time & Duration  
- 🅿️ Manually Unpark Any User  
- 📊 Dashboard Summary:
  - Total Users  
  - Total Slots  
  - Parked Vehicles  
  - Available Slots  
- ⏱ Shows how long each vehicle was parked  
- 🔒 Restricted Access (admin only)

---

## 🗄️ Database Schema

### `QRparking`
| Column | Type | Description |
|--------|------|-------------|
| id | INT | User ID |
| username | VARCHAR(100) | User name |
| email | VARCHAR(100) | Email |
| licence_plat | VARCHAR(50) | Vehicle number |
| sid | INT | Assigned slot ID |
| balance | DECIMAL(10,2) | Wallet balance |
| created_at | DATETIME | Registered at |

### `QRparkingSlots`
| Column | Type | Description |
|--------|------|-------------|
| sid | INT | Slot ID |
| uid | INT | User ID (0 = available) |
| booked_at | DATETIME | When slot was booked |

---

## 🔌 API Endpoints

### User APIs (`r-api.php`)
| Action | Description | Method |
|--------|--------------|--------|
| `get_user` | Fetch user details | `POST` |
| `get_slots` | Get all slot data | `POST` |
| `park` | Park a car | `POST` |
| `unpark` | Unpark (₹100 deduction) | `POST` |
| `recharge` | Add balance using UPI | `POST` |

### Admin APIs (`admin-api.php`)
| Action | Description | Method |
|--------|--------------|--------|
| `get_all` | Fetch all users with slot & duration | `GET` |
| `admin_unpark` | Force unpark user | `POST` |

---

## 🧩 Sample Response

###  `GET admin-api.php?action=get_all`
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "Ajayd",
        "email": "ajaycode@gmail.com",
        "licence_plat": "AT001",
        "slot_id": 2,
        "status": "Occupied",
        "booked_at": "2025-11-10 14:20:00",
        "duration": "2.4 hrs",
        "balance": 19660
      }
    ],
    "summary": {
      "total_users": 8,
      "total_slots": 25,
      "total_parked": 5,
      "available": 20
    }
  }
}

```
-----
### Installation 

git clone https://github.com/ajayduraisamy/Smart-Parking.git
--
cd frontend
---
npm install
---
npm run dev


