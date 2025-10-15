# Authentication System Documentation

## Overview

BlockBayan uses a JSON file-based authentication system for demonstration purposes. This provides a simple, working auth flow without requiring external database setup.

## Architecture

### Database (`src/lib/db.ts`)

- **Location**: `data/users.json`
- **Format**: JSON file with user records
- **Operations**: CRUD operations via utility functions
- **Hashing**: SHA-256 with salt (demo only - use bcrypt in production)

### API Routes

#### 1. Signup - `POST /api/auth/signup`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe",
  "userType": "donor" | "beneficiary" | "organization"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "donor",
    "createdAt": "2025-10-15T10:00:00.000Z",
    "updatedAt": "2025-10-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Validation error (missing fields, invalid email, short password)
- `409`: Email already exists
- `500`: Internal server error

**Validation Rules:**

- Email: Must be valid format
- Password: Minimum 8 characters
- UserType: Must be "donor", "beneficiary", or "organization"
- All fields required

#### 2. Login - `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "userType": "donor",
    "createdAt": "2025-10-15T10:00:00.000Z",
    "updatedAt": "2025-10-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400`: Missing email or password
- `401`: Invalid credentials
- `500`: Internal server error

## Database Schema

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique, validated
  name: string; // Display name
  password: string; // Hashed with SHA-256
  userType: "donor" | "beneficiary" | "organization";
  walletAddress?: string; // Optional blockchain wallet
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

## Frontend Integration

### Signup Flow

The signup process follows a 5-step verification:

1. **Account Type Selection**

   - Personal or Organization

2. **Credentials Input**

   - Name, Email, Password
   - Terms acceptance

3. **ID Upload**

   - Front and back of valid ID
   - For demonstration only

4. **Face Verification**

   - Simulated biometric verification
   - Submits data to API on success

5. **Success**
   - Shows account summary
   - Redirects to login

**Code Example:**

```typescript
const response = await fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email,
    password,
    name,
    userType: "donor",
  }),
});

const data = await response.json();
sessionStorage.setItem("user", JSON.stringify(data.user));
```

### Login Flow

**Code Example:**

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
sessionStorage.setItem("user", JSON.stringify(data.user));
router.push("/dashboard");
```

## Session Management

Currently using `sessionStorage` for demo purposes:

```typescript
// Store user session
sessionStorage.setItem("user", JSON.stringify(user));

// Retrieve user session
const user = JSON.parse(sessionStorage.getItem("user") || "null");

// Clear session (logout)
sessionStorage.removeItem("user");
```

## Security Considerations

### Current Implementation (Demo)

- ✅ Input validation
- ✅ Email format checking
- ✅ Password length requirement (8+ chars)
- ✅ Duplicate email prevention
- ✅ SHA-256 password hashing

### Production Recommendations

- 🔒 Use **bcrypt** or **argon2** for password hashing
- 🔒 Implement **JWT** tokens instead of sessionStorage
- 🔒 Add **refresh tokens** for persistent sessions
- 🔒 Use **HTTP-only cookies** for token storage
- 🔒 Implement **rate limiting** on auth endpoints
- 🔒 Add **CSRF protection**
- 🔒 Use **proper database** (PostgreSQL, MongoDB, etc.)
- 🔒 Implement **2FA** for additional security
- 🔒 Add **email verification**
- 🔒 Implement **password reset** functionality

## File Structure

```
blockbayan-1/
├── data/
│   └── users.json              # User database (gitignored)
├── src/
│   ├── app/
│   │   └── api/
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.ts    # Login API endpoint
│   │           └── signup/
│   │               └── route.ts    # Signup API endpoint
│   ├── lib/
│   │   └── db.ts                   # Database utilities
│   └── app/
│       └── (auth)/
│           ├── login/
│           │   └── page.tsx        # Login page
│           └── signup/
│               └── page.tsx        # Signup page
```

## Testing

### Create a Test User

**Via Signup Page:**

1. Visit `/signup`
2. Select account type
3. Fill in credentials:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Upload dummy ID images
5. Complete face verification
6. Account created!

**Via API:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "userType": "donor"
  }'
```

### Login

**Via Login Page:**

1. Visit `/login`
2. Enter email: test@example.com
3. Enter password: password123
4. Click "Sign in"
5. Redirected to dashboard

**Via API:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type": "application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Database Utilities

### Available Functions

```typescript
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  readUsers,
  getUserStats,
  hashPassword,
  verifyPassword,
} from "@/lib/db";
```

### Usage Examples

```typescript
// Create user
const user = createUser({
  email: "john@example.com",
  name: "John Doe",
  password: hashPassword("password123"),
  userType: "donor",
});

// Find user
const user = findUserByEmail("john@example.com");

// Update user
updateUser(userId, { name: "John Smith" });

// Get statistics
const stats = getUserStats();
// Returns: { total: 10, donors: 7, beneficiaries: 2, organizations: 1 }
```

## Troubleshooting

### Issue: "Email already exists"

**Solution**: The email is already registered. Try a different email or login instead.

### Issue: "Password must be at least 8 characters long"

**Solution**: Choose a stronger password with 8+ characters.

### Issue: API returns 500 error

**Solution**:

1. Check if `data/users.json` exists
2. Ensure file permissions allow read/write
3. Check server console for detailed errors

### Issue: User not found after signup

**Solution**: Check `data/users.json` to verify the user was created.

## Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Remember me functionality
- [ ] Session timeout
- [ ] Audit logging
- [ ] User roles and permissions
