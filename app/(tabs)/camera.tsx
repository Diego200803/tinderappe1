import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCameraLogic } from '../../lib/modules/camera/useCameraLogic';
import { useSwipeLogic } from '../../lib/modules/ui/useSwipeLogic';
import { useGalleryStore } from '../../lib/store/galleryStore';
import { Button } from '../../components/atoms/Button';
import Animated, { GestureDetector } from 'react-native-reanimated';

export default function CameraScreen() {
  const router = useRouter();
  const {
    facing,
    permission,
    requestPermission,
    toggleCameraFacing,
    takePicture,
    cameraRef,
    capturedPhoto,
    resetPhoto,
  } = useCameraLogic();

  const { addPhoto } = useGalleryStore();

  const handleSavePhoto = async () => {
    if (capturedPhoto) {
      await addPhoto(capturedPhoto);
      resetPhoto();
      router.push('/gallery');
    }
  };

  const handleDiscardPhoto = () => {
    resetPhoto();
  };

  const { gesture, animatedStyle, resetPosition } = useSwipeLogic({
    onSwipeRight: handleSavePhoto,
    onSwipeLeft: handleDiscardPhoto,
    threshold: 100,
  });

  // Verificar permisos
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Necesitamos permiso para usar la cámara
        </Text>
        <Button title="Otorgar Permiso" onPress={requestPermission} />
      </View>
    );
  }

  // Vista de foto capturada
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Swipe para decidir</Text>
        </View>

        <View style={styles.previewContainer}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.photoPreview, animatedStyle]}>
              <Image source={{ uri: capturedPhoto }} style={styles.photo} />
              
              {/* Indicadores de swipe */}
              <View style={styles.swipeIndicators}>
                <View style={styles.leftIndicator}>
                  <Text style={styles.indicatorText}>✕ Descartar</Text>
                </View>
                <View style={styles.rightIndicator}>
                  <Text style={styles.indicatorText}>✓ Guardar</Text>
                </View>
              </View>
            </Animated.View>
          </GestureDetector>

          <Text style={styles.instructionText}>
            Desliza → para guardar o ← para descartar
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Descartar"
            onPress={handleDiscardPhoto}
            variant="danger"
          />
          <Button
            title="Guardar"
            onPress={handleSavePhoto}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  // Vista de cámara
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cámara</Text>
        <TouchableOpacity onPress={() => router.push('/gallery')}>
          <Text style={styles.galleryButton}>📷 Galería</Text>
        </TouchableOpacity>
      </View>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.flipButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  galleryButton: {
    color: '#FE3C72',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 20,
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 12,
    borderRadius: 30,
  },
  flipButtonText: {
    fontSize: 24,
  },
  captureContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FE3C72',
  },
  captureButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#FE3C72',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: 'hidden',
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
    justifyContent: 'space-between',
  },
  leftIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  rightIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});