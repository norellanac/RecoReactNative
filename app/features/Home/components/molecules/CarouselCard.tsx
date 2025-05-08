import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import { Button } from '@/app/components/atoms';
import slider_1 from '../../../../assets/img/home_sliders/slider_1.png';
import { useTheme } from '@/app/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const Carousel = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors } = theme;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const scrollViewRef = useRef(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 20)); // Adjust for horizontal margin
    setActiveIndex(index);
  };

  const handleTouchStart = () => {
    setIsUserInteracted(true);
  };

  useEffect(() => {
    if (isUserInteracted) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * (width - 20), // Adjust for horizontal margin
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isUserInteracted]);

  const images = [
    {
      img: slider_1,
      buttonText: t('home.landing_screen.slider.title_1', 'Action 1'),
      onButtonPress: () => alert('Action 1 Pressed'),
    },
    {
      img: slider_1,
      buttonText: t('home.landing_screen.slider.title_2', 'Action 2'),
      onButtonPress: () => alert('Action 2 Pressed'),
    },
    {
      img: slider_1,
      buttonText: t('home.landing_screen.slider.title_3', 'Action 3'),
      onButtonPress: () => alert('Action 3 Pressed'),
    },
  ];

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
      >
        {images.map((image, index) => (
          <View key={index} style={[styles.card, { width: width - 20 }]}>
            <Image source={image.img} style={styles.image} />
            <View style={styles.buttonContainer}>
              <Button
                variant="filled"
                title={image.buttonText}
                onPress={image.onButtonPress}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex
                    ? colors.primary
                    : colors.primary_container,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    borderRadius: 16,
    marginBottom: 10,
    width: '90%',

    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    padding: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Carousel;
