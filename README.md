# Perfect Mens Wear — Premium Clothing CMS

A full-stack MERN (MongoDB, Express, React, Node.js) platform designed for a premium clothing store. Features a dynamic, admin-managed CMS to control products, categories, gallery collections, and store-wide settings including separate contact and WhatsApp configurations.

## 🚀 Key Features

- **Dynamic CMS:** Full control over products, categories, and gallery entries.
- **Admin Dashboard:** Secure dashboard for managing orders, site settings, and content.
- **WhatsApp Integration:** Dynamic WhatsApp enquiry links site-wide, synchronized with admin settings.
- **Premium Design:** Modern, responsive UI with a focus on high-end fashion aesthetics.
- **Look Book / Gallery:** Visual collections to showcase seasonal trends and new arrivals.
- **Settings Management:** Easy-to-use interface to update store name, logo, address, and contact info (E-mail, Phone, WhatsApp).
- **SEO Optimized:** Dynamic meta tags and titles for all pages to help with search engine visibility.

## 💻 Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Vanilla CSS for custom themes)
- **Icons:** Lucide React
- **Notifications:** React Toastify
- **State/Routing:** React Router DOM (v6)
- **Charts:** Recharts (for admin analytics)

### Backend
- **Platform:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **File Uploads:** Multer with Cloudinary integration
- **Security:** Helmet, CORS, and Express Rate Limit
- **Logger:** Morgan (for request logging)

## 📁 Project Structure

```bash
├── backend/
│   ├── config/      # Database & Cloudinary config
│   ├── controllers/ # API logic
│   ├── middleware/  # Auth & error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   └── server.js    # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global state (Cart, Auth, etc.)
    │   ├── layouts/    # Page wrappers (Navbar/Footer)
    │   ├── pages/      # View components
    │   └── api.js      # Axios instance
    └── vite.config.js
```

## 🛠️ Setup and Installation

### Backend
1. Go to the `backend` directory.
2. Create a `.env` file based on `.env.example`.
3. Add your `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY_*` credentials.
4. Run `npm install` and then `npm run dev` to start the server.

### Frontend
1. Go to the `frontend` directory.
2. Run `npm install`.
3. Run `npm run dev` to start the development server.
4. Access the site at `http://localhost:3000`.

## 🛡️ License

This project is licensed for personal use for **Perfect Mens Wear**.
