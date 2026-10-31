import bcrypt from "bcryptjs";

const COST = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, COST);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Used when the email is unknown so response time doesn't reveal it. */
export const DUMMY_HASH = "$2b$12$c3yuo87H6zcuokxgwj4yBu7QXqpPcPY9fsvMVesXL0.mnZTuKw46m";

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password))
    return "Password must contain lowercase, uppercase and a number.";
  return null;
}
