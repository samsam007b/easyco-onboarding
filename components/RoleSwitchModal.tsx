'use client'

import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingHouse from '@/components/ui/LoadingHouse';

interface RoleSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  currentRole: string
  newRole: string
  isLoading?: boolean
}

const ROLE_LABELS: Record<string, string> = {
  searcher: 'Searcher',
  owner: 'Owner',
  resident: 'Resident',
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  searcher: 'You\'ll access features for finding and matching with coliving spaces',
  owner: 'You\'ll access features for listing and managing properties',
  resident: 'You\'ll access features for connecting with your coliving community',
}

export default function RoleSwitchModal({
  isOpen,
  onClose,
  onConfirm,
  currentRole,
  newRole,
  isLoading = false,
}: RoleSwitchModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white superellipse-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#9c5698]/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#9c5698]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#9c5698]">
                  Switch Role?
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Change from {ROLE_LABELS[currentRole]} to {ROLE_LABELS[newRole]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            {/* Warning Banner */}
            <div className="bg-yellow-50 border border-yellow-200 superellipse-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 text-sm mb-1">
                  Important Information
                </h3>
                <p className="text-sm text-yellow-800">
                  Your current {ROLE_LABELS[currentRole]} profile will be saved. You can switch back anytime without losing your data.
                </p>
              </div>
            </div>

            {/* What will happen */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">What will happen:</h3>

              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-purple-50 superellipse-xl">
                  <div className="w-6 h-6 rounded-full bg-[#9c5698] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Interface Change</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {ROLE_DESCRIPTIONS[newRole]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 superellipse-xl">
                  <div className="w-6 h-6 rounded-full bg-[#9c5698] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Setup</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      You'll need to complete or enhance your {ROLE_LABELS[newRole]} profile for optimal experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 superellipse-xl border border-green-200">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data Preserved</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      All your {ROLE_LABELS[currentRole]} data will be safely stored and available when you switch back
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-[#9c5698] hover:bg-[#9c5698] text-white py-6 superellipse-2xl font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingHouse size={16} />
                  <span>Switching...</span>
                </div>
              ) : (
                `Switch to ${ROLE_LABELS[newRole]}`
              )}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              className="px-8 py-6 superellipse-2xl font-semibold"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
