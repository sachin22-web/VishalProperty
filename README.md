# Vishal Properties - MERN Stack Property Management System

A full-stack property management system built with MongoDB, Express, React, and Node.js (MERN).

## Project Structure

```
.
├── client/                 # React frontend (Vite + Tailwind CSS)
├── server/                 # Express backend (Node.js + MongoDB)
├── public/                 # Static assets
└── package.json           # Root package configuration
```

## Prerequisites

- Node.js 16+ or Bun
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- npm or yarn or bun

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (from root or src directory)
cd ../
npm install
```

### 2. Configure Environment Variables

#### Server Setup (.env)

Create `server/.env` file:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:8080

ADMIN_EMAIL=admin@vishalproperties.com
ADMIN_PASSWORD=Admin@12345
```

Get your MongoDB URI from MongoDB Atlas:
1. Create a cluster in MongoDB Atlas
2. Get the connection string from "Connect" button
3. Replace username and password with your database user credentials

#### Client Setup (.env)

Create `.env` file in root:

```env
VITE_API_URL=http://localhost:4000/api
```

### 3. Start the Application

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:4000`

#### Terminal 2 - Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

## Database Models

### User
- `name`: string
- `email`: string (unique)
- `phone`: string (optional)
- `password`: string (hashed with bcrypt)
- `role`: 'admin' | 'user'
- `status`: 'active' | 'blocked'
- `createdAt`: timestamp

### Property
- `title`: string
- `slug`: string (unique)
- `price`: number
- `propertyType`: string
- `status`: 'active' | 'draft' | 'sold'
- `location`: string
- `city`: string (optional)
- `area`: number (optional)
- `bedrooms`: number (optional)
- `bathrooms`: number (optional)
- `features`: string[]
- `description`: string
- `images`: string[]
- `coverImage`: string (optional)
- `premium`: boolean
- `ownerContact`: string
- `createdBy`: ObjectId (ref: User)
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Enquiry
- `name`: string
- `email`: string (optional)
- `phone`: string
- `message`: string
- `propertyId`: ObjectId (ref: Property, optional)
- `status`: 'new' | 'reviewed' | 'closed'
- `createdAt`: timestamp

### Page
- `slug`: string (unique)
- `title`: string
- `content`: string
- `metaTitle`: string (optional)
- `metaDescription`: string (optional)
- `updatedAt`: timestamp

## API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout

### Properties
- `GET /api/properties` - Get all active properties
- `GET /api/properties/:id` - Get property by ID or slug
- `GET /api/properties/city/:city` - Get properties by city
- `GET /api/properties/admin/all` - Get all properties (admin only)
- `POST /api/properties` - Create property (admin only)
- `PUT /api/properties/:id` - Update property (admin only)
- `DELETE /api/properties/:id` - Delete property (admin only)

### Enquiries
- `POST /api/enquiries` - Create enquiry (public)
- `GET /api/enquiries` - Get all enquiries (admin only)
- `GET /api/enquiries/:id` - Get single enquiry (admin only)
- `PATCH /api/enquiries/:id/status` - Update enquiry status (admin only)
- `DELETE /api/enquiries/:id` - Delete enquiry (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PATCH /api/users/:id/status` - Update user status (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Pages
- `GET /api/pages/:slug` - Get page by slug (public)
- `POST /api/pages` - Create page (admin only)
- `PUT /api/pages/:id` - Update page (admin only)
- `DELETE /api/pages/:id` - Delete page (admin only)
- `GET /api/pages/admin/list` - Get all pages (admin only)

## Frontend Routes

### Public Routes
- `/` - Home page
- `/properties` - All properties listing
- `/property/:id` - Property detail
- `/about` - About page
- `/contact` - Contact page
- `/gallery` - Gallery page

### Auth Routes
- `/auth` - User login & signup
- `/admin/login` - Admin login

### Protected Routes (User)
- `/dashboard/*` - User dashboard
- `/auth/logout` - Logout

### Protected Routes (Admin)
- `/admin/*` - Admin dashboard
- `/admin/properties` - Property management
- `/admin/leads` - Enquiry management
- `/admin/users` - User management
- `/admin/settings` - Settings

## Key Features

✅ User authentication with JWT
✅ Admin panel with full property management
✅ Public property listing with filters
✅ Contact form and enquiry management
✅ Responsive design with Tailwind CSS
✅ MongoDB integration with Mongoose
✅ Input validation with Zod
✅ Error handling and status messages
✅ CORS enabled for frontend-backend communication

## Default Admin Credentials

After server starts, use these credentials to login at `/admin/login`:

```
Email: admin@vishalproperties.com
Password: Admin@12345
```

Change these in production!

## Build & Deployment

### Build Frontend

```bash
npm run build
```

Output: `dist/` folder ready for deployment

### Build & Run Server

```bash
cd server
npm run build
npm start
```

## Technologies Used

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Zod (validation)
- Sonner (notifications)
- Lucide icons

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- CORS
- Zod (validation)

## Development Notes

- Always use the API client from `src/services/api.ts` for backend calls
- Authentication token is stored in localStorage as `auth_token`
- All protected routes require valid JWT token in Authorization header
- Admin routes additionally check for admin role
- Environment variables are loaded from `.env` files

## Troubleshooting

**MongoDB Connection Error**
- Verify MongoDB URI in `server/.env`
- Ensure IP whitelist includes your current IP in MongoDB Atlas
- Check username and password are correct

**CORS Error**
- Verify `CORS_ORIGIN` matches your frontend URL in `server/.env`
- Ensure frontend `.env` has correct `VITE_API_URL`

**Port Already in Use**
- Change `PORT` in `server/.env` (default: 4000)
- Change Vite port by running `npm run dev -- --port 3000`

## Support

For issues or questions, please create an issue in the repository.

## License

MIT License - feel free to use this project for your needs.
