#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');
const svgPath = path.join(iconsDir, 'icon.svg');

console.log('Generating PWA icons from SVG...');

// Check if svg2png or similar tools are available
try {
  // Try using rsvg-convert (librsvg)
  execSync('which rsvg-convert', { stdio: 'ignore' });

  sizes.forEach(size => {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    console.log(`Creating ${size}x${size}...`);
    execSync(`rsvg-convert -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`);
  });

  console.log('✓ All icons generated successfully!');
} catch (error) {
  console.log('rsvg-convert not found, trying ImageMagick...');

  try {
    // Try ImageMagick convert
    execSync('which convert', { stdio: 'ignore' });

    sizes.forEach(size => {
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      console.log(`Creating ${size}x${size}...`);
      execSync(`convert -background none -resize ${size}x${size} "${svgPath}" "${outputPath}"`);
    });

    console.log('✓ All icons generated successfully!');
  } catch (error2) {
    console.log('ImageMagick not found, trying inkscape...');

    try {
      // Try Inkscape
      execSync('which inkscape', { stdio: 'ignore' });

      sizes.forEach(size => {
        const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
        console.log(`Creating ${size}x${size}...`);
        execSync(`inkscape -w ${size} -h ${size} "${svgPath}" -o "${outputPath}"`);
      });

      console.log('✓ All icons generated successfully!');
    } catch (error3) {
      console.error('⚠️  No SVG conversion tool found.');
      console.error('Please install one of: rsvg-convert, ImageMagick (convert), or Inkscape');
      console.error('\nOn macOS with Homebrew:');
      console.error('  brew install librsvg    # for rsvg-convert');
      console.error('  brew install imagemagick');
      console.error('  brew install inkscape');
      console.error('\nAlternatively, you can generate icons manually or use an online tool.');
      process.exit(1);
    }
  }
}

// Also create shortcut icons (placeholder)
const shortcutSizes = ['explore', 'favorites', 'messages'];
console.log('\n⚠️  Note: Shortcut icons (shortcut-*.png) should be created manually.');
console.log('These icons need specific designs for each app shortcut.');
