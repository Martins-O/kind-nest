'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { X, AlertCircle } from 'lucide-react';

export function WalletErrorHandler() {
  const { error } = useConnect();
  const { isConnecting, isReconnecting } = useAccount();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      let message = 'Failed to connect wallet';
      const errorMsg = error.message.toLowerCase();

      // Email/Social login specific errors
      if (errorMsg.includes('email') || errorMsg.includes('verification')) {
        message = 'Email verification failed. Please check your email and try again.';
      } else if (errorMsg.includes('social') || errorMsg.includes('oauth')) {
        message = 'Social login failed. Please try again or use a different method.';
      } else if (errorMsg.includes('google')) {
        message = 'Google login failed. Please ensure pop-ups are enabled and try again.';
      } else if (errorMsg.includes('github')) {
        message = 'GitHub login failed. Please ensure pop-ups are enabled and try again.';
      } else if (errorMsg.includes('apple')) {
        message = 'Apple login failed. Please ensure pop-ups are enabled and try again.';
      } else if (errorMsg.includes('facebook')) {
        message = 'Facebook login failed. Please ensure pop-ups are enabled and try again.';
      }
      // Wallet specific errors
      else if (errorMsg.includes('user rejected') || errorMsg.includes('user denied')) {
        message = 'Connection rejected. Please try again.';
      } else if (errorMsg.includes('chain') || errorMsg.includes('network')) {
        message = 'Please switch to Morph Holesky network';
      } else if (errorMsg.includes('provider') || errorMsg.includes('wallet not found')) {
        message = 'Wallet not found. Please install a Web3 wallet or use email/social login.';
      } else if (errorMsg.includes('timeout')) {
        message = 'Connection timeout. Please check your internet and try again.';
      } else if (errorMsg.includes('popup') || errorMsg.includes('blocked')) {
        message = 'Pop-up blocked. Please enable pop-ups for this site and try again.';
      }

      setErrorMessage(message);
      setShowError(true);

      // Auto-hide after 5 seconds
      const timeout = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  if (!showError) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-red-500/90 backdrop-blur-lg border border-red-400/50 rounded-2xl shadow-2xl max-w-md p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">Connection Error</h3>
          <p className="text-white/90 text-sm">{errorMessage}</p>
        </div>
        <button
          onClick={() => setShowError(false)}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
