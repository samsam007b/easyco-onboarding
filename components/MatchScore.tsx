'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  DollarSign,
  MapPin,
  Heart,
  Home,
  Calendar,
  Clock,
  Info,
  AlertTriangle,
} from 'lucide-react';
import type { MatchResult } from '@/lib/services/matching-service';
import { getMatchQuality } from '@/lib/services/matching-service';

interface MatchScoreProps {
  matchResult: MatchResult;
  variant?: 'compact' | 'detailed';
  showBreakdown?: boolean;
}

export function MatchScore({ matchResult, variant = 'compact', showBreakdown = false }: MatchScoreProps) {
  const quality = getMatchQuality(matchResult.score);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getScoreColor(matchResult.score)}`}>
        <TrendingUp className="w-4 h-4" />
        <span className="font-semibold text-sm">{matchResult.score}% Match</span>
      </div>
    );
  }

  return (
    <Card className="border-l-4" style={{ borderLeftColor: `var(--${quality.color}-500, #3b82f6)` }}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className={`w-5 h-5 ${getScoreColor(matchResult.score).split(' ')[0]}`} />
              <h3 className="font-semibold text-lg">{quality.label}</h3>
            </div>
            <p className="text-sm text-gray-600">{quality.description}</p>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(matchResult.score).split(' ')[0]}`}>
            {matchResult.score}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full ${getProgressColor(matchResult.score)} transition-all duration-500`}
            style={{ width: `${matchResult.score}%` }}
          />
        </div>

        {/* Breakdown */}
        {showBreakdown && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Score Breakdown</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <BreakdownItem
                icon={<DollarSign className="w-4 h-4" />}
                label="Budget"
                score={matchResult.breakdown.budget}
                max={25}
              />
              <BreakdownItem
                icon={<MapPin className="w-4 h-4" />}
                label="Location"
                score={matchResult.breakdown.location}
                max={20}
              />
              <BreakdownItem
                icon={<Heart className="w-4 h-4" />}
                label="Lifestyle"
                score={matchResult.breakdown.lifestyle}
                max={20}
              />
              <BreakdownItem
                icon={<Home className="w-4 h-4" />}
                label="Features"
                score={matchResult.breakdown.features}
                max={15}
              />
              <BreakdownItem
                icon={<Calendar className="w-4 h-4" />}
                label="Timing"
                score={matchResult.breakdown.timing}
                max={10}
              />
              <BreakdownItem
                icon={<Clock className="w-4 h-4" />}
                label="Duration"
                score={matchResult.breakdown.duration}
                max={10}
              />
            </div>
          </div>
        )}

        {/* Insights */}
        {matchResult.insights.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-medium text-gray-700">Why this matches:</p>
            </div>
            <ul className="space-y-1">
              {matchResult.insights.map((insight, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {matchResult.warnings.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <p className="text-xs font-medium text-gray-700">Things to consider:</p>
            </div>
            <ul className="space-y-1">
              {matchResult.warnings.map((warning, idx) => (
                <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BreakdownItem({
  icon,
  label,
  score,
  max,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  max: number;
}) {
  const percentage = (score / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  return (
    <div className="flex items-center justify-between p-2 rounded bg-gray-50">
      <div className="flex items-center gap-2">
        <div className={`p-1 rounded ${getColor()}`}>{icon}</div>
        <span className="text-gray-700">{label}</span>
      </div>
      <span className="font-medium text-gray-900">
        {Math.round(score)}/{max}
      </span>
    </div>
  );
}

export default MatchScore;
