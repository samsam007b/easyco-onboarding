'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Gift, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  copyToClipboard,
  getWhatsAppShareUrl,
  getEmailShareUrl,
  getFacebookShareUrl,
} from '@/lib/services/referral-service';

interface ReferralCodeCardProps {
  code: string;
  shareUrl: string;
  userName?: string;
  variant?: 'default' | 'compact';
}

export function ReferralCodeCard({
  code,
  shareUrl,
  userName,
  variant = 'default',
}: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      toast.success('Code copié !');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      toast.success('Lien copié !');
    } else {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleWhatsApp = () => {
    window.open(getWhatsAppShareUrl(code, shareUrl, userName), '_blank');
  };

  const handleEmail = () => {
    window.location.href = getEmailShareUrl(code, shareUrl, userName);
  };

  const handleFacebook = () => {
    window.open(getFacebookShareUrl(shareUrl), '_blank');
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-owner-50 to-purple-50 rounded-xl border border-owner-200">
        <div className="p-2 bg-owner-100 rounded-lg">
          <Gift className="w-5 h-5 text-owner-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600">Votre code</p>
          <p className="font-bold text-owner-700 tracking-wider">{code}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyCode}
          className="shrink-0"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-owner-600 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Votre Code de Parrainage</h3>
        </div>
        <p className="text-white/80 text-sm">
          Partagez ce code avec vos amis pour gagner des mois gratuits !
        </p>
      </div>

      {/* Code Display */}
      <div className="p-6">
        <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mb-6">
          <span className="text-3xl font-bold text-owner-700 tracking-[0.3em] font-mono">
            {code}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyCode}
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Rewards Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-orange-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-orange-600">+2</p>
            <p className="text-sm text-gray-600">mois offerts</p>
            <p className="text-xs text-gray-500 mt-1">pour un résident invité</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-purple-600">+3</p>
            <p className="text-sm text-gray-600">mois offerts</p>
            <p className="text-xs text-gray-500 mt-1">pour un propriétaire invité</p>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Copier le lien d&apos;invitation
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="flex-1 gap-2 hover:bg-green-50 hover:border-green-300"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp
            </Button>
            <Button
              onClick={handleEmail}
              variant="outline"
              className="flex-1 gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              Email
            </Button>
            <Button
              onClick={handleFacebook}
              variant="outline"
              className="flex-1 gap-2 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
