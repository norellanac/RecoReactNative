import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type ServiceCardProps = {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  onPress: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  price,
  rating,
  reviews,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.rating}>
        ⭐ {rating} ({reviews} reseñas)
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 250,
  },
  imageContainer: {
    paddingBottom: 10,
    width: 250,
    height: 125,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServiceCard;
