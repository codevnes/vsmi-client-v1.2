'use client';

import React from 'react';
import { TimeRangeOption } from './QindexChart';
import { Button } from '@/components/ui/button';

interface TimeRangeSelectorProps {
  timeRange: TimeRangeOption;
  onChange: (newRange: TimeRangeOption) => void;
  className?: string;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  timeRange,
  onChange,
  className = '',
}) => {
  const timeRanges: { value: TimeRangeOption; label: string }[] = [
    { value: '1m', label: '1 Tháng' },
    { value: '3m', label: '3 Tháng' },
    { value: '6m', label: '6 Tháng' },
    { value: '1y', label: '1 Năm' },
    { value: 'all', label: '5 Năm' },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={timeRange === range.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(range.value)}
          className="text-xs font-medium"
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}; 