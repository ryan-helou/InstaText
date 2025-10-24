// Global rate limiter for entire app
// 10 transcriptions per day total

interface GlobalRateLimit {
  count: number;
  resetTime: number;
}

let globalLimit: GlobalRateLimit = {
  count: 0,
  resetTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
};

export function checkRateLimit(): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const limit = 10;

  // If reset time has passed, reset the counter
  if (now > globalLimit.resetTime) {
    globalLimit = {
      count: 0,
      resetTime: now + 24 * 60 * 60 * 1000,
    };
  }

  // Check if under limit
  if (globalLimit.count < limit) {
    globalLimit.count++;
    return {
      allowed: true,
      remaining: limit - globalLimit.count,
      resetTime: globalLimit.resetTime,
    };
  }

  // Over limit
  return {
    allowed: false,
    remaining: 0,
    resetTime: globalLimit.resetTime,
  };
}
