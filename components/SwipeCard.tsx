import React from 'react';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipeLeft, onSwipeRight }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe detectado
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 300 });
        
        if (direction > 0) {
          runOnJS(onSwipeRight)();
        } else {
          runOnJS(onSwipeLeft)();
        }
      } else {
        // Volver a la posición original
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15]
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
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
          <Text style={styles.stampText}>LIKE</Text>
        </Animated.View>

        {/* Stamp NOPE */}
        <Animated.View style={[styles.stamp, styles.nopeStamp, nopeStampStyle]}>
          <Text style={styles.stampText}>NOPE</Text>
        </Animated.View>

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.age}>{profile.age}</Text>
          </View>
          
          <View style={styles.distanceRow}>
            <Text style={styles.distance}>📍 {profile.distance} km</Text>
          </View>

          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
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
    width: SCREEN_WIDTH - 40,
    height: 580,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  stamp: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 4,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    padding: 20,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  age: {
    fontSize: 22,
    color: '#666',
  },
  distanceRow: {
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: '#999',
  },
  bio: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FE3C72',
  },
  interestText: {
    color: '#FE3C72',
    fontSize: 12,
    fontWeight: '600',
  },
});