'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMatching } from '@/lib/hooks/use-matching';
import { createClient } from '@/lib/auth/supabase-client';
import type { UserPreferences } from '@/lib/services/matching-service';
import { getMatchQuality } from '@/lib/services/matching-service';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Settings,
  DollarSign,
  MapPin,
  Home,
  Calendar,
  Users,
  Heart,
  Sparkles,
  Save,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

export default function PreferencesEditorPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<UserPreferences>>({});
  const [previewScore, setPreviewScore] = useState<number | null>(null);

  const {
    userPreferences,
    propertiesWithMatches,
    isLoading: matchingLoading,
    loadUserPreferences,
    updateUserPreferences,
    getTopMatches,
  } = useMatching(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      setFormData(userPreferences);
    }
  }, [userPreferences]);

  // Calculate preview score based on form changes
  useEffect(() => {
    if (propertiesWithMatches.length > 0 && formData) {
      // Get average score of top 5 matches with current preferences
      const topFive = propertiesWithMatches.slice(0, 5);
      const avgScore = topFive.reduce((sum, p) => sum + (p.matchResult?.score || 0), 0) / topFive.length;
      setPreviewScore(Math.round(avgScore));
    }
  }, [formData, propertiesWithMatches]);

  const handleInputChange = (field: keyof UserPreferences, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const success = await updateUserPreferences(formData);
      if (success) {
        toast.success(getHookTranslation('preferences', 'saved'));
        setHasChanges(false);
      } else {
        toast.error(getHookTranslation('preferences', 'saveFailed'));
      }
    } catch (error) {
      toast.error(getHookTranslation('preferences', 'errorSaving'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(userPreferences || {});
    setHasChanges(false);
    toast.info(getHookTranslation('preferences', 'changesReset'));
  };

  if (loading || matchingLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingHouse size={64} />
            <p className="mt-4 text-gray-600">Loading your preferences...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const topMatches = getTopMatches(70);
  const quality = previewScore ? getMatchQuality(previewScore) : null;

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-6 h-6 text-[#4A148C]" />
          <h1 className="text-3xl font-bold text-gray-900">Matching Preferences</h1>
        </div>
        <p className="text-gray-600">Customize your preferences to get better property matches</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (€/month)
                  </label>
                  <input
                    type="number"
                    value={formData.min_budget || ''}
                    onChange={(e) => handleInputChange('min_budget', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (€/month)
                  </label>
                  <input
                    type="number"
                    value={formData.max_budget || ''}
                    onChange={(e) => handleInputChange('max_budget', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                    placeholder="1500"
                  />
                </div>
              </div>
              {formData.min_budget && formData.max_budget && (
                <p className="text-sm text-gray-600">
                  Budget range: €{formData.min_budget} - €{formData.max_budget} per month
                </p>
              )}
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Location Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Cities (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.preferred_cities?.join(', ') || ''}
                  onChange={(e) => handleInputChange('preferred_cities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                  placeholder="Paris, Lyon, Marseille"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Neighborhoods (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.preferred_neighborhoods?.join(', ') || ''}
                  onChange={(e) => handleInputChange('preferred_neighborhoods', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                  placeholder="Marais, Belleville, Bastille"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Features Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-600" />
                Property Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Bedrooms
                  </label>
                  <select
                    value={formData.min_bedrooms || ''}
                    onChange={(e) => handleInputChange('min_bedrooms', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Bathrooms
                  </label>
                  <select
                    value={formData.min_bathrooms || ''}
                    onChange={(e) => handleInputChange('min_bathrooms', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.furnished || false}
                    onChange={(e) => handleInputChange('furnished', e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-700">Furnished</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.balcony || false}
                    onChange={(e) => handleInputChange('balcony', e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-700">Balcony</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.parking || false}
                    onChange={(e) => handleInputChange('parking', e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-700">Parking</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Lifestyle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.smoking || false}
                    onChange={(e) => handleInputChange('smoking', e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-700">I smoke</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.pets || false}
                    onChange={(e) => handleInputChange('pets', e.target.checked)}
                    className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                  />
                  <span className="text-sm text-gray-700">I have pets</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Timing Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Move-in Date
                </label>
                <input
                  type="date"
                  value={formData.desired_move_in_date || ''}
                  onChange={(e) => handleInputChange('desired_move_in_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Lease Duration (months)
                </label>
                <input
                  type="number"
                  value={formData.desired_lease_duration_months || ''}
                  onChange={(e) => handleInputChange('desired_lease_duration_months', parseInt(e.target.value) || undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A148C] focus:border-transparent"
                  placeholder="12"
                  min="1"
                  max="60"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || saving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Live Preview - Right Side (1 column) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Preview Score Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#4A148C]">
                  <Sparkles className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewScore !== null && quality ? (
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${
                      quality.color === 'green' ? 'text-green-600' :
                      quality.color === 'blue' ? 'text-blue-600' :
                      quality.color === 'yellow' ? 'text-yellow-600' :
                      quality.color === 'orange' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {previewScore}%
                    </div>
                    <Badge variant="secondary" className="mb-3">
                      {quality.label}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Average match score with current preferences
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Update preferences to see live preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Matches Count */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Matches</p>
                    <p className="text-2xl font-bold text-gray-900">{topMatches.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#4A148C]" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Properties with 70%+ compatibility
                </p>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">💡 Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Set realistic budget ranges</li>
                  <li>• Add multiple city options</li>
                  <li>• Be flexible with move-in dates</li>
                  <li>• Save often to see updated matches</li>
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            {topMatches.length > 0 && (
              <Button
                className="w-full"
                onClick={() => router.push('/dashboard/searcher/groups')}
              >
                View {topMatches.length} Top Matches
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
