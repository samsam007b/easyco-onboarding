// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { checkRateLimit, getClientIdentifier, createRateLimitHeaders, RateLimitConfig } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/security/logger';
import { sanitizeEmail } from '@/lib/security/sanitizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, password } = body;

    // Sanitize email
    const email = sanitizeEmail(rawEmail);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get client identifier (IP address)
    const clientId = getClientIdentifier(request);

    // SECURITY: Check rate limit (5 login attempts per minute per IP)
    const rateLimitResult = await checkRateLimit(
      `login:${clientId}`,
      'login',
      RateLimitConfig.LOGIN.limit,
      RateLimitConfig.LOGIN.window
    );

    if (!rateLimitResult.success) {
      logger.security('Login rate limit exceeded', {
        email,
        ip: clientId,
      });

      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again in a few minutes.',
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const supabase = await createClient();

    // SECURITY: Check if account is locked
    const { data: isLocked, error: lockCheckError } = await supabase
      .rpc('is_account_locked', { user_email: email });

    if (lockCheckError) {
      logger.error('Failed to check account lock status', lockCheckError, { email });
    }

    if (isLocked) {
      logger.security('Login attempt on locked account', {
        email,
        ip: clientId,
      });

      return NextResponse.json(
        {
          error: 'Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes or reset your password.',
        },
        {
          status: 403,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Record failed login attempt
      try {
        const { data: lockData } = await supabase.rpc('record_failed_login', {
          user_email: email,
          user_ip: clientId,
        });

        if (lockData && lockData.length > 0) {
          const { is_locked, attempts } = lockData[0];

          logger.security('Failed login attempt', {
            email,
            ip: clientId,
            attempts,
            locked: is_locked,
          });

          if (is_locked) {
            return NextResponse.json(
              {
                error: `Account locked after ${attempts} failed attempts. Please try again in 15 minutes or reset your password.`,
              },
              {
                status: 403,
                headers: createRateLimitHeaders(rateLimitResult),
              }
            );
          }

          // Warn user about remaining attempts
          const remainingAttempts = 5 - attempts;
          return NextResponse.json(
            {
              error: `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining before account lockout.`,
            },
            {
              status: 401,
              headers: createRateLimitHeaders(rateLimitResult),
            }
          );
        }
      } catch (lockError) {
        logger.error('Failed to record login attempt', lockError as Error, { email });
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        {
          status: 401,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Success - reset login attempts
    try {
      await supabase.rpc('reset_login_attempts', { user_email: email });
    } catch (resetError) {
      logger.error('Failed to reset login attempts', resetError as Error, { email });
    }

    // Log successful login
    logger.security('Successful login', {
      userId: data.user?.id,
      email,
      ip: clientId,
    });

    // Log to audit_logs table
    if (data.user) {
      await supabase.from('audit_logs').insert({
        user_id: data.user.id,
        action: 'login',
        resource_type: 'auth',
        ip_address: clientId,
        metadata: {
          email,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        user: data.user,
        session: data.session,
      },
      {
        status: 200,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    logger.error('Login error', error as Error);

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
