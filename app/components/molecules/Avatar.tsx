import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/app/components/atoms';
import { getApiImageUrl } from '@/app/utils/Environment';

interface AvatarProps {
  avatarUrl?: string;
  name?: string;
  lastname?: string;
  size?: number;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatarUrl,
  name,
  lastname,
  size = 54,
  onPress,
}) => {
  const getInitials = (name?: string, lastname?: string) => {
    const n = name?.[0] || '';
    const l = lastname?.[0] || '';
    return (n + l).toUpperCase();
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const initialsContainerStyle = {
    ...avatarStyle,
    backgroundColor: '#EADDFF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  const initialsTextStyle = {
    fontSize: size * 0.35, // Escalar el texto según el tamaño
    fontWeight: 'bold' as const,
    color: '#6750A4',
  };

  if (avatarUrl) {
    return (
      <Image
        source={getApiImageUrl(avatarUrl)}
        style={avatarStyle}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={initialsContainerStyle}>
      <Text style={initialsTextStyle}>{getInitials(name, lastname)}</Text>
    </View>
  );
};
