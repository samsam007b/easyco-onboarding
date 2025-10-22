import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[]; // list of strings
  className?: string;
  placeholder?: string;
}

export const AutosuggestSearch: React.FC<Props> = ({ value, onChange, suggestions, className = "", placeholder }) => {
  const [show, setShow] = useState(false);
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 6);
    return suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 6);
  }, [value, suggestions]);

  useEffect(() => {
    setShow(filtered.length > 0 && value.length > 0);
  }, [filtered, value]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-easyCo-gray-dark)] w-5 h-5" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setShow(true)}
          onBlur={() => setTimeout(() => setShow(false), 150)}
          className="pl-12 pr-4 py-3 border-2 border-[var(--color-easyCo-gray-medium)] rounded-2xl focus:border-[var(--color-easyCo-purple)] bg-white w-full"
        />
      </div>

      {show && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white shadow rounded-xl overflow-hidden">
          {filtered.map((s) => (
            <button
              key={s}
              onMouseDown={() => onChange(s)} // onMouseDown to avoid blur
              className="w-full text-left px-4 py-2 hover:bg-[var(--color-easyCo-gray-light)] text-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};