import { useTheme } from '@/app/theme/ThemeProvider';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface TabItem {
  title: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  scrollable?: boolean;
  headerBGColor?: boolean;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  scrollable = false,
  headerBGColor = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useTheme();
  const { colors } = theme;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
  };

  const TabContent = tabs[activeTab]?.component;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabsContainer,
          headerBGColor && { backgroundColor: colors.primary },
        ]}
      >
        {scrollable ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollableTabs}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && [
                    styles.activeTab,
                    { borderBottomColor: colors.primary },
                  ],
                ]}
                onPress={() => handleTabPress(index)}
              >
                {tab.icon}
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.secondary },
                    activeTab === index && [
                      styles.activeTabText,
                      { color: colors.primary },
                    ],
                  ]}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.nonScrollableTabs,
              headerBGColor && { backgroundColor: colors.primary_container },
            ]}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tab,
                  activeTab === index && [
                    styles.activeTab,
                    { borderBottomColor: colors.primary },
                  ],
                ]}
                onPress={() => handleTabPress(index)}
              >
                {tab?.icon}
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.secondary },
                    activeTab === index && [
                      styles.activeTabText,
                      { color: colors.primary },
                    ],
                  ]}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>{TabContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scrollableTabs: {
    flexDirection: 'row',
  },
  nonScrollableTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    marginTop: 4,
  },
  activeTabText: {
    color: 'transparent',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});

export default Tabs;
