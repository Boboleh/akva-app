# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Akva is a monorepo e-commerce application with:
- **Client**: Nuxt.js 2 (Vue 2) frontend at `client/`
- **Server**: NestJS 11 backend at `server/`
- **Database**: MongoDB with Mongoose

## Development Commands

### Server (NestJS)
```bash
cd server
npm install
npm run start:dev        # Development with hot reload (http://localhost:3000)
npm run build            # Build for production
npm run start:prod       # Run production build
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run e2e tests
npm run test:cov         # Run tests with coverage
npm run lint             # Lint and fix
npm run format           # Format with Prettier
```

### Client (Nuxt.js)
```bash
cd client
npm install
npm run dev              # Development with hot reload (http://localhost:3001)
npm run build            # Build for production
npm run start            # Run production build
npm run generate         # Generate static site
```

## Architecture

### Server Module Structure

The server uses NestJS modular architecture. Each module is in `server/src/`:

- **auth/** - JWT authentication with Passport.js (register, login, refresh tokens, password reset, email verification)
- **user/** - User CRUD operations and password hashing
- **product/** - Product management with nested image/characteristics arrays
- **review/** - Product reviews linked by productId
- **main-page/** - CMS-like page content (slider, about, categories, etc.)
- **email/** - Nodemailer SMTP service for verification/reset emails
- **schemas/** - Mongoose schemas for all entities
- **common/filters/** - Global exception filter
- **common/interceptors/** - Request logging interceptor
- **decorators/** - Custom decorators including @UserRole for extracting JWT user

### Authentication Flow

1. JWT tokens with access + refresh token pattern
2. Token blacklist for logout (in-memory, not persisted)
3. Guards in `auth/guards/` protect routes, check blacklist
4. Strategy in `auth/strategies/` validates JWT from Authorization header
5. `@UserRole()` decorator extracts authenticated user in controllers

### Client Structure

- **pages/** - Nuxt auto-routes (`/` = index.vue, `/Card/:id` = Card/index.vue)
- **store/** - Vuex modules (product.ts, page.ts) for state management
- **components/** - Reusable Vue components (NavBar, Slider, Gallery, Card)
- **plugins/axios.js** - Configured Axios instance with base URL and error handling

### API Communication

- Client calls server via Axios to `http://localhost:3000/api/`
- All server routes prefixed with `/api`
- Swagger docs available at `/api/docs`

## Key Schemas

**User**: username, email, password (hashed), role (AdminUser|user), emailVerified, verification/reset tokens

**Product**: image[], name, subtitle, price, oldPrice, description, category[], tags, fulfillmentTime, characteristics[]

**Review**: name, title, description, rating, productId (reference)

**Page**: name, about, category[], slider[], bestseller[], workFeatures[], info, whatNew[], fulfillmentProcedure[]

## Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/akva-app
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXP=7d
PORT=3000
FRONTEND_URL=http://localhost:3001
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

### Client (.env)
```
HOST=localhost
PORT=3001
BASE_URL=http://localhost:3000/
```

## Database Seeding

Initialize the database with sample data:

```bash
cd server
npm run seed                    # Seed database with initial data
```

This creates:
- Admin user: `admin@akva.com` / `Admin123!`
- Regular user: `user@akva.com` / `User123!`
- 8 sample products (aquarium equipment)
- Main page content
- Sample reviews

Seed files are in `server/src/seed/`.

## Testing

Server tests use Jest. Test files follow `*.spec.ts` pattern in `server/src/`.

```bash
cd server
npm run test                    # All unit tests
npm run test -- --testPathPattern=auth  # Tests matching "auth"
npm run test:e2e                # E2E tests in server/test/
```
