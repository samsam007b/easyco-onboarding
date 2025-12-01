'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown';
  className?: string;
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple icon toggle
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative p-2.5 rounded-xl transition-all duration-300 group ${className}`}
        style={{
          background: resolvedTheme === 'dark'
            ? 'linear-gradient(135deg, rgba(139, 111, 207, 0.2), rgba(217, 160, 179, 0.2))'
            : 'linear-gradient(135deg, rgba(123, 95, 184, 0.1), rgba(201, 139, 158, 0.1))',
        }}
        aria-label={resolvedTheme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      >
        <div className="relative w-5 h-5">
          {/* Sun icon */}
          <Sun
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              resolvedTheme === 'dark'
                ? 'opacity-0 rotate-90 scale-0'
                : 'opacity-100 rotate-0 scale-100'
            }`}
            style={{ color: '#FFA040' }}
          />
          {/* Moon icon */}
          <Moon
            className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
              resolvedTheme === 'dark'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-0'
            }`}
            style={{ color: '#8B6FCF' }}
          />
        </div>

        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"
          style={{
            background: resolvedTheme === 'dark'
              ? 'linear-gradient(135deg, #8B6FCF40, #D9A0B340)'
              : 'linear-gradient(135deg, #FFA04040, #FFD08040)',
          }}
        />
      </button>
    );
  }

  // Dropdown variant with light/dark/system options
  const options = [
    { value: 'light' as const, label: 'Clair', icon: Sun, color: '#FFA040' },
    { value: 'dark' as const, label: 'Sombre', icon: Moon, color: '#8B6FCF' },
    { value: 'system' as const, label: 'Système', icon: Monitor, color: '#71717A' },
  ];

  const currentOption = options.find(o => o.value === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
        style={{
          background: resolvedTheme === 'dark'
            ? 'rgba(26, 26, 31, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
        }}
        aria-label="Changer de thème"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="w-4 h-4" style={{ color: currentOption.color }} />
        <span
          className="text-sm font-medium"
          style={{ color: resolvedTheme === 'dark' ? '#F5F5F7' : '#374151' }}
        >
          {currentOption.label}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 py-2 rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden"
          style={{
            background: resolvedTheme === 'dark'
              ? 'rgba(26, 26, 31, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${resolvedTheme === 'dark' ? '#2A2A30' : '#E5E7EB'}`,
          }}
        >
          {options.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: isActive
                    ? resolvedTheme === 'dark'
                      ? 'linear-gradient(135deg, rgba(139, 111, 207, 0.2), rgba(217, 160, 179, 0.2))'
                      : 'linear-gradient(135deg, rgba(123, 95, 184, 0.1), rgba(201, 139, 158, 0.1))'
                    : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" style={{ color: option.color }} />
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isActive
                      ? (resolvedTheme === 'dark' ? '#F5F5F7' : '#1F2937')
                      : (resolvedTheme === 'dark' ? '#A1A1AA' : '#6B7280'),
                  }}
                >
                  {option.label}
                </span>
                {isActive && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #7B5FB8, #C98B9E)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
