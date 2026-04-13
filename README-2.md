# 🌍 Volunteer Coordination Platform

A full-stack web application designed to connect **volunteers, NGOs, and administrators** to manage events, donations, and community impact efficiently.

---

## 🚀 Features

### 👤 Authentication & Roles

* Secure login & registration (JWT-based)
* Role-based access:

  * 🧑 Volunteer
  * 🏢 NGO
  * 🛡️ Admin

---

### 🎯 Core Functionalities

* NGO onboarding & approval system
* Volunteer onboarding
* Event creation & management
* Donation tracking
* Role-based dashboards

---

### 💳 Payments

* Mock payment integration
* Donation handling system
* Payment status tracking

---

### 🔐 Security

* JWT authentication
* Helmet security headers
* CORS configuration
* Rate limiting (production only)

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Context API
* Tailwind CSS (if used)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### DevOps

* Docker
* Docker Compose

---

## 📁 Project Structure

```
.
├── Server/                 # Backend (Node.js + Express)
├── volunteer-platform/     # Frontend (React + Vite)
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`Server/.env`)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/volunteer-db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

### Frontend (`volunteer-platform/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=VolunteerConnect
```

---

## 🐳 Running with Docker

### 1️⃣ Build & Start Containers

```
docker-compose up --build
```

---

### 2️⃣ Access Application

* Frontend → http://localhost:5173
* Backend API → http://localhost:5000/api
* Health Check → http://localhost:5000/api/health

---

### 3️⃣ Stop Containers

```
docker-compose down
```

---

## 👨‍💻 Seed Admin User

Run inside container:

```
docker exec -it server node seedAdmin.js
```

---

## 🔐 Default Admin Credentials

```
Email: admin@gmail.com
Password: (check seedAdmin.js)
```

---

## 🧪 Development Notes

* Rate limiting is **disabled in development**
* Enabled automatically in **production**
* Axios includes:

  * Token handling
  * Retry logic
  * Error handling

---

## ⚡ Common Issues & Fixes

### ❌ Too many requests error

* Fixed by disabling rate limiting in development

---

### ❌ API not reachable

* Ensure `.env` uses:

  ```
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

---

### ❌ Docker networking issue

* Use `localhost` in frontend (browser context)
* Use service names (`mongo`, `server`) internally

---

## 🚀 Future Improvements

* 🔔 Notifications system
* 💬 Chat between volunteers & NGOs
* 📊 Analytics dashboard
* 🌐 Deployment (AWS / Vercel / Render)
* 🔐 Refresh token authentication

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

Developed as a full-stack practice project for learning:

* Scalable backend architecture
* Docker-based development
* Role-based systems

---

✨ *Making a difference through technology*
