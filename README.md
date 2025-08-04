# 🌐 Ciaan Assignment – Full-Stack Social Media App

This is a LinkedIn-like social media application built as part of an assignment. Users can post content (text and images), like, comment, repost, connect with other users, view profiles, and more.

## 🔗 Live Demo

👉 [Visit Live Site](https://ciaan-assignment-kapil.netlify.app/)

## 📁 GitHub Repository

👉 [GitHub Repo](https://github.com/yadavKapil99/Ciaan-Assignment.git)

---

## 🚀 Features Implemented

- ✅ Create Posts (Text, Images, or Both)
- ✅ Delete Your Posts
- ✅ Like, Comment, and Repost Others’ Posts
- ✅ View and Visit Full Profiles of Other Users
- ✅ Send and Accept Connection Requests
- ✅ Search Users by Name and Connect with Them
- ✅ Responsive UI using Tailwind CSS
- ✅ Persistent Login with Cookies

---

## 🧪 Demo User Credentials

- **Email:** `kapilkhairwal1503@gmail.com`  
- **Password:** `123456`

---

## 🛠️ Tech Stack

### 🔧 Frontend
- React.js
- Redux Toolkit
- React Router
- Tailwind CSS

### 🔧 Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cloudinary (for image uploads)
- JWT (Authentication)

---

## ⚙️ Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yadavKapil99/Ciaan-Assignment.git
   cd Ciaan-Assignment
   ```

2. **Install dependencies**

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file inside the `server` folder with the following:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Run the app**

   ```bash
   cd client
   npm run dev

   cd ../server
   npm run dev
   ```

   The app should now be running on:

   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000`

---


## 📄 License

This project is for demonstration purposes only. Not intended for production use.
