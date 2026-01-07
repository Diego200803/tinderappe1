//ProfileCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Profile } from '../types/User';

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: profile.photo }} style={styles.image} />
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.age}>{profile.age}</Text>
        </View>
        
        <View style={styles.distanceRow}>
          <Text style={styles.distance}>📍 {profile.distance} km</Text>
        </View>

        <Text style={styles.bio}>{profile.bio}</Text>

        <View style={styles.interestsContainer}>
          {profile.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  age: {
    fontSize: 20,
    color: '#666',
  },
  distanceRow: {
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: '#999',
  },
  bio: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FE3C72',
  },
  interestText: {
    color: '#FE3C72',
    fontSize: 12,
    fontWeight: '600',
  },
});