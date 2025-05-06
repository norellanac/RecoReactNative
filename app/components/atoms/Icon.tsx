import React from 'react';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
} from '@expo/vector-icons';
import { useTheme } from '@/app/theme/ThemeProvider';

type IconFamily = 'Ionicons' | 'MaterialIcons' | 'FontAwesome' | 'Entypo';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  family?: IconFamily;
};

const iconFamilies: Record<IconFamily, React.ComponentType<VectorIconProps>> = {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
};

export const Icon = ({
  name,
  size = 24,
  color,
  onPress,
  family = 'Ionicons',
}: IconProps) => {
  const theme = useTheme();
  const { colors } = theme.theme;

  const IconComponent = iconFamilies[family] || Ionicons;

  return (
    <IconComponent
      name={name}
      size={size}
      onPress={onPress}
      color={color || colors.primary}
    />
  );
};
