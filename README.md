# Invoice Management Dashboard

A full-stack invoice management dashboard built using React.js, Node.js, Express, MongoDB, and Mongoose.

## Repository Link

GitHub Repository:
https://github.com/abhishekjmd/Invoice-management

---

# Tech Stack

## Frontend

* React.js
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

---

# Features

## Backend Features

* Invoice CRUD APIs
* Pagination
* Sorting by amount and due date
* Filtering by:

  * status
  * customer
  * issue date range
  * due date range
* MongoDB aggregation APIs for analytics
* Seed script for loading invoice records

## Frontend Features

* Invoice dashboard UI
* Summary analytics cards
* Invoice table
* Pagination
* Sorting
* Filters
* Reusable React components

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/abhishekjmd/Invoice-management.git
```

---

# Frontend Setup

## Navigate to Client Folder

```bash
cd client
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

The frontend application will start locally.

---

# Backend Setup

## Navigate to Server Folder

```bash
cd server
```

## Install Dependencies

```bash
npm install
```

## Create .env File

Create a `.env` file inside the `server` folder and add:

```env
MONGO_URL=your_mongodb_connection_url
PORT=5000
```

Paste your MongoDB connection URL inside `MONGO_URL`.

---

## Run Backend Server

```bash
npm run dev
```

The backend server will start locally and the application will work properly without any additional setup.

---

# Seed Script

To load the provided invoice dataset into MongoDB:

```bash
node seed.js
```

This script:

* reads the seed JSON file
* creates companies
* creates customers
* creates invoices
* maintains relationships between collections

---

# Data Modeling Rationale

The application uses three main models:

## Company

Represents a company entity.

## Customer

Each customer belongs to exactly one company.

A separate customer model was created to:

* avoid repeating customer data across invoices
* maintain normalized relationships
* allow efficient querying

## Invoice

Invoices are linked to customers using MongoDB ObjectId references.

This structure:

* avoids data duplication
* improves scalability
* enables nested population
* supports aggregation queries efficiently

Relationships:

* One Company → Many Customers
* One Customer → Many Invoices

---

# Analytics Implemented

Using MongoDB aggregation pipelines:

* Total billed amount
* Total tax
* Total invoices
* Total customers
* Top customer by invoice value

---

# Assumptions

* One customer belongs to exactly one company.
* Invoice totals and tax values are already provided in the dataset.
* MongoDB ObjectId references are used between collections.
* Filtering, sorting, and pagination are implemented server-side.
* The seed script can be rerun safely because old data is cleared before seeding.
