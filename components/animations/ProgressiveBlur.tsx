'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ProgressiveBlurProps {
  children: ReactNode;
  maxBlur?: number;
  className?: string;
}

export function ProgressiveBlur({ children, maxBlur = 10, className = '' }: ProgressiveBlurProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const blur = useTransform(scrollYProgress, [0, 1], [0, maxBlur]);

  return (
    <motion.div
      ref={ref}
      style={{ filter: useTransform(blur, (value) => `blur(${value}px)`) }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
