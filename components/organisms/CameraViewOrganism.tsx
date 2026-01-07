import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Button } from '../atoms/Button';

interface CameraViewOrganismProps {
  cameraRef: React.RefObject<CameraView | null>;
  facing: CameraType;
  onToggleFacing: () => void;
  onCapture: () => void;
  onClose: () => void;
}

export const CameraViewOrganism: React.FC<CameraViewOrganismProps> = ({
  cameraRef,
  facing,
  onToggleFacing,
  onCapture,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cámara</Text>
        <View style={styles.placeholder} />
      </View>

      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={onToggleFacing}
          >
            <Text style={styles.flipButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      <View style={styles.captureContainer}>
        <View style={styles.captureRow}>
          <View style={styles.spacer} />
          
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={onCapture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <View style={styles.spacer} />
        </View>
        
        <Text style={styles.instructionText}>
          Toca el botón para capturar
        </Text>
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
  closeButton: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 28,
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 24,
  },
  captureContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    width: 70,
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
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
});