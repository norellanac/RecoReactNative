import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { Text } from '../atoms';
import { useTranslation } from 'react-i18next';

type UpdateStatus = 'idle' | 'checking' | 'downloading' | 'ready' | 'upToDate';

export const AppVersion = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<UpdateStatus>('idle');

  const appVersion = Constants.expoConfig?.version ?? '0.0.0';
  const updateId = Updates.updateId;
  const channel = Updates.channel;

  const checkForUpdate = useCallback(async () => {
    if (!Updates.isEnabled) return;

    try {
      setStatus('checking');
      const result = await Updates.checkForUpdateAsync();

      if (result.isAvailable) {
        setStatus('downloading');
        await Updates.fetchUpdateAsync();
        setStatus('ready');
        Alert.alert(
          t('update.title', 'Update Available'),
          t(
            'update.restart_message',
            'A new version has been downloaded. Restart to apply.',
          ),
          [
            {
              text: t('update.later', 'Later'),
              style: 'cancel',
              onPress: () => setStatus('idle'),
            },
            {
              text: t('update.restart', 'Restart'),
              onPress: () => Updates.reloadAsync(),
            },
          ],
        );
      } else {
        setStatus('upToDate');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('idle');
    }
  }, [t]);

  useEffect(() => {
    checkForUpdate();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkForUpdate();
      }
    });

    return () => subscription.remove();
  }, [checkForUpdate]);

  const statusLabel = () => {
    switch (status) {
      case 'checking':
        return t('update.checking', 'Checking for updates...');
      case 'downloading':
        return t('update.downloading', 'Downloading update...');
      case 'ready':
        return t('update.ready', 'Update ready!');
      case 'upToDate':
        return t('update.up_to_date', 'Up to date');
      default:
        return null;
    }
  };

  const label = statusLabel();

  const versionText =
    `v${appVersion}` +
    (channel ? ` (${channel})` : '') +
    (updateId ? ` • ${updateId.slice(0, 8)}` : '');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={checkForUpdate}
        disabled={status === 'checking' || status === 'downloading'}
      >
        <Text
          variant="body"
          size="small"
          color="secondary"
          style={styles.version}
        >
          {versionText}
        </Text>
      </TouchableOpacity>
      {label && (
        <View style={styles.statusRow}>
          {(status === 'checking' || status === 'downloading') && (
            <ActivityIndicator
              size="small"
              color="#625B71"
              style={styles.spinner}
            />
          )}
          <Text
            variant="body"
            size="small"
            color="info"
            style={styles.statusText}
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  version: {
    textAlign: 'center',
    opacity: 0.7,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  spinner: {
    marginRight: 6,
  },
  statusText: {
    textAlign: 'center',
  },
});
