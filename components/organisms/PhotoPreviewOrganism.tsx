import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { Button } from '../atoms/Button';
import type { GestureType } from 'react-native-gesture-handler';

interface PhotoPreviewOrganismProps {
  photoUri: string;
  gesture: GestureType;
  animatedStyle: any;
  onSave: () => void;
  onDiscard: () => void;
  onBack: () => void;
}

export const PhotoPreviewOrganism: React.FC<PhotoPreviewOrganismProps> = ({
  photoUri,
  gesture,
  animatedStyle,
  onSave,
  onDiscard,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.backButton} onPress={onBack}>← Volver</Text>
        <Text style={styles.title}>Swipe para decidir</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.previewContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.photoWrapper, animatedStyle]}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            
            <View style={styles.swipeIndicators}>
              <View style={styles.leftIndicator}>
                <Text style={styles.indicatorText}>✕</Text>
                <Text style={styles.indicatorLabel}>Descartar</Text>
              </View>
              <View style={styles.rightIndicator}>
                <Text style={styles.indicatorText}>✓</Text>
                <Text style={styles.indicatorLabel}>Guardar</Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>

        <Text style={styles.instructionText}>
          ← Desliza para descartar | Desliza para guardar →
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="✕ Descartar"
          onPress={onDiscard}
          variant="danger"
          style={styles.actionButton}
        />
        <Button
          title="✓ Guardar"
          onPress={onSave}
          variant="primary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoWrapper: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  swipeIndicators: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  leftIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  rightIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  indicatorText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  indicatorLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionButton: {
    flex: 1,
  },
});