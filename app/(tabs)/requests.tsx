import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useMatch } from '../../context/MatchContext';
import { Match } from '../../types/User';

export default function RequestsScreen() {
  const { pendingMatches, loading, loadPendingMatches, respondToMatch } = useMatch();

  useEffect(() => {
    loadPendingMatches();
  }, []);

  const RequestCard = ({ match }: { match: Match }) => {
    const translateX = useSharedValue(0);

    const handleAccept = () => {
      respondToMatch(match.id, 'accept');
    };

    const handleReject = () => {
      respondToMatch(match.id, 'reject');
    };

    const gesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
      })
      .onEnd((event) => {
        if (event.translationX > 100) {
          // Swipe derecha - Aceptar
          translateX.value = withTiming(400, { duration: 300 });
          runOnJS(handleAccept)();
        } else if (event.translationX < -100) {
          // Swipe izquierda - Rechazar
          translateX.value = withTiming(-400, { duration: 300 });
          runOnJS(handleReject)();
        } else {
          translateX.value = withTiming(0);
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    const acceptStyle = useAnimatedStyle(() => ({
      opacity: translateX.value > 0 ? translateX.value / 100 : 0,
    }));

    const rejectStyle = useAnimatedStyle(() => ({
      opacity: translateX.value < 0 ? Math.abs(translateX.value) / 100 : 0,
    }));

    return (
      <View style={styles.cardContainer}>
        {/* Fondo de aceptar */}
        <Animated.View style={[styles.actionBackground, styles.acceptBackground, acceptStyle]}>
          <Text style={styles.actionText}>✓ ACEPTAR</Text>
        </Animated.View>

        {/* Fondo de rechazar */}
        <Animated.View style={[styles.actionBackground, styles.rejectBackground, rejectStyle]}>
          <Text style={styles.actionText}>✕ RECHAZAR</Text>
        </Animated.View>

        {/* Tarjeta */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Image source={{ uri: match.profile.photo }} style={styles.photo} />
            <View style={styles.info}>
              <Text style={styles.name}>{match.profile.name}, {match.profile.age}</Text>
              <Text style={styles.bio}>{match.profile.bio}</Text>
              <Text style={styles.hint}>← Desliza para rechazar | Desliza para aceptar →</Text>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FE3C72" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💌 Solicitudes</Text>
        <Text style={styles.headerSubtitle}>
          {pendingMatches.length} {pendingMatches.length === 1 ? 'solicitud' : 'solicitudes'} pendientes
        </Text>
      </View>

      {pendingMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No hay solicitudes</Text>
          <Text style={styles.emptySubtitle}>Tus likes aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={pendingMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard match={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    padding: 20,
  },
  cardContainer: {
    marginBottom: 20,
    height: 140,
  },
  actionBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBackground: {
    backgroundColor: '#4CAF50',
  },
  rejectBackground: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: 120,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  hint: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
  },
});
