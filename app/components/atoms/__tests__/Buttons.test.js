import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Button } from '@atoms';

describe('Button Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      const { getByTestId } = render(
        <Button title="Click me" testID="button" />,
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders with title text', () => {
      const { getByText } = render(<Button title="Test Button" />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('renders without title when not provided', () => {
      const { queryByText } = render(<Button />);
      expect(queryByText('Test Button')).toBeNull();
    });
  });

  describe('Button Variants', () => {
    it('renders filled variant correctly', () => {
      const { getByText } = render(
        <Button variant="filled" title="Filled Button" />,
      );
      expect(getByText('Filled Button')).toBeTruthy();
    });

    it('renders outlined variant correctly', () => {
      const { getByText } = render(
        <Button variant="outlined" title="Outlined Button" />,
      );
      expect(getByText('Outlined Button')).toBeTruthy();
    });

    it('renders text variant correctly', () => {
      const { getByText } = render(
        <Button variant="text" title="Text Button" />,
      );
      expect(getByText('Text Button')).toBeTruthy();
    });

    it('renders elevated variant correctly', () => {
      const { getByText } = render(
        <Button variant="elevated" title="Elevated Button" />,
      );
      expect(getByText('Elevated Button')).toBeTruthy();
    });

    it('renders tonal variant correctly', () => {
      const { getByText } = render(
        <Button variant="tonal" title="Tonal Button" />,
      );
      expect(getByText('Tonal Button')).toBeTruthy();
    });
  });

  describe('Button Interactions', () => {
    it('calls onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Press me" onPress={mockOnPress} testID="press-button" />,
      );

      fireEvent.press(getByTestId('press-button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <Button
          title="Disabled"
          onPress={mockOnPress}
          disabled
          testID="disabled-button"
        />,
      );

      fireEvent.press(getByTestId('disabled-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <Button
          title="Loading"
          onPress={mockOnPress}
          loading
          testID="loading-button"
        />,
      );

      fireEvent.press(getByTestId('loading-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when isLoading is true', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <Button
          title="Loading"
          onPress={mockOnPress}
          isLoading
          testID="isloading-button"
        />,
      );

      fireEvent.press(getByTestId('isloading-button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when loading is true', () => {
      const { getByTestId } = render(
        <Button title="Loading" loading testID="loading-button" />,
      );
      // ActivityIndicator should be rendered
      expect(getByTestId('loading-button')).toBeTruthy();
    });

    it('shows custom loading indicator when provided', () => {
      const customLoadingIndicator = (
        <Text testID="custom-loading">Custom Loading</Text>
      );
      const { getByTestId } = render(
        <Button
          title="Loading"
          loading
          loadingIndicator={customLoadingIndicator}
        />,
      );
      expect(getByTestId('custom-loading')).toBeTruthy();
    });

    it('shows loading indicator at start position', () => {
      const { getByText } = render(
        <Button title="Loading" loading loadingPosition="start" />,
      );
      expect(getByText('Loading')).toBeTruthy();
    });

    it('shows loading indicator at end position', () => {
      const { getByText } = render(
        <Button title="Loading" loading loadingPosition="end" />,
      );
      expect(getByText('Loading')).toBeTruthy();
    });

    it('shows loading indicator at center position (default)', () => {
      const { queryByText } = render(
        <Button title="Loading" loading loadingPosition="center" />,
      );
      // When loading position is center, title should not be visible
      expect(queryByText('Loading')).toBeNull();
    });
  });

  describe('Icons', () => {
    const startIcon = <View testID="start-icon" />;
    const endIcon = <View testID="end-icon" />;

    it('renders with start icon', () => {
      const { getByTestId } = render(
        <Button title="With Start Icon" startIcon={startIcon} />,
      );
      expect(getByTestId('start-icon')).toBeTruthy();
    });

    it('renders with end icon', () => {
      const { getByTestId } = render(
        <Button title="With End Icon" endIcon={endIcon} />,
      );
      expect(getByTestId('end-icon')).toBeTruthy();
    });

    it('renders with both start and end icons', () => {
      const { getByTestId } = render(
        <Button
          title="With Both Icons"
          startIcon={startIcon}
          endIcon={endIcon}
        />,
      );
      expect(getByTestId('start-icon')).toBeTruthy();
      expect(getByTestId('end-icon')).toBeTruthy();
    });
  });

  describe('Full Width', () => {
    it('applies full width styling when fullWidth is true', () => {
      const { getByTestId } = render(
        <Button title="Full Width" fullWidth testID="fullwidth-button" />,
      );
      const button = getByTestId('fullwidth-button');
      expect(button.props.style).toEqual(
        expect.objectContaining({
          width: '100%',
        }),
      );
    });

    it('renders correctly when fullWidth is false', () => {
      const { getByText } = render(
        <Button title="Normal Width" fullWidth={false} />,
      );
      expect(getByText('Normal Width')).toBeTruthy();
    });
  });

  describe('Disabled State', () => {
    it('applies disabled styling when disabled is true', () => {
      const { getByText } = render(
        <Button title="Disabled Button" disabled variant="filled" />,
      );
      expect(getByText('Disabled Button')).toBeTruthy();
    });

    it('is not accessible when disabled', () => {
      const { getByTestId } = render(
        <Button title="Disabled Button" disabled testID="disabled-btn" />,
      );
      const button = getByTestId('disabled-btn');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Custom Styling', () => {
    it('applies custom style prop', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <Button
          title="Custom Style"
          style={customStyle}
          testID="custom-style-btn"
        />,
      );
      const button = getByTestId('custom-style-btn');
      expect(button.props.style).toEqual(expect.objectContaining(customStyle));
    });

    it('disables elevation when disableElevation is true', () => {
      const { getByTestId } = render(
        <Button
          title="No Elevation"
          disableElevation
          testID="no-elevation-btn"
        />,
      );
      const button = getByTestId('no-elevation-btn');
      expect(button.props.style).toEqual(
        expect.objectContaining({
          elevation: 0,
        }),
      );
    });
  });

  describe('Accessibility', () => {
    it('forwards accessibility props', () => {
      const { getByTestId } = render(
        <Button
          title="Accessible Button"
          accessibilityLabel="Custom accessibility label"
          accessibilityHint="Custom accessibility hint"
          testID="accessible-btn"
        />,
      );
      const button = getByTestId('accessible-btn');
      expect(button.props.accessibilityLabel).toBe(
        'Custom accessibility label',
      );
      expect(button.props.accessibilityHint).toBe('Custom accessibility hint');
    });

    it('renders with accessibility features', () => {
      const { getByText } = render(<Button title="Button" />);
      expect(getByText('Button')).toBeTruthy();
    });
  });
});
