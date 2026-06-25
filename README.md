# MANISH TURF

A full-stack turf booking platform that allows users to view pricing, browse the gallery, register/login, and book sports slots online. The project also includes an admin dashboard for managing bookings, reviews, gallery content, and site settings.

## Live Demo

Website: https://turf-project-eight.vercel.app

## Features

### User Features

* User registration and login
* Secure authentication using JWT
* View available turf information
* Online slot booking
* View and manage bookings
* Gallery section
* Pricing section
* Contact form
* Responsive design for desktop and mobile

### Admin Features

* Admin dashboard
* Manage bookings
* Manage users
* Manage reviews
* Manage gallery images
* Update pricing
* Update turf settings dynamically

## Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB
* Mongoose

### Deployment

* Frontend: Vercel
* Backend: Render

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm start
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Project Structure

```text
client/
 ├── src/
 ├── public/
 └── package.json

server/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── config/
 └── server.js
```

## Future Improvements

* Online payment integration
* Email notifications
* Booking reminders
* Real-time slot availability
* Analytics dashboard
* Multiple turf support

## Author

Manish

Built as a full-stack MERN-style project for online turf booking and management.
