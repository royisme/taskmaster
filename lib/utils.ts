import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFingerprintId(data: string) {
  const hash = crypto.createHash('md5').update(data).digest('hex');
  return hash;
}
