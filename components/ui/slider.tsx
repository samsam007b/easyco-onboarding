import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  leftLabel,
  rightLabel,
  showValue = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Labels and value */}
      {(leftLabel || rightLabel || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {leftLabel && <span className="text-gray-600">{leftLabel}</span>}
          {showValue && (
            <span className="font-semibold text-searcher-700 bg-searcher-100 px-3 py-1 rounded-full">
              {value}/{max}
            </span>
          )}
          {rightLabel && !showValue && <span className="text-gray-600">{rightLabel}</span>}
        </div>
      )}

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-searcher-300 focus:ring-offset-2"
          style={{
            background: `linear-gradient(to right,
              hsl(var(--searcher-600)) 0%,
              hsl(var(--searcher-600)) ${percentage}%,
              #E5E7EB ${percentage}%,
              #E5E7EB 100%)`
          }}
        />

        {/* Slider thumb is handled via CSS */}
        <style jsx>{`
          .slider-input::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: hsl(var(--searcher-600));
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s;
          }

          .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.1);
          }

          .slider-input::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: hsl(var(--searcher-600));
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            border: none;
            transition: transform 0.2s;
          }

          .slider-input::-moz-range-thumb:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>

      {/* Range labels below slider */}
      {leftLabel && rightLabel && (
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

export default Slider;
