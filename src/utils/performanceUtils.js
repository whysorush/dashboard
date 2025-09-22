// Performance optimization utilities
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook for performance optimization
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Throttle hook for performance optimization
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Memoized selector for context optimization
export const createSelector = (selector) => {
  let lastResult = null;
  let lastDeps = null;
  
  return (state) => {
    const deps = selector(state);
    
    if (lastDeps === null || !shallowEqual(deps, lastDeps)) {
      lastResult = selector(state);
      lastDeps = deps;
    }
    
    return lastResult;
  };
};

// Shallow equality check
export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options, hasIntersected]);

  return [ref, isIntersecting, hasIntersected];
};

// Virtual scrolling hook
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

// Performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const renderStart = useRef(performance.now());
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (renderTime > 16) { // More than one frame
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  });
  
  useEffect(() => {
    renderStart.current = performance.now();
  });
};

// Memoized component factory
export const createMemoizedComponent = (Component, propsAreEqual) => {
  return React.memo(Component, propsAreEqual);
};

// Batch state updates
export const useBatchedUpdates = () => {
  const [, forceUpdate] = useState({});
  const updatesRef = useRef([]);
  const timeoutRef = useRef(null);
  
  const batchedUpdate = useCallback((updateFn) => {
    updatesRef.current.push(updateFn);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const updates = updatesRef.current;
      updatesRef.current = [];
      
      // Batch all updates
      updates.forEach(update => update());
      forceUpdate({});
    }, 0);
  }, []);
  
  return batchedUpdate;
};

// Preload components
export const preloadComponent = (importFn) => {
  return () => {
    const componentPromise = importFn();
    componentPromise.then(module => {
      // Preload related components
      if (module.preload) {
        module.preload();
      }
    });
    return componentPromise;
  };
};

// Resource hints for better loading
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;
  
  const hints = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
};

// Bundle analyzer helper
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Bundle Analysis');
    console.log('Performance metrics:', {
      navigation: performance.getEntriesByType('navigation')[0],
      paint: performance.getEntriesByType('paint'),
    });
    console.groupEnd();
  }
};
