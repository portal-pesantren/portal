import { v7 as uuidv7 } from 'uuid';

/**
 * Generate UUID v7 (time-ordered UUID)
 * UUID v7 provides better performance for database indexing
 * and maintains chronological ordering
 */
export function generateUUIDv7(): string {
  return uuidv7();
}

/**
 * Validate if a string is a valid UUID v7
 */
export function isValidUUIDv7(uuid: string): boolean {
  const uuidv7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv7Regex.test(uuid);
}

/**
 * Extract timestamp from UUID v7
 * Returns the creation timestamp in milliseconds
 */
export function getTimestampFromUUIDv7(uuid: string): number | null {
  if (!isValidUUIDv7(uuid)) {
    return null;
  }
  
  // Extract first 48 bits (timestamp) from UUID v7
  const hex = uuid.replace(/-/g, '').substring(0, 12);
  const timestamp = parseInt(hex, 16);
  
  return timestamp;
}

/**
 * Generate a code for an entity (wrapper for UUID v7)
 * This function can be extended later if we need specific formatting
 */
export function generateEntityCode(): string {
  return generateUUIDv7();
}

/**
 * Validate entity code format
 */
export function isValidEntityCode(code: string): boolean {
  return isValidUUIDv7(code);
}