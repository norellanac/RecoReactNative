import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Screen } from '../../../components/templates';
import { Text } from '../../../components/atoms';
import { LogEntry, logger, LogLevel } from '../../../utils/logging/Logger';

export const LogViewerScreen = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadLogs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'JSON copied to clipboard');
  };

  const loadLogs = async () => {
    const allLogs = await logger.getLogs();
    setLogs(allLogs);
  };

  const handleClear = async () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all local logs?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await logger.clearLogs();
            setLogs([]);
          },
        },
      ],
    );
  };

  const handleExport = async () => {
    if (logs.length === 0) {
      Alert.alert('Info', 'No logs to export');
      return;
    }

    setIsExporting(true);
    try {
      const fileName = `logs_${new Date().getTime()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const logString = JSON.stringify(logs, null, 2);

      await FileSystem.writeAsStringAsync(fileUri, logString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export System Logs',
        });
      } else {
        Alert.alert('Error', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export Error:', error);
      Alert.alert('Export Failed', 'Could not generate log file');
    } finally {
      setIsExporting(false);
    }
  };

  const renderItem = ({ item, index }: { item: LogEntry; index: number }) => {
    const logId = `${item.timestamp}-${index}`;
    const isExpanded = expandedLogs[logId];

    const getLevelColor = (level: LogLevel) => {
      switch (level) {
        case LogLevel.ERROR:
          return '#FF5252';
        case LogLevel.WARN:
          return '#FFD740';
        case LogLevel.HTTP:
          return '#448AFF';
        case LogLevel.NAV:
          return '#7C4DFF';
        default:
          return '#4CAF50';
      }
    };

    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <Text
            variant="label"
            size="small"
            style={[styles.level, { color: getLevelColor(item.level) }]}
          >
            {`[${item.level}]`}
          </Text>
          <Text variant="label" size="small" style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text variant="label" size="medium" style={styles.tag}>
          {item.tag}
        </Text>
        <Text variant="body" size="small" style={styles.message}>
          {item.message}
        </Text>
        {item.data && (
          <TouchableOpacity
            onPress={() => toggleExpand(logId)}
            onLongPress={() =>
              copyToClipboard(JSON.stringify(item.data, null, 2))
            }
            activeOpacity={0.7}
            style={styles.dataContainer}
          >
            <Text variant="label" size="small" style={styles.dataLabel}>
              {`${isExpanded ? '▼ Hide Data' : '▶ Show Data'} (Long press to copy)`}
            </Text>
            {isExpanded && (
              <Text variant="body" size="small" style={styles.dataText}>
                {JSON.stringify(item.data, null, 2)}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text variant="title" size="medium">
            System Logs
          </Text>
        ),
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleExport}
            style={styles.button}
            disabled={isExporting}
          >
            <Text variant="label" size="medium" color="info">
              {isExporting ? 'Generating...' : 'Export File'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} style={styles.button}>
            <Text variant="label" size="medium" color="error">
              Clear All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={loadLogs} style={styles.button}>
            <Text variant="label" size="medium" color="info">
              Refresh
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={logs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.timestamp}-${index}`}
          contentContainerStyle={styles.list}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    padding: 8,
  },
  list: {
    padding: 10,
  },
  logItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  level: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
  tag: {
    fontWeight: '600',
    fontSize: 13,
    color: '#444',
  },
  message: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  dataContainer: {
    backgroundColor: '#f8f8f8',
    padding: 8,
    marginTop: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dataLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dataText: {
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#444',
  },
});
