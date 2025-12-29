import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface ActionButtonsProps {
  onReject: () => void;
  onLike: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onReject, onLike }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={onReject}>
        <Text style={styles.rejectIcon}>✕</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={onLike}>
        <Text style={styles.likeIcon}>♥</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingVertical: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  likeButton: {
    backgroundColor: '#FE3C72',
  },
  rejectIcon: {
    fontSize: 30,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  likeIcon: {
    fontSize: 30,
    color: '#fff',
  },
});