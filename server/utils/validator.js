// ===== Profanity Filter & Security Sanitizer =====

const PROFANITY_LIST = [
  'admin', 'root', 'system', 'null', 'undefined', 'anonymous',
  'fuck', 'shit', 'asshole', 'bitch', 'bastard', 'cunt', 'dick',
  'slut', 'whore', 'nigger', 'faggot', 'retard', 'scam', 'hacker',
  'nazi', 'hitler', 'terrorist', 'porn', 'sex', 'casino', 'viagra'
];

/**
 * Check if text contains profane or inappropriate words
 * @param {string} text 
 * @returns {boolean} true if inappropriate content is detected
 */
export function containsInappropriateContent(text) {
  if (!text || typeof text !== 'string') return false;
  
  const normalized = text.toLowerCase()
    .replace(/[0-9@$_!]/g, match => {
      const map = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i' };
      return map[match] || match;
    })
    .replace(/[^a-z]/g, '');

  return PROFANITY_LIST.some(word => normalized.includes(word));
}

/**
 * Validate and sanitize username
 * Rules: 3-30 chars, alphanumeric + underscores, no profanity
 * @param {string} username 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const clean = username.trim().toLowerCase();

  if (clean.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (clean.length > 25) {
    return { valid: false, error: 'Username cannot exceed 25 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  if (containsInappropriateContent(clean)) {
    return { valid: false, error: 'Username contains inappropriate or reserved words' };
  }

  return { valid: true };
}

/**
 * Sanitize strings against HTML/Script injection
 * @param {string} str 
 * @returns {string}
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}
