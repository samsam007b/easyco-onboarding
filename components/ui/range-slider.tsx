'use client';

import * as React from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  step,
  value,
  onValueChange,
  className = '',
}: RangeSliderProps) {
  const [minValue, maxValue] = value;

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    onValueChange([newMin, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    onValueChange([minValue, newMax]);
  };

  return (
    <div className={`relative h-2 ${className}`}>
      {/* Track background */}
      <div className="absolute w-full h-2 bg-gray-200 rounded-full" />

      {/* Active range */}
      <div
        className="absolute h-2 bg-searcher-600 rounded-full"
        style={{
          left: `${minPercent}%`,
          right: `${100 - maxPercent}%`,
        }}
      />

      {/* Min thumb slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
                   [&::-webkit-slider-thumb]:pointer-events-auto
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-searcher-600
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-moz-range-thumb]:pointer-events-auto
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-white
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-searcher-600
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:shadow-md"
      />

      {/* Max thumb slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none
                   [&::-webkit-slider-thumb]:pointer-events-auto
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-white
                   [&::-webkit-slider-thumb]:border-2
                   [&::-webkit-slider-thumb]:border-searcher-600
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-moz-range-thumb]:pointer-events-auto
                   [&::-moz-range-thumb]:appearance-none
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-white
                   [&::-moz-range-thumb]:border-2
                   [&::-moz-range-thumb]:border-searcher-600
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:shadow-md"
      />
    </div>
  );
}
