import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useMatch } from '../../context/MatchContext';
import { SwipeCard } from '../../components/SwipeCard';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { profiles, loading, loadProfiles, swipe } = useMatch();
  const [visibleProfiles, setVisibleProfiles] = useState<string[]>([]);
  const isSwipingRef = useRef(false);

  React.useEffect(() => {
    loadProfiles();
  }, []);

  // Cuando vuelves a esta pantalla, desbloquear
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Pantalla enfocada, desbloqueando swipe');
      isSwipingRef.current = false;
      return () => {
        console.log('📱 Pantalla desenfocada');
      };
    }, [])
  );

  // Cuando se cargan los perfiles, crear la lista de IDs visibles
  React.useEffect(() => {
    if (profiles.length > 0 && visibleProfiles.length === 0) {
      setVisibleProfiles(profiles.map(p => p.id));
    }
  }, [profiles]);

  const handleSwipe = useCallback(async (profileId: string, action: 'like' | 'dislike') => {
    // Si ya está haciendo swipe, ignorar
    if (isSwipingRef.current) {
      console.log('⚠️ Swipe en proceso, ignorando');
      return;
    }

    const profile = profiles.find(p => p.id === profileId);
    if (!profile) {
      console.log('❌ Perfil no encontrado');
      return;
    }

    console.log(`🎯 Swipe ${action} en: ${profile.name}`);
    isSwipingRef.current = true;

    try {
      // Guardar el swipe
      await swipe(profileId, action);
      
      // Esperar animación
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remover este perfil de la lista visible
      setVisibleProfiles(prev => prev.filter(id => id !== profileId));
      
      console.log('✅ Perfil removido de la vista');
    } catch (error) {
      console.error('❌ Error en swipe:', error);
    } finally {
      // CRÍTICO: Desbloquear INMEDIATAMENTE sin setTimeout
      isSwipingRef.current = false;
      console.log('🔓 Listo para siguiente swipe');
    }
  }, [profiles, swipe]);

  const handleSwipeLeft = useCallback((profileId: string) => {
    handleSwipe(profileId, 'dislike');
  }, [handleSwipe]);

  const handleSwipeRight = useCallback((profileId: string) => {
    handleSwipe(profileId, 'like');
  }, [handleSwipe]);

  // Obtener perfiles que aún están visibles
  const currentProfiles = profiles.filter(p => visibleProfiles.includes(p.id));
  const currentProfile = currentProfiles[0];
  const nextProfile = currentProfiles[1];

  if (loading && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FE3C72" />
        <Text style={styles.loadingText}>Buscando personas cerca...</Text>
      </View>
    );
  }

  if (!currentProfile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>🎉</Text>
        <Text style={styles.emptyTitle}>¡Wow! Has visto a todos</Text>
        <Text style={styles.emptySubtitle}>
          Vuelve más tarde para descubrir nuevas personas
        </Text>

        <TouchableOpacity
          style={styles.reloadButton}
          onPress={() => {
            setVisibleProfiles([]);
            isSwipingRef.current = false;
            loadProfiles();
          }}
        >
          <Text style={styles.reloadButtonText}>🔄 Recargar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>🔥</Text>
          <Text style={styles.appName}>FindLove</Text>
        </View>
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* Próxima tarjeta */}
        {nextProfile && (
          <View style={[styles.cardWrapper, styles.nextCard]}>
            <View style={styles.cardPlaceholder} />
          </View>
        )}

        {/* Tarjeta actual */}
        <View style={styles.cardWrapper}>
          <SwipeCard
            key={`card-${currentProfile.id}`}
            profile={currentProfile}
            onSwipeLeft={() => handleSwipeLeft(currentProfile.id)}
            onSwipeRight={() => handleSwipeRight(currentProfile.id)}
            disabled={isSwipingRef.current}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.counterBadge}>
          <Text style={styles.counterIcon}>👥</Text>
          <Text style={styles.counterText}>
            {currentProfiles.length}{' '}
            {currentProfiles.length === 1 ? 'persona' : 'personas'}
          </Text>
        </View>
      </View>

      {/* Debug */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Visible: {currentProfiles.length}
          </Text>
          <Text style={styles.debugText}>
            Actual: {currentProfile.name}
          </Text>
          <Text style={styles.debugText}>
            Swipe: {isSwipingRef.current ? '🔴' : '🟢'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 30,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'web' ? 50 : 60,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FE3C72',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCard: {
    transform: [{ scale: 0.92 }],
    opacity: 0.3,
  },
  cardPlaceholder: {
    width: Math.min(SCREEN_WIDTH * 0.85, 380),
    height: 520,
    backgroundColor: '#d0d0d0',
    borderRadius: 16,
  },
  footer: {
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'web' ? 20 : 30,
    alignItems: 'center',
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  counterIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  counterText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  emptyIcon: {
    fontSize: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  reloadButton: {
    backgroundColor: '#FE3C72',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#FE3C72',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 120 : 130,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  debugText: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 2,
  },
});