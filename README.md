# 📦 Inventory Management System

An intelligent inventory management system built using **Django** as the backend framework with **MongoDB**. This application helps users manage their inventory, track stock performance, and make smart restocking decisions using integrated **Machine Learning** predictions.

---

## 🚀 **[👉 CHECK IT LIVE 👈][](https://inventory-vpom.vercel.app/)**

🔗 Explore the full app here:  
**Live Demo →** https://inventory-vpom.vercel.app/


## ✨ Features

- 🔐 **Authentication & Role Management** – Supports both Admin and User roles
- 🏢 **Organization Registration & User Onboarding** – Seamless registration and onboarding process
- 📦 **Item Management** – Add, update, view, and delete inventory items
- 📊 **Sales & Purchase Orders** – Track purchase and sales orders with detailed summaries
- 🔁 **Composite Items** – Manage complex item groupings as composite inventory
- 📈 **Analytics** – Real-time inventory summaries and top-selling items visualization
- 🧠 **AI-based Prediction** – Predict future item demand based on inventory data and budget
- 📤 **Review & Feedback System** – Allow users to submit reviews and feedback
- 📬 **Contact Us & Features Pages** – Informative static pages for users
- 🧑‍💼 **Admin Dashboard** – Full control with exclusive tools for administrators

---

## 🧠 ML-Based Restocking Suggestions

This system includes a feature that predicts the **quantities of items to restock** for the next month using **Linear Regression** based on your existing stock performance and available budget.

## 🚀 Getting Started

### Clone the Repo

```bash
git clone https://github.com/your-username/inventory-management.git
```
📦 Frontend Setup (/frontend)
```bash
cd frontend/inventory_app
npm install
npm start          # Run in dev mode
npm run build      # Create production build
```
Frontend Environment Variables (frontend/.env)

```bash
REACT_APP_BACKEND_URL='https://yourbackend.onrender.com'
```

🔧 Backend Setup (/backend)
```bash
cd backend/backend_app
pip install -r requirements.txt
```

# Backend Environment Variables (.env)

Create a `.env` file with the following:
- `SECRET_KEY=your-django-secret`
- `DEBUG=True`
- `MONGO_DB_NAME=your-db-name`
- `MONGO_DB_URI=your-mongodb-uri`


Run server:
```bash
python manage.py runserver
```

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Open a PR or issue to get started.
