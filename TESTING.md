# Testing Guide - Vishal Properties

## Admin Credentials

After running the seed script, use these credentials to login at `/admin/login`:

```
Email: admin@vishalproperties.com
Password: Admin@12345
```

## Regular User Credentials

Use these to signup/login at `/auth`:

```
Email: user@example.com
Password: User@12345
```

## Setup & Testing Steps

### 1. Install Dependencies (if not done)

```bash
# Server dependencies
cd server
npm install

# Client dependencies (from root)
cd ../
npm install
```

### 2. Start the Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:4000`

### 3. Seed the Database

In a **new terminal**, from the `server/` directory:

```bash
npm run seed
```

You should see output like:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created admin user: admin@vishalproperties.com
✓ Created regular user: user@example.com
✓ Created 5 properties
✓ Created 2 enquiries
✓ Created 2 pages

==================================================
ADMIN CREDENTIALS:
==================================================
Email: admin@vishalproperties.com
Password: Admin@12345
==================================================
```

### 4. Start the Frontend

In another **new terminal**:

```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

### 5. Test the Application

#### Admin Panel Tests:
- Go to `http://localhost:8080/admin/login`
- Login with admin credentials
- View/edit properties at `/admin/properties`
- View enquiries at `/admin/leads`
- Manage users at `/admin/users`

#### Public Portal Tests:
- Home page: `http://localhost:8080/`
- View all properties: `http://localhost:8080/properties`
- View property detail: Click on any property
- Contact form: `http://localhost:8080/contact`
- Auth/Signup: `http://localhost:8080/auth`

#### API Testing (Using curl or Postman):

**Admin Login:**
```bash
curl -X POST http://localhost:4000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vishalproperties.com",
    "password": "Admin@12345"
  }'
```

Response will include a token like:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@vishalproperties.com",
    "role": "admin",
    "status": "active"
  }
}
```

**Get All Properties (no auth needed):**
```bash
curl http://localhost:4000/api/properties
```

**Get Admin Properties (requires auth):**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:4000/api/properties/admin/all
```

**Create Enquiry:**
```bash
curl -X POST http://localhost:4000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "message": "Interested in your properties"
  }'
```

## Seed Data Details

The seed script inserts:

### Users (2):
1. **Admin User**
   - Email: admin@vishalproperties.com
   - Password: Admin@12345
   - Role: admin
   - Phone: 9876543210

2. **Regular User**
   - Email: user@example.com
   - Password: User@12345
   - Role: user
   - Phone: 9876543211

### Properties (5):
1. 3 BHK Luxury Flat - Sector 36 (₹85 Lakhs) - Premium
2. Residential Plot - Suncity Heights (₹45 Lakhs)
3. 2 BHK Apartment - Suncity Projects (₹55 Lakhs)
4. Commercial Space - Sector 3 (₹1.2 Cr) - Premium
5. 4 BHK Villa - Premium Location (₹1.5 Cr) - Premium

### Enquiries (2):
- Rahul Kumar interested in 3 BHK flat
- Priya Singh interested in commercial space

### Pages (2):
- About page
- Contact page

## Troubleshooting

### Database Connection Error
- Check MongoDB URI in `server/.env`
- Verify IP whitelist in MongoDB Atlas includes your IP
- Check credentials are correct

### Seed Script Fails
```bash
# Make sure you're in server directory
cd server

# Clear and try again
npm run seed
```

### No data in admin panel
- Make sure seed script completed successfully
- Check server logs for errors
- Verify MongoDB connection with: `npm run dev`

### API returns 401 Unauthorized
- Make sure you're including the Bearer token
- Check token is not expired (tokens expire after 7 days by default)
- Re-login to get a fresh token

## Resetting Database

To clear all data and re-seed:

```bash
cd server
npm run seed
```

This will:
1. Clear all existing data
2. Create new users
3. Create new properties
4. Create new enquiries
5. Show credentials

That's it! Your database will be fresh with test data.
