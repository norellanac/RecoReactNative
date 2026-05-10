import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { Button } from '@/app/components/atoms';
import slider_1 from '../../assets/img/home_sliders/slider_1_Reco.png';
import slider_2 from '../../assets/img/home_sliders/slider_2_Reco.png';
import { useTheme } from '@/app/theme/ThemeProvider';
import { useBranding } from '@/app/hooks/useBranding';
import { BASE_URL } from '@/app/utils/Environment';

const { width } = Dimensions.get('window');

interface CarouselItem {
  img: ImageSourcePropType | { uri: string };
  buttonText?: string;
  onButtonPress?: () => void;
}

interface CarouselProps {
  images?: CarouselItem[];
  autoScroll?: boolean;
  interval?: number;
  imageStyle?: ImageStyle;
  cardStyle?: ViewStyle;
}

const LOCAL_DEFAULT_IMAGES: CarouselItem[] = [
  { img: slider_1 },
  { img: slider_2 },
];

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoScroll = true,
  interval = 3500,
  imageStyle,
  cardStyle,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { config } = useBranding();

  const brandingSlides: CarouselItem[] = config?.sliderImages?.length
    ? config.sliderImages.map((url) => ({
        img: url.startsWith('http') ? { uri: url } : { uri: `${BASE_URL}${url}` },
      }))
    : LOCAL_DEFAULT_IMAGES;

  const resolvedImages = images ?? brandingSlides;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<
    Record<number, boolean>
  >({});
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 20)); // Adjust for horizontal margin
    setActiveIndex(index);
  };

  const handleTouchStart = () => {
    setIsUserInteracted(true);
  };

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
    console.log(`Error loading image at index ${index}`);
  };

  useEffect(() => {
    if (isUserInteracted || !autoScroll || resolvedImages?.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % resolvedImages?.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * (width - 20), // Adjust for horizontal margin
            animated: true,
          });
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [isUserInteracted, autoScroll, interval, images?.length]);

  if (!resolvedImages || resolvedImages.length === 0) {
    return null;
  }

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
        {resolvedImages.map((image, index) => (
          <View
            key={index}
            style={[styles.card, { width: width - 20 }, cardStyle]}
          >
            <Image
              source={image.img}
              style={[styles.image, imageStyle]}
              defaultSource={slider_1}
              onError={() => handleImageError(index)}
            />
            {image.buttonText && (
              <View style={styles.buttonOverlay}>
                <Button
                  variant="filled"
                  title={image.buttonText}
                  onPress={image.onButtonPress}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {resolvedImages.map((_, index) => (
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
    height: 240,
  },
  image: {
    borderRadius: 16,
    marginBottom: 10,
    width: '95%',
    height: 220,
    resizeMode: 'cover',
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    padding: 15,
    zIndex: 2,
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
