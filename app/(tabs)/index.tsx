import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useMatch } from '../../context/MatchContext';
import { SwipeCard } from '../../components/SwipeCard';
import { ActionButtons } from '../../components/ActionButtons';
import { Profile } from '../../types/User';

export default function HomeScreen() {
  const { profiles, loading, loadProfiles, swipe } = useMatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleSwipeLeft = () => {
    if (currentProfile) {
      swipe(currentProfile.id, 'dislike');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentProfile) {
      swipe(currentProfile.id, 'like');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  if (loading && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FE3C72" />
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🎉</Text>
        <Text style={styles.emptyTitle}>¡No hay más perfiles!</Text>
        <Text style={styles.emptySubtitle}>Vuelve más tarde para ver nuevos matches</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadProfiles}>
          <Text style={styles.reloadButtonText}>Recargar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🔥</Text>
        <Text style={styles.headerTitle}>Tinder</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Próxima tarjeta (fondo) */}
        {nextProfile && (
          <View style={[styles.cardWrapper, styles.nextCard]}>
            <View style={styles.card}>
              <View style={styles.cardPlaceholder} />
            </View>
          </View>
        )}

        {/* Tarjeta actual */}
        <View style={styles.cardWrapper}>
          <SwipeCard
            profile={currentProfile}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </View>
      </View>

      <ActionButtons onReject={handleSwipeLeft} onLike={handleSwipeRight} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {profiles.length - currentIndex} {profiles.length - currentIndex === 1 ? 'perfil' : 'perfiles'} disponibles
        </Text>
      </View>
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
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    fontSize: 32,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FE3C72',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  cardWrapper: {
    position: 'absolute',
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.5,
  },
  card: {
    width: 350,
    height: 580,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  cardPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  footer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
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
    textAlign: 'center',
    marginBottom: 30,
  },
  reloadButton: {
    backgroundColor: '#FE3C72',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});