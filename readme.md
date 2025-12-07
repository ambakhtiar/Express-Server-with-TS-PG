# 🚗 Vehicle Rental System

A backend API for managing a **Vehicle Rental System** with role-based authentication, vehicle inventory, customer accounts, and booking management.

---

## 🎯 Project Overview
This system provides:
- **Vehicles** – Manage vehicle inventory with availability tracking  
- **Customers** – Manage customer accounts and profiles  
- **Bookings** – Handle vehicle rentals, returns, and cost calculation  
- **Authentication** – Secure role-based access control (Admin and Customer roles)  

---

## 🛠️ Technology Stack
- **Node.js + TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database)
- **bcrypt** (password hashing)
- **jsonwebtoken (JWT)** (authentication)

---

## 📁 Code Structure
The project follows a **modular pattern** with clear separation of concerns:


---

## 📊 Database Schema

### Users
| Field     | Notes                                |
|-----------|--------------------------------------|
| id        | Auto-generated                       |
| name      | Required                             |
| email     | Required, unique, lowercase          |
| password  | Required, min 6 characters           |
| phone     | Required                             |
| role      | 'admin' or 'customer'                |

### Vehicles
| Field              | Notes                                |
|--------------------|--------------------------------------|
| id                 | Auto-generated                       |
| vehicle_name       | Required                             |
| type               | 'car', 'bike', 'van', 'SUV'          |
| registration_number| Required, unique                     |
| daily_rent_price   | Required, positive                   |
| availability_status| 'available' or 'booked'              |

### Bookings
| Field          | Notes                                |
|----------------|--------------------------------------|
| id             | Auto-generated                       |
| customer_id    | Links to Users table                 |
| vehicle_id     | Links to Vehicles table              |
| rent_start_date| Required                             |
| rent_end_date  | Required, must be after start date   |
| total_price    | Required, positive                   |
| status         | 'active', 'cancelled', 'returned'    |

---

## 🔐 Authentication & Authorization

- **Admin** – Full system access (manage vehicles, users, bookings)  
- **Customer** – Register, view vehicles, manage own bookings  

### Flow
1. Passwords hashed with **bcrypt** before storage  
2. Login via `/api/v1/auth/signin` → returns **JWT token**  
3. Protected endpoints require `Authorization: Bearer <token>`  
4. Middleware validates token & role permissions  

---

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` → Register new user  
- `POST /api/v1/auth/signin` → Login & receive JWT  

### Vehicles
- `POST /api/v1/vehicles` → Admin only, add vehicle  
- `GET /api/v1/vehicles` → Public, view all vehicles  
- `GET /api/v1/vehicles/:vehicleId` → Public, view vehicle details  
- `PUT /api/v1/vehicles/:vehicleId` → Admin only, update vehicle  
- `DELETE /api/v1/vehicles/:vehicleId` → Admin only, delete vehicle  

### Users
- `GET /api/v1/users` → Admin only, view all users  
- `PUT /api/v1/users/:userId` → Admin or own profile update  
- `DELETE /api/v1/users/:userId` → Admin only, delete user  

### Bookings
- `POST /api/v1/bookings` → Customer/Admin, create booking  
- `GET /api/v1/bookings` → Role-based (Admin: all, Customer: own)  
- `PUT /api/v1/bookings/:bookingId` → Role-based (Cancel/Return)  

---

## 🚀 Deployment

- **Live API Link:** [Paste your deployed link here]  
- **GitHub Repository:** [Paste your repo link here]  

---

## 📌 Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-link>
   cd vehicle-rental-system

2. Install dependencies:
    ```bash
    npm install 

3. Configure environment variables in .env:
    ```bash
    connection_str=postgres://user:password@localhost:5432/vehiclerental
    port=5000
    JWT_SECRET=yourSecretKey

4. Run in development:
    ```bash
    npm run dev

