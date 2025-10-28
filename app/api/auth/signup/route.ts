// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { checkRateLimit, getClientIdentifier, createRateLimitHeaders, RateLimitConfig } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/security/logger';
import { sanitizeEmail, sanitizePlainText } from '@/lib/security/sanitizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, password, fullName: rawFullName, userType } = body;

    // Sanitize inputs
    const email = sanitizeEmail(rawEmail);
    const fullName = sanitizePlainText(rawFullName);

    if (!email || !password || !fullName || !userType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password type and length
    if (typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid password format' },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Password must be between 8 and 128 characters' },
        { status: 400 }
      );
    }

    // Validate full name length
    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate userType
    const validUserTypes = ['searcher', 'owner', 'resident'];
    if (!validUserTypes.includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    // Get client identifier (IP address)
    const clientId = getClientIdentifier(request);

    // SECURITY: Check rate limit (3 signups per hour per IP)
    const rateLimitResult = await checkRateLimit(
      `signup:${clientId}`,
      'signup',
      RateLimitConfig.SIGNUP.limit,
      RateLimitConfig.SIGNUP.window
    );

    if (!rateLimitResult.success) {
      logger.security('Signup rate limit exceeded', {
        email,
        ip: clientId,
      });

      return NextResponse.json(
        {
          error: 'Too many signup attempts. Please try again later.',
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const supabase = await createClient();

    // Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        },
      },
    });

    if (error) {
      logger.error('Signup failed', error, { email, userType });

      // Check for specific errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          {
            status: 409,
            headers: createRateLimitHeaders(rateLimitResult),
          }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to create account' },
        {
          status: 400,
          headers: createRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // Log successful signup
    logger.security('Successful signup', {
      userId: data.user?.id,
      email,
      userType,
      ip: clientId,
    });

    // Log to audit_logs table
    if (data.user) {
      await supabase.from('audit_logs').insert({
        user_id: data.user.id,
        action: 'signup',
        resource_type: 'auth',
        ip_address: clientId,
        metadata: {
          email,
          userType,
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
        status: 201,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    logger.error('Signup error', error as Error);

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
