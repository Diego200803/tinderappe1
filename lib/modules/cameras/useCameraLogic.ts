import { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export const useCameraLogic = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.warn('Camera ref not available');
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        console.log('📸 Photo captured:', photo.uri);
        setCapturedPhoto(photo.uri);
        return photo.uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };

  const resetPhoto = () => {
    setCapturedPhoto(null);
  };

  return {
    facing,
    permission,
    requestPermission,
    toggleCameraFacing,
    takePicture,
    cameraRef,
    capturedPhoto,
    resetPhoto,
  };
};