'use client';

import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Generates a superellipse SVG path with curved edges (Fredoka style)
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

interface SuperellipseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Superellipse exponent. n=5 = iOS/Fredoka style, n=4 = classic squircle */
  n?: number;
  /** Element tag to render */
  as?: React.ElementType;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * Superellipse component - applies true squircle shape with curved edges
 * Uses CSS mask for cross-browser support
 */
const Superellipse = forwardRef<HTMLDivElement, SuperellipseProps>(
  ({ className, n = 5, as: Tag = 'div', children, style, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef || internalRef) as React.RefObject<HTMLDivElement>;
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const updateDimensions = () => {
        const { offsetWidth: width, offsetHeight: height } = element;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      };

      // Initial measurement
      updateDimensions();

      // Watch for size changes
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(element);

      return () => observer.disconnect();
    }, [ref]);

    // Generate mask when dimensions are available
    const maskStyle: React.CSSProperties = {};
    if (dimensions.width > 0 && dimensions.height > 0) {
      const path = generateSuperellipsePath(dimensions.width, dimensions.height, n);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimensions.width} ${dimensions.height}"><path d="${path}" fill="white"/></svg>`;
      const encoded = encodeURIComponent(svg);
      const mask = `url("data:image/svg+xml,${encoded}")`;

      maskStyle.maskImage = mask;
      maskStyle.WebkitMaskImage = mask;
      maskStyle.maskSize = '100% 100%';
      maskStyle.WebkitMaskSize = '100% 100%';
      maskStyle.maskRepeat = 'no-repeat';
      maskStyle.WebkitMaskRepeat = 'no-repeat';
    }

    const Component = Tag as any;

    return (
      <Component
        ref={ref}
        className={cn(className)}
        style={{ ...style, ...maskStyle }}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Superellipse.displayName = 'Superellipse';

export { Superellipse, generateSuperellipsePath };
export default Superellipse;
