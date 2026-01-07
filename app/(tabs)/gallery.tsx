import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGalleryStore } from '../../lib/store/galleryStore';
import { Button } from '../../components/atoms/Button';

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, loadPhotos, removePhoto, clearGallery } = useGalleryStore();

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleDeletePhoto = (id: string) => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro que deseas eliminar esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removePhoto(id),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar Galería',
      '¿Estás seguro que deseas eliminar todas las fotos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todas',
          style: 'destructive',
          onPress: clearGallery,
        },
      ]
    );
  };

  const renderPhoto = ({ item }: { item: any }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Galería</Text>
        {photos.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyTitle}>No hay fotos</Text>
          <Text style={styles.emptySubtitle}>
            Toma una foto y desliza a la derecha para guardarla aquí
          </Text>
          <Button
            title="Abrir Cámara"
            onPress={() => router.push('/(tabs)/camera')}
            style={styles.openCameraButton}
          />
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'} guardadas
            </Text>
          </View>
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        </>
      )}

      <View style={styles.footer}>
        <Button
          title="📸 Tomar Foto"
          onPress={() => router.push('/(tabs)/camera')}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  grid: {
    padding: 8,
  },
  photoItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    maxWidth: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  openCameraButton: {
    minWidth: 200,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});