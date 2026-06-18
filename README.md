# SafariConnect - Wildlife Tours Management System

A comprehensive web-based management system for wildlife tour companies to manage bookings, tourists, safari packages, vehicles, accommodations, destinations, guides, and payments.

## Features

- Dashboard with real-time stats (tourists, bookings, revenue, vehicle/accommodation availability)
- Tourist management (CRUD)
- Tour package management
- Vehicle booking & tracking
- Accommodation management
- Destination management
- Booking module with workflow (Pending → Confirmed → Completed/Cancelled)
- Payment processing (Mpesa, Visa, Mastercard, Cash, Bank Transfer)
- Authentication & role-based access (Admin, Guide, Receptionist)

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript (vanilla SPA)

## Prerequisites

- Node.js >= 16
- PostgreSQL >= 12
- npm

## Setup

1. Clone the repo and install dependencies:

```bash
cd safariconnect
npm install
```

2. Create a PostgreSQL database:

```bash
createdb safariconnect
psql -d safariconnect < database/schema.sql
```

3. Configure environment variables in `.env`:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=safariconnect
JWT_SECRET=safariconnect_jwt_secret_2024
JWT_EXPIRES_IN=1d
```

4. Build and seed the database:

```bash
npm run build
npx ts-node src/seed.ts
```

5. Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

6. Open the browser at `http://localhost:3000`

## Default Login

- **Admin:** admin / admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (admin only)

### Tourists
- `GET /api/tourists` - List all
- `GET /api/tourists/:id` - Get by ID
- `POST /api/tourists` - Create
- `PUT /api/tourists/:id` - Update
- `DELETE /api/tourists/:id` - Delete

### Packages / Vehicles / Accommodations / Destinations
- Same CRUD pattern as tourists

### Bookings
- `GET /api/bookings` - List all (with related details)
- `GET /api/bookings/status/:status` - Filter by status
- `POST /api/bookings` - Create
- `PUT /api/bookings/:id` - Update
- `DELETE /api/bookings/:id` - Delete

### Payments
- `GET /api/payments` - List all
- `GET /api/payments/revenue` - Revenue summary
- `POST /api/payments` - Create
- `PUT /api/payments/:id` - Update
- `DELETE /api/payments/:id` - Delete

### Dashboard
- `GET /api/dashboard` - Stats and recent bookings

## Project Structure

```
safariconnect/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # TypeScript interfaces
│   ├── routes/         # Express routes
│   ├── server.ts       # Entry point
│   └── seed.ts         # Database seeder
├── public/             # Frontend assets
│   ├── css/
│   ├── js/
│   └── index.html
├── database/
│   └── schema.sql
├── package.json
├── tsconfig.json
└── .env
```
