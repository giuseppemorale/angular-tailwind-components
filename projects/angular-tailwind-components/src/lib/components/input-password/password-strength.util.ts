export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
}

const LOWERCASE = /[a-z]/;
const UPPERCASE = /[A-Z]/;
const DIGIT = /\d/;
const SYMBOL = /[^a-zA-Z0-9]/;
const REPEATED_CHAR = /(.)\1{2,}/;
const COMMON_SEQUENCES = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'qwerty', 'password'];

function hasCommonSequence(value: string): boolean {
  const lower = value.toLowerCase();
  return COMMON_SEQUENCES.some(seq => lower.includes(seq));
}

/**
 * Computes a password strength score (0–100) and maps it to weak / medium / strong.
 */
export function computePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { score: 0, level: 'weak' };
  }

  let score = 0;

  const length = password.length;
  if (length >= 8) score += 25;
  else if (length >= 6) score += 15;
  else if (length >= 4) score += 8;
  else score += 4;

  if (length >= 12) score += 10;
  if (length >= 16) score += 5;

  const variety = [LOWERCASE, UPPERCASE, DIGIT, SYMBOL].filter(re => re.test(password)).length;
  score += variety * 12;

  if (REPEATED_CHAR.test(password)) {
    score -= 10;
  }
  if (hasCommonSequence(password)) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  let level: PasswordStrengthLevel;
  if (score < 40) {
    level = 'weak';
  } else if (score < 70) {
    level = 'medium';
  } else {
    level = 'strong';
  }

  return { score, level };
}

/**
 * Returns how many of the three meter segments should be filled (1–3) for the given level.
 */
export function passwordStrengthMeterFill(level: PasswordStrengthLevel): number {
  switch (level) {
    case 'weak':
      return 1;
    case 'medium':
      return 2;
    case 'strong':
      return 3;
  }
}
