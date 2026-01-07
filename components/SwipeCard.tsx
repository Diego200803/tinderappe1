import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Profile } from '../types/User';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 380);
const CARD_HEIGHT = Math.min(SCREEN_HEIGHT * 0.62, 520);

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ 
  profile, 
  onSwipeLeft, 
  onSwipeRight, 
  disabled = false 
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hasSwipedRef = React.useRef(false);

  // Reset cuando cambia el perfil
  React.useEffect(() => {
    hasSwipedRef.current = false;
    console.log('🔄 Nueva tarjeta montada:', profile.name);
  }, [profile.id]);

  const completeSwipe = (direction: 'left' | 'right') => {
    // Solo ejecutar una vez
    if (hasSwipedRef.current) {
      console.log('⚠️ Ya se completó el swipe, ignorando');
      return;
    }
    
    hasSwipedRef.current = true;
    console.log(`✅ Swipe ${direction} completado para ${profile.name}`);
    
    if (direction === 'right') {
      onSwipeRight();
    } else {
      onSwipeLeft();
    }
  };

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      if (disabled || hasSwipedRef.current) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (disabled || hasSwipedRef.current) return;
      
      const absX = Math.abs(event.translationX);
      
      if (absX > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        
        translateX.value = withTiming(targetX, { duration: 400 }, (finished) => {
          if (finished) {
            runOnJS(completeSwipe)(direction);
          }
        });
      } else {
        translateX.value = withSpring(0, { damping: 20 });
        translateY.value = withSpring(0, { damping: 20 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-20, 0, 20]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
      [0, 0.5, 1]
    );
    
    return {
      opacity: translateX.value > 0 ? opacity : 0,
    };
  });

  const nopeStampStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2, 0],
      [1, 0.5, 0]
    );
    
    return {
      opacity: translateX.value < 0 ? opacity : 0,
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image source={{ uri: profile.photo }} style={styles.image} />
        
        {/* Stamp LIKE */}
        <Animated.View style={[styles.stamp, styles.likeStamp, likeStampStyle]}>
          <Text style={styles.stampText}>ME GUSTA</Text>
        </Animated.View>

        {/* Stamp NOPE */}
        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStampStyle]}>
          <Text style={styles.stampText}>NOPE</Text>
        </Animated.View>

        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}> {profile.age}</Text>
          </View>
          
          <View style={styles.distanceRow}>
            <Text style={styles.distance}>📍 A {profile.distance} km de distancia</Text>
          </View>

          <Text style={styles.bio} numberOfLines={2}>{profile.bio}</Text>

          <View style={styles.interestsContainer}>
            {profile.interests.slice(0, 3).map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  stamp: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 5,
    borderRadius: 12,
    transform: [{ rotate: '-20deg' }],
    zIndex: 10,
  },
  likeStamp: {
    right: 30,
    borderColor: '#4CAF50',
  },
  nopeStamp: {
    left: 30,
    borderColor: '#FF3B30',
  },
  stampText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    zIndex: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  age: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '400',
  },
  distanceRow: {
    marginBottom: 10,
  },
  distance: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 14,
    lineHeight: 22,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  interestText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});