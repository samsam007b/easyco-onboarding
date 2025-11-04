'use client';

import { useState } from 'react';
import { PropertyCosts, RoomWithTotal } from '@/types/room.types';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CostBreakdownCardProps {
  selectedRoom: RoomWithTotal;
  costs: PropertyCosts;
  className?: string;
}

export default function CostBreakdownCard({
  selectedRoom,
  costs,
  className
}: CostBreakdownCardProps) {
  const [showUtilitiesDetail, setShowUtilitiesDetail] = useState(false);
  const [showSharedLivingDetail, setShowSharedLivingDetail] = useState(false);

  const totalMonthly = selectedRoom.price + costs.utilities.total + costs.shared_living.total;

  return (
    <Card className={cn("border-2 border-orange-200", className)}>
      <CardContent className="p-0">
        {/* Room Price */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">Loyer chambre</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">€{selectedRoom.price}</span>
              <span className="text-sm text-gray-500">/mois</span>
            </div>
          </div>
          {selectedRoom.room_name && (
            <div className="text-xs text-gray-500 mt-1">{selectedRoom.room_name}</div>
          )}
        </div>

        {/* Utilities (Charges) */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setShowUtilitiesDetail(!showUtilitiesDetail)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">+ Charges</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">€{costs.utilities.total}</span>
              {showUtilitiesDetail ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {/* Utilities Breakdown */}
          {showUtilitiesDetail && costs.utilities.breakdown && (
            <div className="px-4 pb-4 space-y-2 bg-gray-50">
              {costs.utilities.breakdown.electricity !== undefined && costs.utilities.breakdown.electricity > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Électricité</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.electricity}</span>
                </div>
              )}
              {costs.utilities.breakdown.water !== undefined && costs.utilities.breakdown.water > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Eau</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.water}</span>
                </div>
              )}
              {costs.utilities.breakdown.heating !== undefined && costs.utilities.breakdown.heating > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Chauffage</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.heating}</span>
                </div>
              )}
              {costs.utilities.breakdown.internet !== undefined && costs.utilities.breakdown.internet > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Internet</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.internet}</span>
                </div>
              )}
              {costs.utilities.breakdown.trash !== undefined && costs.utilities.breakdown.trash > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Ordures</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.trash}</span>
                </div>
              )}
              {costs.utilities.breakdown.other !== undefined && costs.utilities.breakdown.other > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">• Autres</span>
                  <span className="text-gray-700">€{costs.utilities.breakdown.other}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Shared Living Costs (Vie Commune) */}
        {costs.shared_living.total > 0 && (
          <div className="border-b border-gray-200">
            <button
              onClick={() => setShowSharedLivingDetail(!showSharedLivingDetail)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">+ Vie commune</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">€{costs.shared_living.total}</span>
                {showSharedLivingDetail ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Shared Living Breakdown */}
            {showSharedLivingDetail && costs.shared_living.breakdown && (
              <div className="px-4 pb-4 space-y-2 bg-gray-50">
                {costs.shared_living.breakdown.cleaning_service !== undefined && costs.shared_living.breakdown.cleaning_service > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Femme de ménage</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.cleaning_service}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.wifi !== undefined && costs.shared_living.breakdown.wifi > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• WiFi fibre</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.wifi}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.cleaning_supplies !== undefined && costs.shared_living.breakdown.cleaning_supplies > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Produits ménagers</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.cleaning_supplies}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.groceries !== undefined && costs.shared_living.breakdown.groceries > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Courses communes</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.groceries}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.maintenance !== undefined && costs.shared_living.breakdown.maintenance > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Maintenance</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.maintenance}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.insurance !== undefined && costs.shared_living.breakdown.insurance > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Assurance habitation</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.insurance}</span>
                  </div>
                )}
                {costs.shared_living.breakdown.other !== undefined && costs.shared_living.breakdown.other > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">• Autres</span>
                    <span className="text-gray-700">€{costs.shared_living.breakdown.other}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Total Monthly */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">TOTAL MENSUEL</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">€{totalMonthly}</div>
              <div className="text-xs text-gray-600">par mois</div>
            </div>
          </div>
        </div>

        {/* Deposit Info */}
        {costs.deposit && (
          <div className="p-4 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900 font-medium">Dépôt de garantie</span>
              </div>
              <span className="text-blue-900 font-semibold">€{costs.deposit}</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">À payer une seule fois (remboursable)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
