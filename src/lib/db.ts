import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "users.json");

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
  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

// Read all users
export function readUsers(): User[] {
  ensureDbExists();

  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    return db.users || [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

// Write users
function writeUsers(users: User[]): void {
  ensureDbExists();

  const db = { users };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Find user by email
export function findUserByEmail(email: string): User | null {
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
