'use client';

import { Users, Home as HomeIcon, Key, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const demoAccounts = [
  {
    role: 'Searcher',
    description: 'Looking for a coliving space',
    email: 'demo.searcher@easyco.demo',
    password: 'Demo2024!',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
  },
  {
    role: 'Owner',
    description: 'Property owner managing listings',
    email: 'demo.owner@easyco.demo',
    password: 'Demo2024!',
    icon: HomeIcon,
    color: 'from-blue-500 to-blue-600',
  },
  {
    role: 'Resident',
    description: 'Current resident in a coliving',
    email: 'demo.resident@easyco.demo',
    password: 'Demo2024!',
    icon: Key,
    color: 'from-orange-500 to-orange-600',
  },
];

export default function DemoCredentials({ onQuickLogin }: { onQuickLogin?: (email: string, password: string) => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 border-2 border-yellow-300 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-lg">🎭</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Demo Test Accounts</h3>
      </div>

      <p className="text-sm text-gray-700 mb-4">
        Use these credentials to test different user roles. All data is fictional and will be reset regularly.
      </p>

      <div className="space-y-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <div
              key={account.role}
              className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{account.role}</h4>
                    {onQuickLogin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onQuickLogin(account.email, account.password)}
                        className="text-xs"
                      >
                        Quick Login
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{account.description}</p>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 truncate">
                        {account.email}
                      </code>
                      <button
                        onClick={() => copyToClipboard(account.email, `${account.role}-email`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy email"
                      >
                        {copiedField === `${account.role}-email` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {account.password}
                      </code>
                      <button
                        onClick={() => copyToClipboard(account.password, `${account.role}-password`)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy password"
                      >
                        {copiedField === `${account.role}-password` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Click "Quick Login" to automatically fill credentials, or copy them manually.
        </p>
      </div>
    </div>
  );
}
