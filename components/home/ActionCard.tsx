'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  features?: string[];
  gradient: string;
  buttonText?: string;
  onClick: () => void;
  className?: string;
  avatars?: string[]; // For showing user avatars
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  badge,
  features,
  gradient,
  buttonText = 'Get Started',
  onClick,
  className,
  avatars,
}: ActionCardProps) {
  return (
    <Card
      className={cn(
        'superellipse-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden',
        gradient,
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-8 relative">
        {/* Badge */}
        {badge && (
          <Badge className="absolute top-4 right-4 bg-white text-purple-700 font-semibold">
            {badge}
          </Badge>
        )}

        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 superellipse-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 mb-6 leading-relaxed">{description}</p>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {features.map((feature, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                {feature}
              </Badge>
            ))}
          </div>
        )}

        {/* Avatars */}
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-2 mb-6">
            {avatars.slice(0, 5).map((avatar, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
              >
                <img
                  src={avatar}
                  alt={`User ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {avatars.length > 5 && (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  +{avatars.length - 5}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Button */}
        <Button
          className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold superellipse-2xl"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
