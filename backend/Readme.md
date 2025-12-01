# Token Invalidation Backend

This is the backend service for the Token Invalidation application. It is built using Node.js and Express.js to handle API requests, manage authentication, and provide server-side logic for token invalidation.

## Overview

The application is designed to manage and invalidate tokens efficiently, ensuring secure access control for users. It provides RESTful API endpoints for token management and user-related operations.

### Key Features

- **Token Management:** Issue, validate, and invalidate tokens.
- **User Authentication:** Secure user authentication and session handling.
- **Scalable Architecture:** Modular design for easy extension and maintenance.
- **Middleware Integration:** Logging, request parsing, and zod validation.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Connect To postgresql db and import database schema `backend/scripts/backup.sql`

4. Populate your environment variabled in the `.env` based on `.env.example` 

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. The server will run on `http://localhost:3000` by default.

## Project Structure

```
backend/
├── src/
│   ├── feature/                         # API features/context [ auth, dashboard]
│   │   ├── [feature name 1]/            
│   │   │   ├── db/                      # database operations 
│   │   │   ├── middleware/              # feature middlewares, ran before main routes etc.
│   │   │   ├── routes/                  # feature route handlers
│   │   │   ├── services/                # feature specific services/Actions
│   │   │   ├── constants.ts             # constant vars
│   │   │   ├── routes.ts                # central entrypoint for feature
│   │   │   └── types.ts                 # shared datatypes
│   │   └── ...
│   ├── app.ts
│   └── package.json
└── README.md
```

## Scripts

- `npm start`: Start the production server.
- `npm run dev`: Start the development server with hot-reloading.

## License

This project is licensed under the [MIT License](https://mit-license.org/).
