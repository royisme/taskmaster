// hooks/use-swipe.ts
import { useState, useEffect, useCallback } from "react";

interface SwipeState {
  touchStart: { x: number; y: number } | null;
  touchEnd: { x: number; y: number } | null;
  swiping: boolean;
}

export function useSwipeGesture(onSwipe: (direction: 'left' | 'right') => void) {
  const [swipe, setSwipe] = useState<SwipeState>({
    touchStart: null,
    touchEnd: null,
    swiping: false
  });

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: TouchEvent) => {
    setSwipe(prev => ({
      ...prev,
      touchEnd: null,
      touchStart: { 
        x: e.touches[0].clientX,
        y: e.touches[0].clientY 
      }
    }));
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!swipe.touchStart) return;
    
    const touchEnd = { 
      x: e.touches[0].clientX,
      y: e.touches[0].clientY 
    };

    setSwipe(prev => ({
      ...prev,
      touchEnd,
      swiping: true
    }));
  }, [swipe.touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!swipe.touchStart || !swipe.touchEnd) return;

    const distanceX = swipe.touchStart.x - swipe.touchEnd.x;
    const distanceY = Math.abs(swipe.touchStart.y - swipe.touchEnd.y);
    const isHorizontalSwipe = distanceY < Math.abs(distanceX);

    if (Math.abs(distanceX) > minSwipeDistance && isHorizontalSwipe) {
      if (distanceX > 0) {
        onSwipe('left');
      } else {
        onSwipe('right');
      }
    }

    setSwipe({
      touchStart: null,
      touchEnd: null,
      swiping: false
    });
  }, [swipe.touchStart, swipe.touchEnd, onSwipe]);

  useEffect(() => {
    const element = document.getElementById('timetable-container');
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]); // 添加所有回调函数作为依赖项

  return swipe.swiping;
}