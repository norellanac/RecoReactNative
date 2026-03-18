const commonTextStyles = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
};

export const typography = {
  display: {
    large: {
      ...commonTextStyles,
      fontSize: 57,
      lineHeight: 64,
    },
    medium: {
      ...commonTextStyles,
      fontSize: 45,
      lineHeight: 52,
    },
    small: {
      ...commonTextStyles,
      fontSize: 36,
      lineHeight: 44,
    },
  },
  headline: {
    large: {
      ...commonTextStyles,
      fontSize: 32,
      fontHeight: 40,
    },
    medium: {
      ...commonTextStyles,
      fontSize: 28,
      fontHeight: 36,
    },
    small: {
      ...commonTextStyles,
      fontSize: 24,
      fontHeight: 32,
    },
  },
  title: {
    large: {
      ...commonTextStyles,
      fontSize: 22,
      fontHeight: 28,
    },
    medium: {
      ...commonTextStyles,
      fontSize: 16,
      fontHeight: 24,
    },
    small: {
      ...commonTextStyles,
      fontSize: 14,
      fontHeight: 20,
    },
  },
  label: {
    large: {
      ...commonTextStyles,
      fontSize: 14,
      fontHeight: 20,
    },
    medium: {
      ...commonTextStyles,
      fontSize: 12,
      fontHeight: 16,
    },
    small: {
      ...commonTextStyles,
      fontSize: 11,
      fontHeight: 16,
    },
  },
  body: {
    large: {
      ...commonTextStyles,
      fontSize: 16,
      fontWeight: 24,
    },
    medium: {
      ...commonTextStyles,
      fontSize: 14,
      fontWeight: 20,
    },
    small: {
      ...commonTextStyles,
      fontSize: 12,
      fontWeight: 16,
    },
  },
};
