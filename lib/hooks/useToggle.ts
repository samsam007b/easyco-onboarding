import { useState, useCallback } from 'react'

/**
 * Toggle boolean state with helpful utilities
 *
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle(false)
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 * <button onClick={() => setIsOpen(false)}>Close</button>
 *
 * @param initialValue - Initial boolean value
 * @returns [value, toggle, setValue] tuple
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue)

  const toggle = useCallback(() => {
    setValue((v) => !v)
  }, [])

  return [value, toggle, setValue]
}
