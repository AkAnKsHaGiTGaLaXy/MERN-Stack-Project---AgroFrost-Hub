
  <div align="center">
  <h1 align="center">AgroFrostHub Frontend</h1>
  <h3>Codebase for the AgroFrostHub Frontend platform</h3>
  <h3>◦ Developed with the software and tools below.</h3>
  <p align="center"><img src="https://img.shields.io/badge/-React-004E89?logo=React&style=flat-square" alt='React\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Vite-004E89?logo=Vite&style=flat-square" alt='Vite\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Tailwind%20CSS-004E89?logo=Tailwind%20CSS&style=flat-square" alt='Tailwind CSS\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-PostCSS-004E89?logo=PostCSS&style=flat-square" alt='PostCSS\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-ESLint-004E89?logo=ESLint&style=flat-square" alt='ESLint\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-HTML%20to%20Image-004E89?logo=HTML%20to%20Image&style=flat-square" alt='HTML-to-Image"' />
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

 This is a React project with a complex file structure, including multiple components, pages, and features. The project uses Tailwind CSS for styling and Vite for building and development. The main entry point is the `main.jsx` file, which imports the `App.jsx` component and renders it to the DOM. The `App.jsx` component is the root component of the application and contains the navigation bar, footer, and other global elements. The `components` directory contains all the reusable components used throughout the application, such as the `HeroSection`, `FeatureSection`, and `Footer`. The `pages` directory contains the individual pages of the application, such as the `Home` page and the `Login` page. The `guards` directory contains the authentication guards used to protect certain routes. The `src/index.css` file contains the global styles for the application, while the `tailwind.config.js` file contains the configuration for Tailwind CSS.

---

## 🌟 Features

 Here is a list of features of the project, based on the file structure and content:<br>
* Authentication (login, registration, guard)
* Navigation bar
* Footer
* Global styles (Tailwind CSS)
* Reusable components (HeroSection, FeatureSection, Footer)
* Individual pages (Home, Login)
* Dashboard with multiple views (admin, owner, user)
* Booking, overview, payment, profile, and storage management for each role
* All reports page for each role
* Modal for owner profile
* Report details card

Note that this is not an exhaustive list, and there may be additional features or functionality not listed here.

---

## 📁 Repository Structure

```sh
├── .env
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── components
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── CsDetails.jsx
│   │   ├── dashboard
│   │   │   ├── admin
│   │   │   │   ├── AdminBooking.jsx
│   │   │   │   ├── AdminDatabase.jsx
│   │   │   │   ├── AdminOverView.jsx
│   │   │   │   ├── AdminPayment.jsx
│   │   │   │   ├── AdminProfile.jsx
│   │   │   │   ├── AdminStorage.jsx
│   │   │   │   ├── AllReports.jsx
│   │   │   │   └── OwnerProfileModal.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── owner
│   │   │   │   ├── AllReportOwner.jsx
│   │   │   │   ├── OwnerBooking.jsx
│   │   │   │   ├── OwnerOverview.jsx
│   │   │   │   ├── OwnerPayment.jsx
│   │   │   │   └── OwnerProfile.jsx
│   │   │   ├── SidebarDashboard.jsx
│   │   │   └── user
│   │   │       ├── UserAllReports.jsx
│   │   │       ├── UserBooking.jsx
│   │   │       ├── UserOverView.jsx
│   │   │       ├── UserPayment.jsx
│   │   │       └── UserProfile.jsx
│   │   ├── FeatureSection.jsx
│   │   ├── Footer.jsx
│   │   ├── guards
│   │   │   └── AuthGuard.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── LoginForms
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── CustomerLogin.jsx
│   │   │   └── OwnerLogin.jsx
│   │   ├── Navbar.jsx
│   │   ├── Register.jsx
│   │   ├── RegisterForms
│   │   │   ├── CustomerRegistration.jsx
│   │   │   └── OwnerRegistration.jsx
│   │   └── StorageDetailsCard.jsx
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
└── vite.config.js

```

---

## 💻 Code Summary

<details><summary>Root</summary>

| File | Summary |
| ---- | ------- |
| postcss.config.js |  The code defines a JavaScript object with a `plugins` property that contains two plugins: `tailwindcss` and `autoprefixer`. |
| tailwind.config.js |  The code defines a Tailwind CSS configuration file that specifies the content to be processed, the theme colors, and the plugins to be used. |
| vite.config.js |  The code defines a Vite configuration file that imports the React plugin, sets up environment variables for the project, and defines a custom define function to stringify environment variables. |

</details>

---

<details><summary>\src</summary>

| File | Summary |
| ---- | ------- |
| App.jsx |  The code defines a React application that uses the `react-router-dom` library to manage client-side routing. It includes several routes for different pages, including a home page, a login page, a register page, and a dashboard page with various sub-routes for user profiles, bookings, payments, and overviews. The code also includes a guard component called `AuthGuard` that checks the user's role before rendering certain components. |
| main.jsx |  The code creates a React application by rendering the App component in the root element of the HTML document. |

</details>

---

<details><summary>\src\components</summary>

| File | Summary |
| ---- | ------- |
| About.jsx |  The code defines a React component called About that renders an about section with a left and right content column, featuring an image and two paragraphs of text. |
| Contact.jsx |  The code is a React component that renders a form for users to send an email to the website's administrator. It uses the `axios` library to make a POST request to the server with the form data, and displays a success or error message using the `react-toastify` library. |
| CsDetails.jsx |  The code is a React component that displays details of a storage facility, including its name, image, area, capacity, timings, and price. It also includes a booking modal that allows users to book the storage facility for a specific period of time. The component fetches data from an API endpoint using axios and uses the react-toastify library to display toast messages. |
| FeatureSection.jsx |  The code defines a React component called FeatureSection that renders a section with a grid of three features, each featuring an image, title, and description. |
| Footer.jsx |  The code defines a React component called Footer that renders a footer element with a red background, containing links to the About Us, Contact Us, and Privacy Policy pages. |
| HeroSection.jsx |  The code defines a React component called HeroSection that renders a hero section with a title, description, and image. |
| Home.jsx |  The code defines a React component named `Home` that renders a series of other components, including a hero section, storage details card, feature section, about section, and contact section. |
| Layout.jsx |  The code defines a React component called Layout that renders a Navbar, its child components, and a Footer. |
| Login.jsx |  The code defines a React component called LoginTabs that displays three login forms (Customer, Owner, and Admin) in separate tabs. The active tab is determined by the activeTab state variable, which is set to customer by default. The component also includes an image on desktop screens but not on mobile. |
| Navbar.jsx |  The code defines a React component that renders a navigation bar with a logo, links to different pages, and a dropdown menu for mobile devices. It also includes a sidebar for mobile devices that displays the same links as the dropdown menu. |
| Register.jsx |  The code defines a React component called Register that renders two registration forms, one for customers and one for owners, using the `useState` hook to manage the active tab. |
| StorageDetailsCard.jsx |  The code defines a React component called `StorageDetailsCard` that displays a list of storage units, including their name, address, price, and booking button. The component uses the `useState` hook to manage state variables such as the search term, sort order, and filtered and sorted data. It also uses the `axios` library to fetch data from an API endpoint and the `react-toastify` library to display error messages. The component has a filter input, a toggle button for sorting, and a search bar to filter the storage units by name or address. |

</details>

---

<details><summary>\src\components\dashboard\admin</summary>

| File | Summary |
| ---- | ------- |
| AdminBooking.jsx |  The code is a React component that displays a list of bookings for an admin user, allowing them to filter the bookings by various criteria such as booking ID, customer ID, CS ID, check-in and check-out dates, and booking status. The component also includes a button to send an invoice to the customer for each booking. |
| AdminDatabase.jsx |  The code fetches customer and owner data from an API endpoint, displays it in a table, and allows the user to search for specific data using a filter input. |
| AdminOverView.jsx |  The code is a React component that renders a dashboard for an admin user, displaying various charts and statistics related to the platform's usage. It fetches data from an API endpoint using axios, and then uses Chart.js to render the charts. The component also includes a ToastContainer for displaying error messages. |
| AdminPayment.jsx |  The code is a React component that displays a list of payments, allowing the user to filter the list by various criteria such as payment ID, booking ID, CS ID, customer ID, and payment date. The component fetches the payment data from an API endpoint using Axios, and then filters the data based on the user's input. The component also uses React-Toastify to display error messages if there are any issues with the API request or response. |
| AdminProfile.jsx |  The code is a React component that displays a form for an admin user to edit their profile information. It fetches the user's data from an API endpoint, and allows them to update their personal information, including their full name, email, contact number, address, and account type. The form also includes a Save button that submits the updated information to the API endpoint when clicked. |
| AdminStorage.jsx |  The code is a React component that displays a list of storage units for an admin to approve or disapprove. It fetches data from an API endpoint and displays it in a grid layout, with buttons to approve or disapprove each storage unit. The component also includes a modal for viewing the profile of the owner of the storage unit. |
| AllReports.jsx |  The code is a React component that displays reports data for a given time period (weekly, monthly, or yearly) and allows the user to filter the data by Cold Storage ID. It also provides a button to download the reports data as a PDF file. |
| OwnerProfileModal.jsx |  The code defines a React component called OwnerProfileModal that displays an owner's profile information in a modal window. |

</details>

---

<details><summary>\src\components\dashboard</summary>

| File | Summary |
| ---- | ------- |
| Dashboard.jsx |  The code defines a React component called Dashboard that renders a sidebar and a main content area, using the `Outlet` component from react-router-dom to render the current route. |
| SidebarDashboard.jsx |  The code defines a React component that renders a sidebar for the dashboard of a web application. It uses various libraries and frameworks such as React, React-Toastify, and React-Router-Dom to handle user authentication, fetch data from an API, and navigate between different pages. The component also includes a profile section with information about the current user, as well as links to other pages in the dashboard. |

</details>

---

<details><summary>\src\components\dashboard\owner</summary>

| File | Summary |
| ---- | ------- |
| AllReportOwner.jsx |  The code is a React component that displays reports for an owner of a cold storage facility. It fetches data from an API and displays it in various charts, tables, and graphs. The component also allows the user to generate reports in PDF format. |
| OwnerBooking.jsx |  The code in the provided snippet is a React component that displays a list of bookings for an owner, allowing them to filter and sort the bookings based on various criteria. It also includes functionality to send invoices to customers and mark bookings as visited. |
| OwnerOverview.jsx |  The code in the provided snippet is a React component that displays various charts and data related to a user's cold storage profile, including booking count, payment data, and booking status. The component fetches data from an API endpoint using Axios and uses Chart.js to render the charts. It also includes a ToastContainer for displaying error messages. |
| OwnerPayment.jsx |  The code in the provided snippet is a React component that displays a list of payments, allowing the user to filter the data based on various criteria such as payment ID, booking ID, customer ID, and payment date. The component fetches the payment data from an API endpoint using Axios, and then filters the data based on the user's input. The filtered data is then displayed in a grid layout, with each payment represented by a card-like element. |
| OwnerProfile.jsx |  The code in the provided snippet is a React component that renders a profile page for an owner, allowing them to view and edit their personal information and storage details. It uses the `axios` library to make API requests to a backend server, and the `react-toastify` library to display toast messages. The component fetches data from the backend using the `fetchProfile` and `fetchColdStorageProfile` functions, and updates the state with the received data. It also handles input changes, saves data to the backend, and displays toast messages upon success or error. |

</details>

---

<details><summary>\src\components\dashboard\user</summary>

| File | Summary |
| ---- | ------- |
| UserAllReports.jsx |  The code in the provided snippet is a React component that displays various reports related to a user's bookings and payments. It fetches data from an API endpoint, processes it, and renders charts, tables, and other visualizations to display the data. The component also includes a button to download the reports as a PDF file. |
| UserBooking.jsx |  The code in the provided snippet is a React component that displays a list of bookings for a user, along with filters to search and sort the bookings. It also includes functionality to send an invoice and cancel a booking. |
| UserOverView.jsx |  The code is a React component that displays various charts and data related to a user's bookings and payments, as well as a list of all the user's reports. |
| UserPayment.jsx |  The code fetches payment data from an API endpoint using Axios, sorts the data by status, and displays it in a table with filters for each column. |
| UserProfile.jsx |  The code in the provided snippet is a React component that displays a user's profile information, including their name, email, contact number, and address. The component fetches the user's data from an API endpoint using Axios, and then updates the form fields with the retrieved data. The user can then edit the form fields and save the changes by clicking on a Save button. The component also uses React-Toastify to display success or error messages when the user saves their profile. |

</details>

---

<details><summary>\src\components\guards</summary>

| File | Summary |
| ---- | ------- |
| AuthGuard.jsx |  The code defines a React component called `AuthGuard` that checks if the user is logged in and has the required role to access a protected route. If the user is not logged in or does not have the required role, it redirects them to the login page. |

</details>

---

<details><summary>\src\components\LoginForms</summary>

| File | Summary |
| ---- | ------- |
| AdminLogin.jsx |  The code is a React component that renders a login form for an admin user, with the ability to reset the password using an OTP (One-Time Password) system. |
| CustomerLogin.jsx |  The code is a React component that renders a login form for customers, with the ability to reset passwords and verify OTPs. |
| OwnerLogin.jsx |  The code is a React component that renders a login form for an owner, with the ability to reset the password using an OTP (One-Time Password) system. |

</details>

---

<details><summary>\src\components\RegisterForms</summary>

| File | Summary |
| ---- | ------- |
| CustomerRegistration.jsx |  The code is a React component that renders a form for customer registration, with input fields for full name, email, contact number, address, password, and confirm password. The form submits to an API endpoint using Axios, and displays a success or error message using React Toastify. |
| OwnerRegistration.jsx |  The code defines a React component for owner registration, which includes a form with input fields for full name, email, contact number, QR code, password, and confirm password. The form submits to an API endpoint using Axios, and displays a success or error message using Toastify. |

</details>

---

## 🚀 Getting Started

 To get started with this React project, follow these steps:<br>
1. Install the dependencies by running `npm install` or `yarn install` in your terminal.
2. Start the development server by running `npm run dev` or `yarn dev`. This will start the Vite development server and open a new browser window with the application running.
3. Open the `src/App.jsx` file in your code editor and explore the code. This is the main entry point of the application and contains the navigation bar, footer, and other global elements.
4. The `components` directory contains all the reusable components used throughout the application. Explore the different components and understand how they are used.
5. The `pages` directory contains the individual pages of the application. Explore the different pages and understand how they are structured.
6. The `guards` directory contains the authentication guards used to protect certain routes. Understand how the guards work and how they are used in the application.
7. The `src/index.css` file contains the global styles for the application. Explore the different styles and understand how they are applied.
8. The `tailwind.config.js` file contains the configuration for Tailwind CSS. Understand how the configuration works and how it affects the application's styling.
9. Once you have explored the code

---

Generated with ❤️ by [ReadMeAI](https://www.readmeai.co/).
