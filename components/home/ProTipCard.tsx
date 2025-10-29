'use client';

import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ProTipCardProps {
  message: string;
  ctaText: string;
  onCtaClick: () => void;
  progress?: number; // 0-100
}

export function ProTipCard({ message, ctaText, onCtaClick, progress }: ProTipCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-yellow-400 to-yellow-500 border-0">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white mb-3">{message}</p>
            {progress !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/90 mb-2">
                  <span>Profile Completion</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>
            )}
            <Button
              onClick={onCtaClick}
              className="bg-white text-yellow-600 hover:bg-white/90 font-semibold rounded-xl"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
