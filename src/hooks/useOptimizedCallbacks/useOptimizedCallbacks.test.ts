import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import {
  useOptimizedCallbacks,
  useStableHandlers,
  useDebouncedCallback,
  useThrottledCallback,
  useMemoizedSelector,
  useStableRef,
} from './useOptimizedCallbacks';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useOptimizedCallbacks', () => {
  describe('GIVEN useOptimizedCallbacks hook', () => {
    it('THEN should return optimized callbacks with referential stability', () => {
      const mockCallbacks = {
        handleClick: vi.fn(),
        handleChange: vi.fn(),
      };

      const { result, rerender } = renderHook(() =>
        useOptimizedCallbacks(mockCallbacks)
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Callbacks should have referential stability
      expect(firstResult.handleClick).toBe(secondResult.handleClick);
      expect(firstResult.handleChange).toBe(secondResult.handleChange);
    });

    it('THEN should call the correct callback when invoked', () => {
      const mockCallbacks = {
        handleClick: vi.fn(),
        handleChange: vi.fn(),
      };

      const { result } = renderHook(() =>
        useOptimizedCallbacks(mockCallbacks)
      );

      act(() => {
        result.current.handleClick('test');
      });

      expect(mockCallbacks.handleClick).toHaveBeenCalledWith('test');
    });

    it('THEN should update when dependencies change', () => {
      const TestComponent = () => {
        const [count, setCount] = useState(0);
        const callbacks = useOptimizedCallbacks({
          handleClick: () => setCount(count + 1),
        });
        return { callbacks, count };
      };

      const { result } = renderHook(() => TestComponent());

      expect(result.current.count).toBe(0);

      act(() => {
        result.current.callbacks.handleClick();
      });

      expect(result.current.count).toBe(1);
    });
  });

  describe('GIVEN useStableHandlers hook', () => {
    it('THEN should return stable handlers that never change', () => {
      const mockHandlers = {
        handleClick: vi.fn(),
        handleChange: vi.fn(),
      };

      const { result, rerender } = renderHook(() =>
        useStableHandlers(mockHandlers)
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Handlers should be stable
      expect(firstResult.handleClick).toBe(secondResult.handleClick);
      expect(firstResult.handleChange).toBe(secondResult.handleChange);
    });
  });

  describe('GIVEN useDebouncedCallback hook', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('THEN should debounce callback execution', () => {
      const mockCallback = vi.fn();
      const { result } = renderHook(() =>
        useDebouncedCallback(mockCallback, 100)
      );

      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Should not be called yet
      expect(mockCallback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Should be called once with the last value
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('test3');
    });
  });

  describe('GIVEN useThrottledCallback hook', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('THEN should throttle callback execution', () => {
      const mockCallback = vi.fn();
      const { result } = renderHook(() =>
        useThrottledCallback(mockCallback, 100)
      );

      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Should be called once immediately
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('test1');

      act(() => {
        vi.advanceTimersByTime(100);
        result.current('test4');
      });

      // Should be called again after throttle period
      expect(mockCallback).toHaveBeenCalledTimes(2);
      expect(mockCallback).toHaveBeenCalledWith('test4');
    });
  });

  describe('GIVEN useMemoizedSelector hook', () => {
    it('THEN should memoize selector results', () => {
      const mockState = { count: 5, name: 'test' };
      const selector = (state: typeof mockState) => state.count * 2;

      const { result, rerender } = renderHook(() =>
        useMemoizedSelector(selector, mockState)
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      // Should return the same result
      expect(firstResult).toBe(secondResult);
      expect(firstResult).toBe(10);
    });
  });

  describe('GIVEN useStableRef hook', () => {
    it('THEN should return a stable ref that updates its current value', () => {
      const { result, rerender } = renderHook(() => useStableRef('initial'));

      expect(result.current.current).toBe('initial');

      act(() => {
        result.current.current = 'updated';
      });

      expect(result.current.current).toBe('updated');

      // Ref object should be stable
      const firstRef = result.current;
      rerender();
      const secondRef = result.current;

      expect(firstRef).toBe(secondRef);
    });
  });
});
