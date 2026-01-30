'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export type Role = 'searcher' | 'resident' | 'owner';

interface RoleSwitcherProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  className?: string;
}

const roles: { id: Role; label: string; color: string }[] = [
  { id: 'searcher', label: 'Je cherche', color: 'var(--searcher-primary)' },
  { id: 'resident', label: "J'habite", color: 'var(--resident-primary)' },
  { id: 'owner', label: 'Je loue', color: 'var(--owner-primary)' },
];

export default function RoleSwitcher({
  activeRole,
  onRoleChange,
  className
}: RoleSwitcherProps) {
  const { resolvedTheme } = useTheme();

  const activeIndex = roles.findIndex(r => r.id === activeRole);
  const activeColor = roles[activeIndex]?.color || roles[0].color;

  return (
    <div
      className={cn(
        "relative flex p-1 rounded-xl",
        resolvedTheme === 'dark' ? 'bg-white/5' : 'bg-gray-100',
        className
      )}
    >
      {/* Sliding pill indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-[10px] shadow-lg"
        initial={false}
        animate={{
          x: `calc(${activeIndex * 100}% + ${activeIndex * 0}px)`,
          backgroundColor: activeColor,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        style={{
          width: `calc(${100 / roles.length}% - 0.166rem)`,
          left: '0.25rem',
        }}
      />

      {/* Role buttons */}
      {roles.map((role) => {
        const isActive = activeRole === role.id;

        return (
          <button
            key={role.id}
            onClick={() => onRoleChange(role.id)}
            className={cn(
              "relative z-10 flex-1 px-4 py-2 text-sm font-semibold rounded-[10px] transition-colors whitespace-nowrap",
              isActive
                ? "text-white"
                : resolvedTheme === 'dark'
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-900"
            )}
          >
            {role.label}
          </button>
        );
      })}
    </div>
  );
}
