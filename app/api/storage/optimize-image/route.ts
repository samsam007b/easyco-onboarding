/**
 * API Route - Optimize Image
 * Compresse les images avec Sharp (server-side uniquement)
 *
 * POST /api/storage/optimize-image
 * Body: FormData avec file + type (avatar | property)
 * Returns: Blob optimisé + stats
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'property';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Skip si pas une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    const originalSize = file.size;
    const buffer = Buffer.from(await file.arrayBuffer());

    let optimized: Buffer;

    // Compression selon type
    switch (type) {
      case 'avatar':
        // Avatar : carré 512×512, WebP qualité 85
        optimized = await sharp(buffer)
          .resize(512, 512, {
            fit: 'cover',
            position: 'center',
          })
          .webp({ quality: 85 })
          .toBuffer();
        break;

      case 'property':
        // Propriété : max 2048px largeur, conserve ratio, WebP 85
        optimized = await sharp(buffer)
          .resize(2048, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
        break;

      default:
        // Fallback : pas de compression
        return NextResponse.json(
          { error: 'Invalid type. Use "avatar" or "property"' },
          { status: 400 }
        );
    }

    const optimizedSize = optimized.length;
    const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

    console.log(
      `[Optimize API] ${file.name}: ${(originalSize / 1024).toFixed(0)} KB → ${(
        optimizedSize / 1024
      ).toFixed(0)} KB (-${reduction.toFixed(1)}%)`
    );

    // Retourner le blob optimisé
    return new NextResponse(optimized, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': optimizedSize.toString(),
        'X-Original-Size': originalSize.toString(),
        'X-Optimized-Size': optimizedSize.toString(),
        'X-Reduction-Percent': reduction.toFixed(1),
      },
    });
  } catch (error) {
    console.error('[Optimize API] Error:', error);
    return NextResponse.json(
      {
        error: 'Image optimization failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
