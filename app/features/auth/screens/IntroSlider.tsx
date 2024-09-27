import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Text } from '../../../components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

type Slide = {
  title: string;
  image: any;
  description: string;
};



const IntroSlider: React.FC = () => {
  const { t } = useTranslation();
  const slides: Slide[] = [
    {
      title: t('slider.welcome_app'),
      image: require('../../../assets/img/Group_4.png'),
      description: t('slider.description_s1'),
    },
    {
      title: t('slider.stay_organized'),
      image: require('../../../assets/img/Group_4.png'),
      description: t('slider.description_s2'),
    },
    {
      title: t('slider.get_started'),
      image: require('../../../assets/img/Group_4.png'),
      description: t('slider.description_s3'),

    },
  ];
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = useCallback(
    (event: any) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      setCurrentIndex(slideIndex);
    },
    [width],
  );

  const handleSkip = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    }
  }, [currentIndex, width]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * width,
        animated: true,
      });
    }
  }, [currentIndex, width]);

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip}>
          <Text variant="body" size="large" color="secondary">
            {t('slider.skip')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <Text variant="headline" size="large" color="primary">
              {slide.title}
            </Text>
            <Text
              variant="title"
              size="large"
              color="info"
              style={[styles.description, { marginTop: isPortrait ? 80 : 30 }]}
            >
              {slide.description}
            </Text>
            <Image
              source={slide.image}
              style={[
                styles.img,
                {
                  width: isPortrait ? 220 : 150,
                  height: isPortrait ? 270 : 200,
                },
              ]}
            />
            {index === slides.length - 1 && (
              <TouchableOpacity
                onPress={handleSkip}
                style={styles.getStartedButton}
              >
                <Text variant="title" size="large" color="primary">
                  {t('slider.get_started')}
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={18}
                  color="primary"
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.arrows}>
        <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={currentIndex === 0 ? '#E0E0E0' : '#6750A4'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === slides.length - 1}
        >
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={currentIndex === slides.length - 1 ? '#E0E0E0' : '#6750A4'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
    padding: 20,
  },
  description: {
    textAlign: 'center',
  },
  img: {
    resizeMode: 'contain',
    marginTop: 20,
  },
  getStartedButton: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#6750A4',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  arrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default IntroSlider;
