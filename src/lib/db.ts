import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

// Check if we're in a production environment with restricted file access
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isNetlify = process.env.NETLIFY === "true";
const isRailway = process.env.RAILWAY_ENVIRONMENT !== undefined;

// Use fallback for serverless environments
const useFallback = isVercel || isNetlify || isRailway;

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  userType: "donor" | "beneficiary" | "organization";
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Ensure database file exists
function ensureDbExists() {
  try {
    const dataDir = path.join(process.cwd(), "data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
    }
  } catch (error) {
    console.error("Error ensuring database exists:", error);
    throw new Error("Failed to initialize database");
  }
}

// Read all users
export function readUsers(): User[] {
  if (useFallback) {
    // Import fallback dynamically to avoid issues
    try {
      const { readUsersFallback } = require("./db-fallback");
      return readUsersFallback();
    } catch (error) {
      console.error("Fallback database error:", error);
      return [];
    }
  }

  try {
    ensureDbExists();

    const data = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    return db.users || [];
  } catch (error) {
    console.error("Error reading users:", error);
    // Return empty array instead of throwing to prevent crashes
    return [];
  }
}

// Write users
function writeUsers(users: User[]): void {
  if (useFallback) {
    try {
      const { writeUsersFallback } = require("./db-fallback");
      writeUsersFallback(users);
      return;
    } catch (error) {
      console.error("Fallback write error:", error);
      throw new Error("Failed to save user data");
    }
  }

  try {
    ensureDbExists();

    const db = { users };
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Error writing users:", error);
    throw new Error("Failed to save user data");
  }
}

// Find user by email
export function findUserByEmail(email: string): User | null {
  if (useFallback) {
    try {
      const { findUserByEmailFallback } = require("./db-fallback");
      return findUserByEmailFallback(email);
    } catch (error) {
      console.error("Fallback find user error:", error);
      return null;
    }
  }

  const users = readUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}

// Find user by ID
export function findUserById(id: string): User | null {
  const users = readUsers();
  return users.find((u) => u.id === id) || null;
}

// Create new user
export function createUser(
  userData: Omit<User, "id" | "createdAt" | "updatedAt">
): User {
  if (useFallback) {
    try {
      const { createUserFallback } = require("./db-fallback");
      return createUserFallback(userData);
    } catch (error) {
      console.error("Fallback create user error:", error);
      throw error;
    }
  }

  const users = readUsers();

  // Check if email already exists
  if (findUserByEmail(userData.email)) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}

// Update user
export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...updates,
    id: users[index].id, // Prevent ID change
    createdAt: users[index].createdAt, // Prevent created date change
    updatedAt: new Date().toISOString(),
  };

  writeUsers(users);
  return users[index];
}

// Delete user
export function deleteUser(id: string): boolean {
  const users = readUsers();
  const filteredUsers = users.filter((u) => u.id !== id);

  if (filteredUsers.length === users.length) {
    return false; // User not found
  }

  writeUsers(filteredUsers);
  return true;
}

// Simple password hashing (for demo - use bcrypt in production)
export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "blockbayan-salt")
    .digest("hex");
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  if (useFallback) {
    try {
      const { verifyPasswordFallback } = require("./db-fallback");
      return verifyPasswordFallback(password, hash);
    } catch (error) {
      console.error("Fallback verify password error:", error);
      return false;
    }
  }

  return hashPassword(password) === hash;
}

// Get user statistics
export function getUserStats() {
  const users = readUsers();

  return {
    total: users.length,
    donors: users.filter((u) => u.userType === "donor").length,
    beneficiaries: users.filter((u) => u.userType === "beneficiary").length,
    organizations: users.filter((u) => u.userType === "organization").length,
  };
}
