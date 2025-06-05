import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../atoms';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import RecoLogo from '@/app/assets/img/Reco_logo.png';

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
  backText?: string;
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
      {showBackButton ? (
        <TouchableOpacity
          onPress={onLeftIconPress || navigation.goBack}
          style={styles.iconContainer}
        >
          {leftElement || (
            <Ionicons name="arrow-back" size={24} color={iconColor} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconContainer} />
      )}
      <TouchableOpacity onPress={onTitlePress} style={styles.titleContainer}>
        {title || (
          <Image
            source={RecoLogo}
            style={{
              width: 100,
              height: 28,
              resizeMode: 'contain',
              marginTop: 5,
              marginBottom: 5,
            }}
            accessibilityLabel="Reco logo"
          />
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
