'use client';

import { useEffect, useRef } from 'react';
import {
  DEFAULT_HONEYPOT_FIELD,
  HONEYPOT_STYLES,
  getHoneypotFieldProps
} from '@/lib/security/honeypot';

interface HoneypotFieldProps {
  fieldName?: string;
  onLoadTime?: (timestamp: number) => void;
}

/**
 * Hidden honeypot field for bot detection
 *
 * Usage:
 * 1. Add <HoneypotField onLoadTime={setFormLoadTime} /> inside your form
 * 2. Track the honeypot value with a ref or state
 * 3. Validate with validateHoneypotAndTiming on submit
 *
 * @example
 * const [formLoadTime, setFormLoadTime] = useState(0);
 * const honeypotRef = useRef<HTMLInputElement>(null);
 *
 * <form onSubmit={handleSubmit}>
 *   <HoneypotField onLoadTime={setFormLoadTime} />
 *   ...
 * </form>
 *
 * // On submit:
 * const honeypotValue = honeypotRef.current?.value || '';
 * const check = validateHoneypotAndTiming(honeypotValue, formLoadTime);
 * if (check.isBot) { reject... }
 */
export default function HoneypotField({
  fieldName = DEFAULT_HONEYPOT_FIELD,
  onLoadTime
}: HoneypotFieldProps) {
  const hasSetLoadTime = useRef(false);

  useEffect(() => {
    // Set form load timestamp once on mount
    if (!hasSetLoadTime.current && onLoadTime) {
      onLoadTime(Date.now());
      hasSetLoadTime.current = true;
    }
  }, [onLoadTime]);

  const fieldProps = getHoneypotFieldProps(fieldName);

  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Label for accessibility and bot attraction */}
      <label htmlFor={fieldProps.id} style={{ display: 'none' }}>
        {fieldName === 'website' ? 'Website' : fieldName}
      </label>
      <input
        {...fieldProps}
        style={HONEYPOT_STYLES}
      />
    </div>
  );
}

/**
 * Hook for honeypot validation
 */
export function useHoneypot(fieldName: string = DEFAULT_HONEYPOT_FIELD) {
  const formLoadTimeRef = useRef<number>(0);
  const honeypotValueRef = useRef<string>('');

  const setFormLoadTime = (timestamp: number) => {
    formLoadTimeRef.current = timestamp;
  };

  const getHoneypotValue = () => {
    const input = document.getElementById(`hp_${fieldName}`) as HTMLInputElement;
    return input?.value || '';
  };

  const validate = () => {
    const { validateHoneypotAndTiming } = require('@/lib/security/honeypot');
    return validateHoneypotAndTiming(
      getHoneypotValue(),
      formLoadTimeRef.current,
      { honeypotFieldName: fieldName }
    );
  };

  return {
    setFormLoadTime,
    getHoneypotValue,
    validate,
    formLoadTime: formLoadTimeRef,
  };
}
