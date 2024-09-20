import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from './../../theme/ThemeProvider';

type TypographyVariant = 'display' | 'headline' | 'title' | 'label' | 'body';
type TypographySize = 'large' | 'medium' | 'small';
type TypographyColor = 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';


type TextProps = RNTextProps & {
  variant: TypographyVariant;
  size: TypographySize;
  children: string;
  color?: TypographyColor;
};

export const Text = ({
  variant,
  size,
  children,
  color,
  ...props
}: TextProps) => {
  const { theme } = useTheme();
  const { colors, textVariants } = theme;
  const variantStyles = textVariants[variant][size];

  return (
    <RNText style={[variantStyles, { color: colors[color] }]} {...props}>
      {children}
    </RNText>
  );
};
