// lib/ui/useSwipeLogic.ts

import { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useEffect } from 'react';

interface UseSwipeLogicProps {
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  threshold?: number;
}

export const useSwipeLogic = ({ 
  onSwipeRight, 
  onSwipeLeft, 
  threshold = 100 
}: UseSwipeLogicProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Resetear valores cuando se monta el componente
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, []);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const shouldSwipeRight = event.translationX > threshold;
      const shouldSwipeLeft = event.translationX < -threshold;

      if (shouldSwipeRight) {
        // Swipe Right - Guardar
        translateX.value = withTiming(500, { duration: 300 }, () => {
          runOnJS(onSwipeRight)();
          // Resetear después de completar
          translateX.value = 0;
          translateY.value = 0;
        });
      } else if (shouldSwipeLeft) {
        // Swipe Left - Descartar
        translateX.value = withTiming(-500, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)();
          // Resetear después de completar
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        // Volver a la posición original
        translateX.value = withSpring(0, { damping: 20 });
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    // Interpolación para rotación
    const rotation = translateX.value / 10;

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const resetPosition = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  return {
    gesture,
    animatedStyle,
    resetPosition,
  };
};