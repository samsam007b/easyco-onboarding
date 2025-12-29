/**
 * SENTRY ISSUES API
 *
 * Fetches issues from Sentry for the security dashboard.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';

export const dynamic = 'force-dynamic';

interface SentryIssue {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  permalink: string;
}

export async function GET() {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminClient = getAdminClient();
    const { data: admin } = await adminClient
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch issues from Sentry API
    const sentryToken = process.env.SENTRY_AUTH_TOKEN_READ;
    const sentryOrg = process.env.SENTRY_ORG || 'easyco-6g';
    const sentryProject = process.env.SENTRY_PROJECT || 'easyco-onboarding';

    if (!sentryToken) {
      return NextResponse.json({
        issues: [],
        error: 'Sentry not configured',
        total: 0,
      });
    }

    const response = await fetch(
      `https://sentry.io/api/0/projects/${sentryOrg}/${sentryProject}/issues/?query=is:unresolved&statsPeriod=30d`,
      {
        headers: {
          'Authorization': `Bearer ${sentryToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('[SentryIssues] Sentry API error:', response.statusText);
      return NextResponse.json({
        issues: [],
        error: `Sentry API error: ${response.statusText}`,
        total: 0,
      });
    }

    const rawIssues = await response.json();

    // Map to our format
    const issues: SentryIssue[] = rawIssues.map((issue: any) => ({
      id: issue.id,
      shortId: issue.shortId,
      title: issue.title,
      culprit: issue.culprit || '',
      level: issue.level,
      status: issue.status,
      count: issue.count || 0,
      userCount: issue.userCount || 0,
      firstSeen: issue.firstSeen,
      lastSeen: issue.lastSeen,
      permalink: issue.permalink,
    }));

    return NextResponse.json({
      issues,
      total: issues.length,
    });
  } catch (error) {
    console.error('[SentryIssues] Error:', error);
    return NextResponse.json(
      { error: 'Internal error', issues: [], total: 0 },
      { status: 500 }
    );
  }
}
