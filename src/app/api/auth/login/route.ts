import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory rate limiting and brute force protection
interface AttemptRecord {
  count: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

// Clean up stale attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of loginAttempts.entries()) {
    if (record.lockedUntil < now && record.count === 0) {
      loginAttempts.delete(key);
    }
  }
}, 60000);

// Timing-safe constant-time string comparison
function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy compare to prevent length leaking
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const now = Date.now();

    // Check rate limit / lockout
    const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    if (attempt.lockedUntil > now) {
      const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Security lockout active. Please try again in ${remainingSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password;

    // Credentials strictly assigned by administrator
    const MASTER_EMAIL = 'master@weatherca.net';
    const MASTER_PASS = 'Amk251220.';

    const isMasterEmail = timingSafeCompare(cleanEmail, MASTER_EMAIL);
    const isMasterPass = timingSafeCompare(cleanPass, MASTER_PASS);

    if (isMasterEmail && isMasterPass) {
      // Reset attempts on successful login
      loginAttempts.delete(ip);

      const sessionToken = crypto.randomBytes(32).toString('hex');
      const adminUser = {
        id: 'usr_master_admin',
        name: 'WeatherCA Master Administrator',
        email: MASTER_EMAIL,
        role: 'admin' as const,
        status: 'active' as const,
        avatar: '🛡️',
        favorites: ['toronto', 'montreal', 'vancouver', 'calgary'],
        notificationsEnabled: true,
        createdAt: '2025-01-01',
      };

      const response = NextResponse.json({
        success: true,
        user: adminUser,
        token: sessionToken,
      });

      // Secure session cookie (cleared when session terminates)
      response.cookies.set('weatherca_admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      return response;
    }

    // Failed attempt handling
    attempt.count += 1;
    if (attempt.count >= 5) {
      // Lock out for 15 minutes after 5 consecutive failures
      attempt.lockedUntil = now + 15 * 60 * 1000;
      attempt.count = 0;
      loginAttempts.set(ip, attempt);
      return NextResponse.json(
        {
          success: false,
          error: 'Security alert: 5 consecutive failed login attempts. IP temporarily locked for 15 minutes.',
        },
        { status: 429 }
      );
    }

    loginAttempts.set(ip, attempt);

    return NextResponse.json(
      {
        success: false,
        error: `Invalid credentials. ${5 - attempt.count} attempt(s) remaining before security lockout.`,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication service encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
