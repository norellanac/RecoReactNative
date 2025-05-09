import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../atoms';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

type StatusBarProps = {
  leftElement?: React.ReactNode;
  onLeftIconPress?: () => void;
  title?: React.ReactNode;
  onTitlePress?: () => void;
  rightElement?: React.ReactNode;
  onRightIconPress?: () => void;
  backgroundColor?: string;
  iconColor?: string;
  containerStyle?: ViewStyle;
  showBackButton?: boolean;
};

const StatusBar: React.FC<StatusBarProps> = ({
  leftElement,
  onLeftIconPress,
  title,
  onTitlePress,
  rightElement,
  onRightIconPress,
  backgroundColor = '#fff',
  iconColor = '#000',
  containerStyle,
  showBackButton = false,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      {showBackButton && (
        <TouchableOpacity
          onPress={onLeftIconPress || navigation.goBack}
          style={styles.iconContainer}
        >
          {leftElement || (
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onTitlePress} style={styles.titleContainer}>
        {title || (
          <Text variant="headline" size="large" color="primary">
            {t('commons.app_name', 'Reco')}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
        {rightElement}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StatusBar;
