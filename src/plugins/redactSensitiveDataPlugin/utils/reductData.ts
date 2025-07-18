import { DEFAULT_SENSIVITIVE_KEYS, DEFAULT_STRONG_SENSITIVITIES } from '../config';

const maskValue = (value: unknown, key?: string): string => {
    if (typeof value === 'string') {
      if (key && DEFAULT_STRONG_SENSITIVITIES.includes(key.toLowerCase())) {
        return '********';
      }

      return value.length > 4
        ? '*'.repeat(value.length - 4) + value.slice(-4)
        : '****';
    }

    if (typeof value === 'number') {
        return '****';
    }

    return '[REDACTED]';
};


export const redactData = (data: unknown, seen = new WeakSet(), depth = 0): unknown => {
    const MAX_DEPTH = 100;

    if (depth > MAX_DEPTH) {
        return '[MAX_DEPTH_REACHED]';
    }

    if (data === null || typeof data !== 'object') {
        return data;
    }

    if (seen.has(data)) {
        return '[CIRCULAR]';
    }

    seen.add(data);

    if (Array.isArray(data)) {
      return data.map((item) => redactData(item, seen, depth + 1));
    }

    if (data instanceof Date || data instanceof RegExp) {
        return data.toString();
    }
    
    if (data instanceof Map || data instanceof Set) {
        return `[${data.constructor.name}]`;
    }

    const redacted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (DEFAULT_SENSIVITIVE_KEYS.includes(key.toLowerCase())) {
        redacted[key] = maskValue(value, key);
      } else if (typeof value === 'object') {
        redacted[key] = redactData(value, seen, depth + 1);
      } else {
        redacted[key] = value;
      }
    }

    return redacted;
};
