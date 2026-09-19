import { MIN_PUMP_AMOUNT } from '@/lib/config';

/** Input validation helpers shared across composer, pump and onboarding. */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Validate a free-form pump amount (in SOL) against product rules. */
export function validatePumpAmount(amount: number, balance?: number): ValidationResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, error: 'Enter an amount greater than 0.' };
  }
  if (amount < MIN_PUMP_AMOUNT) {
    return { valid: false, error: `Minimum pump is ${MIN_PUMP_AMOUNT} SOL.` };
  }
  if (balance !== undefined && amount > balance) {
    return { valid: false, error: 'Insufficient balance.' };
  }
  return { valid: true };
}

const USERNAME_RE = /^[a-z0-9_]{3,20}$/i;

/** Validate an onboarding username / pseudo. */
export function validateUsername(username: string): ValidationResult {
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters.' };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters.' };
  }
  if (!USERNAME_RE.test(trimmed)) {
    return { valid: false, error: 'Use only letters, numbers and underscores.' };
  }
  return { valid: true };
}

const MAX_POST_LENGTH = 280;

/** Validate a post body (text is optional when media is attached). */
export function validatePostText(text: string, hasMedia = false): ValidationResult {
  const trimmed = text.trim();
  if (trimmed.length === 0 && !hasMedia) {
    return { valid: false, error: 'Write something or attach media.' };
  }
  if (trimmed.length > MAX_POST_LENGTH) {
    return { valid: false, error: `Posts are limited to ${MAX_POST_LENGTH} characters.` };
  }
  return { valid: true };
}

export { MAX_POST_LENGTH };
