/**
 * ADMIN API: Design Screenshots Upload
 *
 * Handles uploading design screenshots for the design history feature.
 * Uses Supabase storage with the 'design-screenshots' bucket.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/supabase-server';
import { getApiLanguage, apiT } from '@/lib/i18n/api-translations';
import { validateAdminRequest } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

const BUCKET_NAME = 'design-screenshots';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    // Verify admin access
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    // Check admin status using RPC
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_email: user.email });

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: apiT('admin.forbidden', lang) }, { status: 403 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const versionId = formData.get('versionId') as string | null;

    if (!file) {
      return NextResponse.json({ error: apiT('admin.noFileProvided', lang) }, { status: 400 });
    }

    if (!versionId) {
      return NextResponse.json({ error: apiT('admin.noVersionIdProvided', lang) }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: apiT('admin.invalidFileType', lang) },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: apiT('admin.fileTooLarge', lang) },
        { status: 400 }
      );
    }

    // Validate magic number (file signature)
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    const isWebP =
      bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

    if (!isJPEG && !isPNG && !isWebP) {
      return NextResponse.json(
        { error: apiT('admin.invalidImage', lang) },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    const extension = file.name.split('.').pop() || 'png';
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 50);
    const fileName = `${timestamp}-${sanitizedName}-${randomString}.${extension}`;
    const filePath = `${versionId}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (uploadError) {
      console.error('[Design Screenshots] Upload error:', uploadError);

      // Check if bucket doesn't exist
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          { error: apiT('admin.storageBucketNotConfigured', lang) },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: apiT('common.internalServerError', lang) },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      id: `${timestamp}-${randomString}`,
      name: sanitizedName,
      url: urlData.publicUrl,
      path: data.path,
      size: file.size,
      type: file.type,
    });

  } catch (error: unknown) {
    console.error('[Design Screenshots] Error:', error);
    return NextResponse.json(
      { error: apiT('common.internalServerError', lang) },
      { status: 500 }
    );
  }
}

/**
 * GET: List all screenshots for a version
 */
export async function GET(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_email: user.email });

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: apiT('admin.forbidden', lang) }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get('versionId');

    if (!versionId) {
      return NextResponse.json({ error: apiT('admin.versionIdRequired', lang) }, { status: 400 });
    }

    // List files in the version folder
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(versionId, {
        sortBy: { column: 'created_at', order: 'asc' },
      });

    if (listError) {
      console.error('[Design Screenshots] List error:', listError);
      return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
    }

    // Generate URLs for each file
    const screenshots = (files || [])
      .filter(file => file.name && !file.name.startsWith('.'))
      .map(file => {
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${versionId}/${file.name}`);

        // Extract original name from filename
        const nameParts = file.name.replace(/\.[^/.]+$/, '').split('-');
        const name = nameParts.slice(1, -1).join('-') || file.name;

        return {
          id: file.id || file.name,
          name,
          url: urlData.publicUrl,
          path: `${versionId}/${file.name}`,
          size: file.metadata?.size,
          createdAt: file.created_at,
        };
      });

    return NextResponse.json({ screenshots });

  } catch (error: unknown) {
    console.error('[Design Screenshots] Error:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}

/**
 * DELETE: Remove a screenshot
 */
export async function DELETE(request: NextRequest) {
  const lang = getApiLanguage(request);

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: apiT('common.unauthorized', lang) }, { status: 401 });
    }

    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_email: user.email });

    if (adminError || !isAdmin) {
      return NextResponse.json({ error: apiT('admin.forbidden', lang) }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: apiT('admin.pathRequired', lang) }, { status: 400 });
    }

    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (deleteError) {
      console.error('[Design Screenshots] Delete error:', deleteError);
      return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error('[Design Screenshots] Error:', error);
    return NextResponse.json({ error: apiT('common.internalServerError', lang) }, { status: 500 });
  }
}
