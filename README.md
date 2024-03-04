# Todo Lists

This is a toy application to manage todo lists for a user.

## Pre-requistes

### PNPM

This project uses pnpm as a package manager

Install using npm

```bash
npm install -g pnpm
```

Install using Homebrew

```bash
brew install pnpm
```

### Database

This application uses postgresql:

Dev config can be found at: backend/src/typeorm.config.ts

Test config can be found at: backend/src/typeorm.config.test.ts

### Setup

Install frontend:

```bash
cd frontend && pnpm install
```

Install backend:

```bash
cd backend && pnpm install
```

### Running dev servers

For running the frontend, use:
```bash
pnpm start
```

For running the backend, use:
```bash
pnpm start:dev
```

The application runs on: [http://localhost:4200](http://localhost:4200)

### Creating users

User can be created using the following curl

```bash
curl --location 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "username": "admin",
    "password": "admin"
}'
```

### Unit Tests

Run unit tests on the frontend
```bash
pnpm test
```

Run unit tests on the backend
```bash
pnpm jest
```