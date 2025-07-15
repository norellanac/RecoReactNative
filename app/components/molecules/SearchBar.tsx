import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
  style?: any;
};

export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  onFilterPress,
  placeholder,
  style,
}) => (
  <View style={[styles.container, style]}>
    <TextInput
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onSubmitEditing={onSubmit}
      startAdornment={<Icon name="search" />}
      endAdornment={
        <View style={{ flexDirection: 'row' }}>
          {value.length > 0 && (
            <Icon name="close" onPress={onClear} style={{ marginRight: 8 }} />
          )}
          <Icon name="options" onPress={onFilterPress} />
        </View>
      }
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 16,
    marginLeft: 10,
    marginRight: 10,
  },
});
