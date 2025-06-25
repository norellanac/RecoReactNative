import { Alert, Image, Pressable, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/theme/ThemeProvider';
import { Text } from '@/app/components/atoms';
import { getApiImageUrl } from '@/app/utils/Environment';

type CategoryCardProps = {
  title: string;
  icon: string;
};

export default function CategoryCard({
  title = 'CardTitle',
  icon,
}: CategoryCardProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <Pressable onPress={() => Alert.alert('Pressed ', title)}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          margin: 8,
          width: 100,
          height: 105,
          borderRadius: 24,
          backgroundColor: colors.secondary_container,
        }}
      >
        <Image
          source={getApiImageUrl(icon)}
          resizeMode="contain"
          style={{ height: 24, width: 24, marginBottom: 5 }}
        />
        <Text
          variant="body"
          size="small"
          color="primary"
          style={{ paddingVertical: 5, textAlign: 'center' }}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
