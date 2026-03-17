import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '@atoms';

describe('Text Component', () => {
  it('renders correctly with text content', () => {
    const { getByText } = render(
      <Text variant="body" size="medium">
        Loading...
      </Text>,
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders with different variant and size', () => {
    const { getByText } = render(
      <Text variant="headline" size="large">
        Headline Text
      </Text>,
    );
    expect(getByText('Headline Text')).toBeTruthy();
  });
});
