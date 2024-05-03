
  <div align="center">
  <h1 align="center">AgroFrostHub Backend</h1>
  <h3>Codebase for the AgroFrostHub Backend platform</h3>
  <h3>◦ Developed with the software and tools below.</h3>
  <p align="center"><img src="https://img.shields.io/badge/-Express.js-004E89?logo=Express.js&style=flat-square" alt='Express.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Node.js-004E89?logo=Node.js&style=flat-square" alt='Node.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-MongoDB-004E89?logo=MongoDB&style=flat-square" alt='MongoDB\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Mongoose-004E89?logo=Mongoose&style=flat-square" alt='Mongoose\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Nodemailer-004E89?logo=Nodemailer&style=flat-square" alt='Nodemailer\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Razorpay-004E89?logo=Razorpay&style=flat-square" alt='Razorpay"' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" />
  </p>
  </div>
  
  ---
  ## 📚 Table of Contents
  - [📚 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [🌟 Features](#-features)
  - [📁 Repository Structure](#-repository-structure)
  - [💻 Code Summary](#-code-summary)
  - [🚀 Getting Started](#-getting-started)
  
  ---
  
  
  ## 🔍 Overview

 This is a Node.js project with a RESTful API, a React frontend, and a MongoDB database. The project includes a variety of files and directories, including controllers, models, routes, middlewares, and uploads. The project also includes a README file and a package.json file for managing dependencies.

---

## 🌟 Features

 Sure, here is a list of features for the project:<br>
* RESTful API with Node.js and Express.js
* React frontend with create-react-app
* MongoDB database with Mongoose
* Authentication and authorization middleware with Passport.js
* File uploads with Multer
* CRUD operations for various models (Admin, Booking, ColdStorage, ColdStorageOwner, Customer, Otp, Payment)
* Routes for Admin, ColdStorageOwner, and Customer controllers
* Middlewares for authentication and authorization
* Uploads directory for storing uploaded files
* README file for documentation and instructions
* package.json file for managing dependencies

---

## 📁 Repository Structure

```sh
├── .env
├── controller
│   ├── AdminController.js
│   ├── ColdStorageOwnerController.js
│   └── CustomerController.js
├── db
│   └── Connection.js
├── middlewares
│   └── authentication.js
├── model
│   ├── Admin.js
│   ├── Booking.js
│   ├── ColdStorage.js
│   ├── ColdStorageOwner.js
│   ├── Customer.js
│   ├── Otp.js
│   └── Payment.js
├── package-lock.json
├── package.json
├── README.md
├── routes
│   ├── AdminRouter.js
│   ├── ColdstorageOwnerRouter.js
│   └── CustomerRouter.js
├── server.js
└── uploads
    ├── 1712164886337_qr.jpg
    ├── 1712218400390_qr.jpg
    ├── 1712218629751_chatbot.png
    ├── 1712335233684_creditcard.png
    ├── 1712377492594_qr.jpg
    ├── 1712381388078_cold_storage_warehouse.jpg
    ├── 1712423598632_qr.jpg
    ├── 1712423671612_heroimg.jpeg
    ├── 1712423919883_cold_storage_warehouse.jpg
    ├── 1712477018901_qr.jpg
    ├── 1712477135775_cold_storage_warehouse.jpg
    ├── 1712490698308_qr.jpg
    ├── 1712490706660_qr.jpg
    ├── 1712495009926_cold_storage_warehouse.jpg
    └── 1712730859702_heroimg.jpeg

```

---

## 💻 Code Summary

<details><summary>\controller</summary>

| File | Summary |
| ---- | ------- |
| AdminController.js |  This code is a Node.js API server that provides various endpoints for managing admins, bookings, payments, and other data related to a cold storage facility. The primary function of this code is to provide a RESTful API for the frontend application to interact with the database and perform CRUD operations.The code imports several dependencies, including Express.js, JSON Web Tokens (JWT), bcrypt, and Nodemailer. It also defines several middleware functions, such as `authenticateToken`, which is used to authenticate admin requests.The `router` object is used to define the routes for the API. The `/register` route is used to register new admins, while the `/login` route is used to log in existing admins. The `/update` route is used to update admin details, and the `/get` route is used to retrieve admin data by ID.The `/booking/all` route is used to retrieve all bookings, while the `/payment/all` route is used to retrieve all payments. The `/count/all` route is used to retrieve counts of bookings, customers, approved storage units, and total payments.The `/chart/all` route is used to retrieve data for charts, including booking data, payment data, and booking status data. The `/get/notapprove/storage` route is used to retrieve not- |
| ColdStorageOwnerController.js |  This code defines a Node.js API for a cold storage facility management system. It includes routes for registering cold storage owners, creating new cold storage facilities, and managing bookings and payments. The API also includes a forgot password feature, OTP verification, and password reset functionality. Additionally, the API includes routes for generating reports on cold storage usage by month, year, or week. |
| CustomerController.js |  This code is a Node.js application that provides various endpoints for managing customer registrations, bookings, and payments for cold storage facilities. It uses Express.js as the web framework, MongoDB as the database, and Nodemailer for sending emails. The code also includes a middleware function for authentication and authorization.The primary function of this code is to provide a RESTful API for managing customer registrations, bookings, and payments for cold storage facilities. It allows customers to register themselves, view their bookings, and make payments for the bookings they have made. The code also includes a feature for generating invoices and sending them to customers via email.The code also includes a feature for checking the capacity of a cold storage facility for a given date range and cs_id. It also includes a feature for checking the capacity of a cold storage facility for the current date and cs_id.The code also includes a feature for generating weekly and monthly reports with mandatory c_id filter.The code also includes a feature for forgot password, verify otp, change password.The code also includes a feature for sending emails. |

</details>

---

<details><summary>\db</summary>

| File | Summary |
| ---- | ------- |
| Connection.js |  The code establishes a connection to a MongoDB database using the mongoose library, with the primary function of connecting to the database and logging a success message if successful. |

</details>

---

<details><summary>\middlewares</summary>

| File | Summary |
| ---- | ------- |
| authentication.js |  The code defines a function called authenticateToken that verifies a JSON Web Token (JWT) and extracts the user information from it, returning an error response if the token is invalid or expired. |

</details>

---

<details><summary>\model</summary>

| File | Summary |
| ---- | ------- |
| Admin.js |  The code defines a MongoDB schema for an Admin model, with fields for an ID, full name, email, contact number, address, and password, as well as a role field with a default value of admin |
| Booking.js |  The code defines a Booking model in MongoDB using Mongoose, with fields for booking ID, customer ID, check-in and check-out dates, goods quantity, and status. |
| ColdStorage.js |  The code defines a schema for a Cold Storage model in MongoDB, including fields for owner ID, name, image, area, capacity, address, price, time, and status, as well as a reference to the owner model. |
| ColdStorageOwner.js |  The code defines a schema and model for a Cold Storage Owner in MongoDB, using the mongoose library, with fields for owner ID, full name, email, contact number, QR code, password, and role. |
| Customer.js |  The code defines a MongoDB schema for a Customer model, with fields for customer ID, full name, email, contact number, address, password, and role. |
| Otp.js |  The code defines a Mongoose schema for an OTP (One-Time Password) model, with fields for email, otp, expiration date, and verification status. |
| Payment.js |  The code defines a Payment model in MongoDB using Mongoose, with fields for payment ID, business ID, date, amount, customer service ID, and customer ID. |

</details>

---

<details><summary>\routes</summary>

| File | Summary |
| ---- | ------- |
| AdminRouter.js |  The code defines an Express.js router that routes requests to the AdminController when the URL path starts with admin |
| ColdstorageOwnerRouter.js |  The code defines an Express.js router that uses the ColdStorageOwnerController to handle requests for the owner endpoint. |
| CustomerRouter.js |  The code defines an Express.js router that uses the CustomerController to handle requests for the user route. |

</details>

---

<details><summary>Root</summary>

| File | Summary |
| ---- | ------- |
| server.js |  The code defines an Express.js server that listens on port 3000 and serves as a RESTful API for a cold storage management system, with routes defined for cold storage owners, customers, and administrators. |

</details>

---

## 🚀 Getting Started

 To get started with this project, follow these steps:<br>
1. Install the necessary dependencies by running `npm install` in your terminal.
2. Create a `.env` file in the root directory of the project and add the necessary environment variables for your application.
3. Start the server by running `npm start` in your terminal.
4. Open your web browser and navigate to `http://localhost:3000` to access the API documentation.
5. Use the API endpoints to interact with the database and perform CRUD operations on the data.
6. To test the API, you can use tools like Postman or cURL.
7. To deploy the application to a production environment, you will need to set up a production-ready server and configure the necessary settings.

Note: This is a basic getting started guide, and there may be additional steps required depending on the specific requirements of your project.

---

Generated with ❤️ by [ReadMeAI](https://www.readmeai.co/).
