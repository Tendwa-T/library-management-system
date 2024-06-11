
# Library Management System

This is a basic library management system built using Node.js, Express.js, PostgreSQL, and Sequelize ORM.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm installed on your machine
- PostgreSQL installed and running on your machine

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Tendwa-T/library-management-system.git
    ```

2. Navigate to the project directory:
    ```bash
    cd library-management-system
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

## Database Setup

1. Create a PostgreSQL database:
    ```sql
    CREATE DATABASE library_management;
    ```

2. Update the database configuration in `config/database.js` with your PostgreSQL credentials:
    ```js
    const { Sequelize } = require('sequelize');

    const sequelize = new Sequelize('library_management', 'your_username', 'your_password', {
      host: '127.0.0.1',
      dialect: 'postgres'
    });

    module.exports = sequelize;
    ```

## Running the Project

To start the development server, run:
```bash
npm run dev
```

The server will start on port 3000 by default.

## API Endpoints

### Users

- **GET /users**
    - Description: Get all users
    - Response: Array of user objects

- **POST /users**
    - Description: Create a new user
    - Body:
        ```json
        {
          "name": "User Name",
          "email": "user@example.com"
        }
        ```
    - Response: Created user object

### Books

- **GET /books**
    - Description: Get all books
    - Response: Array of book objects

- **POST /books**
    - Description: Create a new book
    - Body:
        ```json
        {
          "title": "Book Title",
          "author": "Author Name",
          "genre": "Genre",
          "year": 2024,
          "userId": 1
        }
        ```
    - Response: Created book object

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Nodemon](https://nodemon.io/)
