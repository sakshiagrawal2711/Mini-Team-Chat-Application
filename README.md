# Mini Team Chat Application

A real-time team chat application built with the MERN stack (switched to SQLite for local ease of use).

## Features
- **Real-time Messaging**: Instant message delivery using Socket.io.
- **Channels**: Create and join channels.
- **User Authentication**: Secure signup and login with JWT.
- **Presence**: See who is online in real-time.
- **Message History**: Persistent message storage with pagination.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Socket.io Client
- **Backend**: Node.js, Express, Socket.io, Sequelize, SQLite

## Setup Instructions

1.  **Clone the repository** (if applicable).
2.  **Install Dependencies**:
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```
3.  **Start the Server**:
    ```bash
    cd server
    npm run dev
    ```
    The server will run on `http://localhost:5000`.
4.  **Start the Client**:
    ```bash
    cd client
    npm run dev
    ```
    The client will run on `http://localhost:5173` (or similar).

## Design Decisions
- **SQLite**: Used SQLite instead of MongoDB for this assignment to ensure it runs locally without requiring a MongoDB installation. The code uses Sequelize ORM, making it easy to switch to PostgreSQL or MySQL.
- **Socket.io**: Used for real-time events (messages, presence).
- **Tailwind CSS**: Used for rapid and clean UI development.

## Optional Features Implemented
- **Typing Indicators**: (Not fully implemented in this version, but architecture supports it)
- **Online Status**: Fully implemented.
