import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraLogic } from '../../lib/modules/camera/useCameraLogic';
import { useSwipeLogic } from '../../lib/ui/useSwipeLogic';
import { useGalleryStore } from '../../lib/store/galleryStore';
import { Button } from '../../components/atoms/Button';
import { CameraViewOrganism } from '../../components/organisms/CameraViewOrganism';
import { PhotoPreviewOrganism } from '../../components/organisms/PhotoPreviewOrganism';

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
      router.push('/(tabs)/gallery');
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

  // Resetear posición cuando cambia la foto
  React.useEffect(() => {
    if (capturedPhoto) {
      resetPosition();
    }
  }, [capturedPhoto]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
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

  if (capturedPhoto) {
    return (
      <PhotoPreviewOrganism
        photoUri={capturedPhoto}
        gesture={gesture}
        animatedStyle={animatedStyle}
        onSave={handleSavePhoto}
        onDiscard={handleDiscardPhoto}
        onBack={resetPhoto}
      />
    );
  }

  return (
    <CameraViewOrganism
      cameraRef={cameraRef}
      facing={facing}
      onToggleFacing={toggleCameraFacing}
      onCapture={takePicture}
      onClose={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});