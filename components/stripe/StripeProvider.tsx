'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Appearance } from '@stripe/stripe-js';

// Load Stripe outside of component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
  userType?: 'owner' | 'resident';
}

export default function StripeProvider({
  children,
  clientSecret,
  userType = 'resident'
}: StripeProviderProps) {
  // IzzIco design system colors
  const colors = {
    owner: {
      primary: '#9c5698',
      hover: '#7B5FB8',
      light: '#F3F1FF',
    },
    resident: {
      primary: '#ff651e',
      hover: '#e05747',
      light: '#FFF3EF',
    },
  };

  const roleColors = colors[userType];

  // Custom appearance matching IzzIco design system
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: roleColors.primary,
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#dc2626',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
      fontSizeBase: '16px',
    },
    rules: {
      '.Input': {
        border: '2px solid #e5e7eb',
        boxShadow: 'none',
        padding: '14px 16px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      },
      '.Input:focus': {
        border: `2px solid ${roleColors.primary}`,
        boxShadow: `0 0 0 3px ${roleColors.light}`,
      },
      '.Input--invalid': {
        border: '2px solid #dc2626',
        boxShadow: '0 0 0 3px #fef2f2',
      },
      '.Label': {
        fontWeight: '500',
        color: '#374151',
        marginBottom: '8px',
      },
      '.Tab': {
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '12px 16px',
      },
      '.Tab:hover': {
        border: `2px solid ${roleColors.primary}`,
      },
      '.Tab--selected': {
        border: `2px solid ${roleColors.primary}`,
        backgroundColor: roleColors.light,
      },
      '.Error': {
        color: '#dc2626',
        fontSize: '14px',
        marginTop: '8px',
      },
    },
  };

  const options = clientSecret
    ? {
        clientSecret,
        appearance,
      }
    : {
        appearance,
      };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
