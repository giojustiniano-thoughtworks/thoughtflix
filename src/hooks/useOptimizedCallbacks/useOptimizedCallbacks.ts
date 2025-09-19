import { useCallback, useRef, useMemo } from 'react';

/**
 * Custom hook for creating optimized callbacks that maintain referential stability
 * while allowing for dependency updates when needed
 */
export const useOptimizedCallbacks = <T extends Record<string, (...args: unknown[]) => unknown>>(
  callbacks: T
): T => {
  const callbacksRef = useRef(callbacks);
  
  // Update callbacks ref when dependencies change
  callbacksRef.current = callbacks;

  // Create optimized callbacks using useMemo instead of useCallback in loop
  return useMemo(() => {
    const optimizedCallbacks = {} as T;
    
    for (const key in callbacks) {
      if (Object.prototype.hasOwnProperty.call(callbacks, key)) {
        optimizedCallbacks[key] = ((...args: unknown[]) => 
          callbacksRef.current[key](...args)
        ) as T[Extract<keyof T, string>];
      }
    }
    
    return optimizedCallbacks;
  }, [callbacks]);
};

/**
 * Custom hook for creating stable event handlers that don't change on every render
 */
export const useStableHandlers = <T extends Record<string, (...args: unknown[]) => unknown>>(
  handlers: T
): T => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  return useMemo(() => {
    const stableHandlers = {} as T;
    
    for (const key in handlers) {
      if (Object.prototype.hasOwnProperty.call(handlers, key)) {
        stableHandlers[key] = ((...args: unknown[]) => 
          handlersRef.current[key](...args)
        ) as T[Extract<keyof T, string>];
      }
    }
    
    return stableHandlers;
  }, [handlers]);
};

/**
 * Custom hook for creating debounced callbacks
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when dependencies change
  callbackRef.current = callback;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  return debouncedCallback;
};

/**
 * Custom hook for creating throttled callbacks
 */
export const useThrottledCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);
  const callbackRef = useRef(callback);
  
  // Update callback ref when dependencies change
  callbackRef.current = callback;

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      }
    },
    [delay]
  ) as T;

  return throttledCallback;
};

/**
 * Custom hook for creating memoized selectors
 */
export const useMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  state: T
): R => {
  return useMemo(() => selector(state), [selector, state]);
};

/**
 * Custom hook for creating stable refs
 */
export const useStableRef = <T>(initialValue: T): React.MutableRefObject<T> => {
  const ref = useRef<T>(initialValue);
  return ref;
};
