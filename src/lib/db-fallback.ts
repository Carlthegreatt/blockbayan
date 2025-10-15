/**
 * Fallback database implementation for production environments
 * where file system access might be restricted
 */

import crypto from "crypto";

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

// In-memory fallback storage
let fallbackUsers: User[] = [];

export function readUsersFallback(): User[] {
  return fallbackUsers;
}

export function writeUsersFallback(users: User[]): void {
  fallbackUsers = users;
}

export function findUserByEmailFallback(email: string): User | null {
  return (
    fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

export function createUserFallback(
  userData: Omit<User, "id" | "createdAt" | "updatedAt">
): User {
  // Check if email already exists
  if (findUserByEmailFallback(userData.email)) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  fallbackUsers.push(newUser);
  return newUser;
}

export function verifyPasswordFallback(
  password: string,
  hash: string
): boolean {
  return hashPasswordFallback(password) === hash;
}

export function hashPasswordFallback(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "blockbayan-salt")
    .digest("hex");
}
