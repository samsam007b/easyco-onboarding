'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Generates a superellipse SVG path with curved edges (Fredoka style)
 * Formula: |x/a|^n + |y/b|^n = 1
 * n=5 gives iOS/Fredoka-style squircle with curved sides
 */
function generateSuperellipsePath(
  width: number,
  height: number,
  n: number = 5,
  segments: number = 64
): string {
  const a = width / 2;
  const b = height / 2;
  const points: string[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    // Superellipse parametric formula
    const exp = 2 / n;
    const x = a + a * Math.sign(cosT) * Math.pow(Math.abs(cosT), exp);
    const y = b + b * Math.sign(sinT) * Math.pow(Math.abs(sinT), exp);

    if (i === 0) {
      points.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
    } else {
      points.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
  }

  points.push('Z');
  return points.join(' ');
}

/**
 * Creates an SVG clip-path URL for a superellipse
 */
function createSuperellipseClipPath(
  width: number,
  height: number,
  n: number = 5
): string {
  const path = generateSuperellipsePath(width, height, n);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${path}"/></svg>`;
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encoded}#path")`;
}

/**
 * Creates inline SVG mask styles for superellipse
 */
function createSuperellipseMask(
  width: number,
  height: number,
  n: number = 5
): string {
  const path = generateSuperellipsePath(width, height, n);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${path}" fill="white"/></svg>`;
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encoded}")`;
}

interface UseSuperellipseOptions {
  n?: number; // Superellipse exponent (default: 5 for iOS/Fredoka style)
  enabled?: boolean;
}

/**
 * React hook to apply superellipse (squircle) shape to an element
 * Uses CSS mask-image for true curved edges on all browsers
 */
export function useSuperellipse<T extends HTMLElement>(
  options: UseSuperellipseOptions = {}
) {
  const { n = 5, enabled = true } = options;
  const ref = useRef<T>(null);

  const applyMask = useCallback(() => {
    if (!ref.current || !enabled) return;

    const element = ref.current;
    const { offsetWidth: width, offsetHeight: height } = element;

    if (width === 0 || height === 0) return;

    const mask = createSuperellipseMask(width, height, n);

    // Apply mask for true superellipse shape
    element.style.maskImage = mask;
    element.style.webkitMaskImage = mask;
    element.style.maskSize = '100% 100%';
    element.style.webkitMaskSize = '100% 100%';
    element.style.maskRepeat = 'no-repeat';
    element.style.webkitMaskRepeat = 'no-repeat';

    // Remove border-radius since mask handles the shape
    element.style.borderRadius = '0';
  }, [n, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Apply mask after initial render
    applyMask();

    // Re-apply on resize
    const observer = new ResizeObserver(() => {
      applyMask();
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [applyMask, enabled]);

  return ref;
}

/**
 * Component wrapper that applies superellipse shape
 */
export function getSuperellipseStyle(
  width: number,
  height: number,
  n: number = 5
): React.CSSProperties {
  const mask = createSuperellipseMask(width, height, n);

  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    borderRadius: 0,
  } as React.CSSProperties;
}

/**
 * Generate CSS for a superellipse with specific dimensions
 * Useful for generating static CSS
 */
export function generateSuperellipseCSS(
  width: number,
  height: number,
  n: number = 5
): string {
  const mask = createSuperellipseMask(width, height, n);

  return `
    -webkit-mask-image: ${mask};
    mask-image: ${mask};
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    border-radius: 0;
  `;
}

export { generateSuperellipsePath, createSuperellipseMask };
