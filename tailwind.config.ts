import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // SEARCHER COLOR SYSTEM - Yellow/Gold/Amber
        // ============================================
        searcher: {
          50: 'var(--searcher-50)',
          100: 'var(--searcher-100)',
          200: 'var(--searcher-200)',
          300: 'var(--searcher-300)',
          400: 'var(--searcher-400)',
          500: 'var(--searcher-500)',   // PRIMARY
          600: 'var(--searcher-600)',
          700: 'var(--searcher-700)',
          800: 'var(--searcher-800)',
          900: 'var(--searcher-900)',
          primary: 'var(--searcher-primary)',
          hover: 'var(--searcher-hover)',
          light: 'var(--searcher-light)',
          dark: 'var(--searcher-dark)',
          accent: 'var(--searcher-accent)',
          muted: 'var(--searcher-muted)',
          border: 'var(--searcher-border)',
        },

        // ============================================
        // OWNER COLOR SYSTEM - Mauve/Purple/Indigo
        // ============================================
        owner: {
          50: 'var(--owner-50)',
          100: 'var(--owner-100)',
          200: 'var(--owner-200)',
          300: 'var(--owner-300)',
          400: 'var(--owner-400)',
          500: 'var(--owner-500)',      // PRIMARY
          600: 'var(--owner-600)',
          700: 'var(--owner-700)',
          800: 'var(--owner-800)',
          900: 'var(--owner-900)',
          primary: 'var(--owner-primary)',
          hover: 'var(--owner-hover)',
          light: 'var(--owner-light)',
          dark: 'var(--owner-dark)',
          accent: 'var(--owner-accent)',
          muted: 'var(--owner-muted)',
          border: 'var(--owner-border)',
        },

        // ============================================
        // RESIDENT COLOR SYSTEM - Orange/Coral/Terracotta
        // ============================================
        resident: {
          50: 'var(--resident-50)',
          100: 'var(--resident-100)',
          200: 'var(--resident-200)',
          300: 'var(--resident-300)',
          400: 'var(--resident-400)',
          500: 'var(--resident-500)',   // PRIMARY
          600: 'var(--resident-600)',
          700: 'var(--resident-700)',
          800: 'var(--resident-800)',
          900: 'var(--resident-900)',
          primary: 'var(--resident-primary)',
          hover: 'var(--resident-hover)',
          light: 'var(--resident-light)',
          dark: 'var(--resident-dark)',
          accent: 'var(--resident-accent)',
          muted: 'var(--resident-muted)',
          border: 'var(--resident-border)',
        },

        // ============================================
        // ROLE-AGNOSTIC COLORS (Dynamic)
        // ============================================
        role: {
          primary: 'var(--role-primary)',
          hover: 'var(--role-hover)',
          light: 'var(--role-light)',
          dark: 'var(--role-dark)',
        },

        // ============================================
        // LEGACY SUPPORT (Backward Compatibility)
        // ============================================
        easy: {
          purple: 'var(--easy-purple)',
          yellow: 'var(--easy-yellow)',
          orange: 'var(--easy-orange)',
        },

        // ============================================
        // SEMANTIC COLORS
        // ============================================
        success: {
          100: 'var(--success-100)',
          500: 'var(--success-500)',
        },
        error: {
          100: 'var(--error-100)',
          500: 'var(--error-500)',
        },
        warning: {
          100: 'var(--warning-100)',
          500: 'var(--warning-500)',
        },
        info: {
          100: 'var(--info-100)',
          500: 'var(--info-500)',
        },
      },

      // ============================================
      // BACKGROUND IMAGES (Gradients)
      // ============================================
      backgroundImage: {
        // Brand gradients
        'gradient-brand': 'var(--gradient-brand)',
        'gradient-brand-horizontal': 'var(--gradient-brand-horizontal)',
        'gradient-brand-vertical': 'var(--gradient-brand-vertical)',

        // Searcher gradients
        'gradient-searcher': 'var(--gradient-searcher)',
        'gradient-searcher-logo': 'var(--gradient-searcher-logo)',
        'gradient-searcher-soft': 'var(--gradient-searcher-soft)',
        'gradient-searcher-light': 'var(--gradient-searcher-light)',
        'gradient-searcher-medium': 'var(--gradient-searcher-medium)',
        'gradient-searcher-dark': 'var(--gradient-searcher-dark)',
        'gradient-searcher-subtle': 'var(--gradient-searcher-subtle)',
        'gradient-searcher-cta': 'var(--gradient-searcher-cta)',
        'gradient-searcher-vibrant': 'var(--gradient-searcher-vibrant)',

        // Owner gradients
        'gradient-owner': 'var(--gradient-owner)',
        'gradient-owner-logo': 'var(--gradient-owner-logo)',
        'gradient-owner-soft': 'var(--gradient-owner-soft)',
        'gradient-owner-light': 'var(--gradient-owner-light)',
        'gradient-owner-medium': 'var(--gradient-owner-medium)',
        'gradient-owner-dark': 'var(--gradient-owner-dark)',
        'gradient-owner-subtle': 'var(--gradient-owner-subtle)',
        'gradient-owner-cta': 'var(--gradient-owner-cta)',
        'gradient-owner-vibrant': 'var(--gradient-owner-vibrant)',

        // Resident gradients
        'gradient-resident': 'var(--gradient-resident)',
        'gradient-resident-logo': 'var(--gradient-resident-logo)',
        'gradient-resident-soft': 'var(--gradient-resident-soft)',
        'gradient-resident-light': 'var(--gradient-resident-light)',
        'gradient-resident-medium': 'var(--gradient-resident-medium)',
        'gradient-resident-dark': 'var(--gradient-resident-dark)',
        'gradient-resident-subtle': 'var(--gradient-resident-subtle)',
        'gradient-resident-cta': 'var(--gradient-resident-cta)',
      },

      // ============================================
      // SPACING & BORDERS
      // ============================================
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        'searcher': '0 4px 20px var(--searcher-shadow)',
        'owner': '0 4px 20px var(--owner-shadow)',
        'resident': '0 4px 20px var(--resident-shadow)',
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          },
        },
        'blob': {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
};

export default config;
