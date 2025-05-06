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
import { useTranslation } from 'react-i18next';
import introSliderImg1 from '../../../assets/img/intro_sliders/intro_1.png';
import introSliderImg2 from '../../../assets/img/intro_sliders/intro_2.png';
import introSliderImg3 from '../../../assets/img/intro_sliders/intro_3.png';
import introSliderImg4 from '../../../assets/img/intro_sliders/intro_4.png';
import { Screen } from '@/app/components/templates';
import { useNavigation } from '@react-navigation/native';

type Slide = {
  title: string;
  image: any;
};

const IntroSlider: React.FC = () => {
  const { t } = useTranslation();
  const slides: Slide[] = [
    {
      image: introSliderImg1,
      title: t('slider.title_1', 'Find the expert you need in minutes.'),
    },
    {
      image: introSliderImg2,
      title: t('slider.title_2', 'Hire easily and without complications.'),
    },
    {
      image: introSliderImg3,
      title: t(
        'slider.title_3',
        'Based on user ratings who bought their services.',
      ),
    },
    {
      image: introSliderImg4,
      title: t(
        'slider.title_4',
        'Explore, compare and schedule in a few steps.',
      ),
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
    <Screen
      statusBarProps={{
        leftElement: <></>,
        rightElement: (
          <Text variant="body" size="large" color="secondary">
            {t('slider.skip', 'Skip')}
          </Text>
        ),
        onRightIconPress: handleSkip,
      }}
    >
      <View style={{ flex: 1 }}>
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
              <Text
                variant="title"
                size="large"
                color="info"
                style={[
                  styles.description,
                  { marginTop: isPortrait ? 10 : 30 },
                ]}
              >
                {slide.title}
              </Text>
              <Image
                source={slide.image}
                style={[
                  styles.img,
                  {
                    width: isPortrait ? 320 : 250,
                    height: isPortrait ? 370 : 300,
                  },
                ]}
              />
              {index === slides.length - 1 && (
                <TouchableOpacity
                  onPress={handleSkip}
                  style={styles.getStartedButton}
                >
                  <Text variant="title" size="large" color="primary">
                    {t('slider.get_started', 'Get Started')}
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    marginVertical: 20,
  },
});

export default IntroSlider;
