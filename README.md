# SwapItUp College Marketplace

A web-based platform designed to facilitate buying, selling, and finding products within a college community. The platform aims to create a simple and intuitive experience for students to trade or find lost items.

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
---

## Features

- **User Authentication:** Secure login and signup with password encryption using `bcrypt` and session management via `express-session`.
- **Item Listings:** Sell or create an Item, Report a Lost Item, Request for an Item with details like images, title, description, prices and many more
- **Search & filter Functionality:** Search any type of item based on category, price range, newest, oldest, price value, etc.
- **Transaction Status and Delete Items:** Mark personally listed items as sold, found, not found, needed, etc and Delete items
- **Responsive Design:** A user-friendly interface optimized for both desktop and mobile devices.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS for server-side rendering
- **Database:** MongoDB
- **Styling:** Tailwind CSS
- **Authentication:** Passport.js with JSON Web Tokens (JWT) & Bcrypt
- **File Uploads:** Multer
- **Utilities:** Connect-flash, dayjs

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (>= 16.x)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Environment Variables

**Please add .env file with this variables**

**Server Configuration**
- PORT=3000
- HOST=127.0.0.1

**Database Configuration**
- DB_HOST=localhost
- DB_PORT=27017

**Authentication**
- JWT_SECRET=your_jwt_secret_key
- SESSION_SECRET=your_session_secret_key

**App Configurations**
- NODE_ENV=development
- BASE_URL=http://localhost:3000
