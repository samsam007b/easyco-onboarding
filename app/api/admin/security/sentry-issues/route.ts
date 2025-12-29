/**
 * SENTRY ISSUES API
 *
 * Fetches issues from Sentry for the security dashboard.
 * Supports pagination, sorting, and filtering.
 */

import { NextRequest, NextResponse } from 'next/server';
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

// Parse Link header for pagination cursors
function parseLinkHeader(linkHeader: string | null): { next?: string; prev?: string } {
  if (!linkHeader) return {};

  const links: { next?: string; prev?: string } = {};
  const parts = linkHeader.split(',');

  for (const part of parts) {
    const match = part.match(/<[^>]*[?&]cursor=([^>&]+)[^>]*>;\s*rel="(\w+)"/);
    if (match) {
      const [, cursor, rel] = match;
      if (rel === 'next') links.next = cursor;
      if (rel === 'previous') links.prev = cursor;
    }
  }

  return links;
}

export async function GET(request: NextRequest) {
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
    const sentryOrg = process.env.SENTRY_ORG;
    const sentryProject = process.env.SENTRY_PROJECT;
    // Detect region from DSN (de.sentry.io = EU, sentry.io = US)
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
    const isEuRegion = sentryDsn.includes('.de.sentry.io');
    const sentryApiBase = isEuRegion ? 'https://de.sentry.io' : 'https://sentry.io';

    if (!sentryToken) {
      return NextResponse.json({
        issues: [],
        error: 'SENTRY_AUTH_TOKEN_READ not configured',
        total: 0,
      });
    }

    if (!sentryOrg || !sentryProject) {
      return NextResponse.json({
        issues: [],
        error: 'SENTRY_ORG and SENTRY_PROJECT must be configured',
        total: 0,
      });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor') || '';
    const status = searchParams.get('status') || 'unresolved'; // unresolved, resolved, ignored, or empty for all
    const sort = searchParams.get('sort') || 'date'; // date, new, priority, freq, user
    const limit = Math.min(Number(searchParams.get('limit')) || 25, 100);

    // Build query string for Sentry API
    const queryParts: string[] = [];
    if (status && status !== 'all') {
      queryParts.push(`is:${status}`);
    }

    // Build API URL with parameters
    const apiParams = new URLSearchParams();
    if (queryParts.length > 0) {
      apiParams.set('query', queryParts.join(' '));
    }
    apiParams.set('sort', sort);
    apiParams.set('limit', limit.toString());
    if (cursor) {
      apiParams.set('cursor', cursor);
    }

    const apiUrl = `${sentryApiBase}/api/0/projects/${sentryOrg}/${sentryProject}/issues/?${apiParams.toString()}`;
    console.log('[SentryIssues] Fetching from:', apiUrl);

    const response = await fetch(
      apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${sentryToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[SentryIssues] Sentry API error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        body: errorBody,
      });

      // Try to parse error body for more details
      let errorDetail = '';
      try {
        const errorJson = JSON.parse(errorBody);
        errorDetail = errorJson.detail || errorJson.message || errorJson.error || '';
      } catch {
        errorDetail = errorBody.slice(0, 200);
      }

      // Provide more helpful error messages
      let errorMessage = `Sentry API error: ${response.statusText}`;
      if (response.status === 400) {
        errorMessage = `Bad Request: ${errorDetail || 'Invalid request parameters'}`;
      } else if (response.status === 404) {
        errorMessage = `Project not found. Verify SENTRY_ORG (${sentryOrg}) and SENTRY_PROJECT (${sentryProject}) are correct`;
      } else if (response.status === 401) {
        errorMessage = `Invalid or expired token. ${errorDetail || 'Check SENTRY_AUTH_TOKEN_READ'}`;
      } else if (response.status === 403) {
        errorMessage = `Token does not have access to this project. ${errorDetail}`;
      }

      return NextResponse.json({
        issues: [],
        error: errorMessage,
        debug: {
          apiUrl,
          status: response.status,
          statusText: response.statusText,
          org: sentryOrg,
          project: sentryProject,
          region: isEuRegion ? 'EU' : 'US',
          errorDetail,
          tokenPrefix: sentryToken.slice(0, 10) + '...',
        },
        total: 0,
      });
    }

    const rawIssues = await response.json();

    // Parse pagination from Link header
    const linkHeader = response.headers.get('Link');
    const pagination = parseLinkHeader(linkHeader);

    // Map to our format - IMPORTANT: Convert count/userCount to numbers!
    const issues: SentryIssue[] = rawIssues.map((issue: any) => ({
      id: issue.id,
      shortId: issue.shortId,
      title: issue.title,
      culprit: issue.culprit || '',
      level: issue.level,
      status: issue.status,
      count: Number(issue.count) || 0,
      userCount: Number(issue.userCount) || 0,
      firstSeen: issue.firstSeen,
      lastSeen: issue.lastSeen,
      permalink: issue.permalink,
    }));

    // Calculate totals
    const totalEvents = issues.reduce((sum, issue) => sum + issue.count, 0);
    const totalUsers = issues.reduce((sum, issue) => sum + issue.userCount, 0);

    return NextResponse.json({
      issues,
      total: issues.length,
      totalEvents,
      totalUsers,
      pagination: {
        hasNext: !!pagination.next,
        hasPrev: !!pagination.prev,
        nextCursor: pagination.next || null,
        prevCursor: pagination.prev || null,
      },
    });
  } catch (error) {
    console.error('[SentryIssues] Error:', error);
    return NextResponse.json(
      { error: 'Internal error', issues: [], total: 0 },
      { status: 500 }
    );
  }
}
