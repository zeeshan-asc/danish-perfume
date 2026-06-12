# Fragrance Vault — Perfume Collection Tracker

A full-stack Next.js application for tracking, rating, and analyzing your perfume collection. Built with Next.js 16 (App Router), TypeScript, MongoDB, and JWT authentication.

## Features

- 🔐 **JWT Authentication** — Register, login, and secure cookie-based sessions
- 📦 **CRUD Operations** — Add, edit, view, and delete perfumes in your collection
- 🔍 **Search & Filter** — Full-text search, brand/season/status/price/rating filters
- 📊 **Dashboard Analytics** — Stats, brand distribution, season breakdown, collection growth
- 🖼️ **Image Uploads** — Attach photos to perfumes (stored in MongoDB GridFS)
- 🏷️ **Tags & Notes** — Pyramid notes (top/heart/base), custom tags, personal reviews
- 📱 **Responsive** — Works on desktop and mobile
- 🎨 **Dark Luxury Theme** — Gold-accented dark UI with Georgia serif typography

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Next.js 16 App Router, Tailwind CSS v4 |
| Language | TypeScript (strict mode) |
| Database | MongoDB Atlas (Mongoose ODM + GridFS) |
| Auth | JWT tokens in httpOnly cookies |
| Validation | Zod (client + server) |
| Forms | React Hook Form |
| Icons | Lucide React |

## Prerequisites

- **Node.js** 18+ and **npm** 9+
- **MongoDB Atlas** account (free tier works)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/perfume_tracker?retryWrites=true&w=majority
JWT_SECRET=<minimum-64-char-random-string>
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a database user with read/write permissions
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Click "Connect" → "Drivers" → copy the connection string
5. Replace `<user>`, `<password>`, `<cluster>` in the URI with your values
6. Ensure the database name is `perfume_tracker` (or change it in the URI)

### JWT Secret

Generate a secure random string (at least 64 characters):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The API routes are available at:
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `GET /api/auth/me` — Get current user
- `POST /api/auth/logout` — Sign out
- `GET /api/perfumes` — List perfumes (supports search, filter, sort, paginate)
- `POST /api/perfumes` — Create a perfume
- `GET /api/perfumes/[id]` — Get single perfume
- `PUT /api/perfumes/[id]` — Update a perfume
- `DELETE /api/perfumes/[id]` — Delete a perfume
- `GET /api/images/[id]` — Serve image from GridFS

## Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push your code to a GitHub repo
2. Go to [Vercel](https://vercel.com) → Import Project
3. Add all environment variables from `.env.local` to Vercel project settings
4. Deploy

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (auth)/            # Login & Register pages
│   ├── (dashboard)/       # Protected pages (dashboard, collection, detail)
│   └── api/               # REST API routes
├── components/            # React components
│   ├── ui/                # Primitives (Button, Input, Modal, etc.)
│   ├── layout/            # Navbar, Sidebar
│   ├── auth/              # LoginForm, RegisterForm
│   ├── perfume/           # PerfumeCard, PerfumeGrid, PerfumeForm, etc.
│   ├── dashboard/         # StatCard, BrandChart, CollectionTimeline
│   └── search/            # SearchBar, FilterPanel
├── hooks/                 # Custom hooks (useAuth, usePerfumes, useToast)
├── lib/                   # Utilities (db, auth, gridfs, rate-limit, utils)
├── models/                # Mongoose models (User, Perfume)
├── schemas/               # Zod validation schemas
└── types/                 # TypeScript interfaces
```

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
- All perfume queries scoped to the authenticated user
- Rate limiting on auth endpoints (10 req/15 min per IP)
- Input sanitization (HTML tags stripped, strings trimmed)
- File upload validation (MIME type + size checks)
- Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`

## License

MIT
