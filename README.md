# Todo Lists

This is a toy application to manage todo lists for a user.

## Pre-requistes

### PNPM

This project uses pnpm as a package manager

Install using npm

```
npm install -g pnpm
```

Install using Homebrew

```
brew install pnpm
```

### Database

This application uses postgresql:

Dev config can be found at: backend/src/typeorm.config.ts

Test config can be found at: backend/src/typeorm.config.test.ts

### Setup

Install frontend:

```
cd frontend && pnpm install
```

Install backend:

```
cd backend && pnpm install
```

### Running dev servers

For running the frontend, use:
```
pnpm start
```

For running the backend, use:
```
pnpm start:dev
```

The application runs on: [http://localhost:4200](http://localhost:4200)


### Unit Tests

Run unit tests on the frontend
```
pnpm test
```

Run unit tests on the backend
```
pnpm jest
```