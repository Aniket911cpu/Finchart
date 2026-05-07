'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../auth/AuthProvider';
import { apiClient } from '../../lib/api-client';
import { toast } from 'react-hot-toast';

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

interface CheckoutButtonProps {
  priceId: string;
  label: string;
  highlight?: boolean;
}

export function CheckoutButton({ priceId, label, highlight }: CheckoutButtonProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      // Assuming apiClient is configured to send the auth token
      const response = await apiClient.post('/payments/create-checkout-session', {
        priceId,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
        highlight
          ? 'bg-accent-blue hover:bg-accent-blue-hover text-white shadow-[0_0_20px_rgba(41,98,255,0.4)] hover:scale-105'
          : 'bg-white/10 hover:bg-white/20 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? 'Processing...' : label}
    </button>
  );
}
