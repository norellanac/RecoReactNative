import { Alert, Pressable, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/theme/ThemeProvider';
import { Text } from '@/app/components/atoms';

type CategoryCardProps = {
  title: string;
  icon: React.ReactNode;
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
        {icon || <Ionicons name={'home'} size={24} color={colors.primary} />}
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
