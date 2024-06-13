
# Library Management System

This is a basic library management system built using Node.js, Express.js, PostgreSQL, and Sequelize ORM.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
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
Some endpoints are protected to ensure only users of the system (Employees of the library) can use them. To access these endpoints, you need to provide a valid token in the Authorization header of the request. The token can be obtained by logging in as a user. Some endpoints are also protected to ensure only admin users can access them. To access these endpoints, you need to provide a valid token in the Authorization header of the request. The token can be obtained by logging in as an admin user.

### Authors

- **GET /authors**
    - Description: Get all authors
    - Response: An object with data, message and status

- **POST /authors/create**
    - Description: Create a new user.
    - Body:
        ```json
        {
            "firstName":"Duffy",
            "lastName":"Duck"
        }
        ```
    - Response: Created user object
    - Disclaimer: 
        - Can only be carried out by a valid user
        - The user must be an admin user


### Books

- **GET /books**
    - Description: Get all books
    - Response: An object with data, message and status

- **POST /books/create**
    - Description: Create a new book
    - Body:
        ```json
        {
            "title": "Looney Tunes The Sequel 2",
            "authorID": "AU-6295",
            "publishedDate": "1988-01-01",
            "isbn": "9780062315112",
            "quantity":10
        }
        ```
    - Response: An object with data, message and status
    - Disclaimer: 
        - Can only be carried out by a valid user
        - The authorID must be a valid authorID

### Loans
- **GET /loans**
    - Description: Get all Loans
    - Response: An object with data, message and status
- **POST /loans/create**
    - Description: Create a new Loan.
    - Body:
        ```json
        {
            "memberID": "MB-379",
            "bookISBN":"9780062315110"
        }
        ```
    - Response: An object with data, message and status
    - Disclaimer: 
        - Can only be carried out by a valid user
        - The memberID must be a valid memberID
        - The bookISBN must be a valid bookISBN
        - The book must be available

- **PUT /loans/return/**
    - Description: Return a book
    - Body:
        ```json
        {
            "loanID":"LN-978",
            "memberID": "MB-379",
            "bookISBN":"9780062315110"
        }
        ```
    - Response: An object with data, message and status
    - Disclaimer: 
        - Can only be carried out by a valid user
        - The memberID must be a valid memberID
        - The bookISBN must be a valid bookISBN

### Members
- **GET /members**
    - Description: Get all Members
    - Response: An object with data, message and status
- **POST /members/create**
    - Description: Create a new Member
    - Body:
        ```json
        {
            "firstName":"Duffy",
            "lastName":"Duck",
            "email":"duffy@duck.com",
            "phone":"0712345678"
        }
        ```
    - Response: An object with data, message and status
    - Disclaimer: 
        - Can only be carried out by a valid user

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Nodemon](https://nodemon.io/)
