import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { Screen } from '@/app/components/templates';
import { getApiImageUrl } from '@/app/utils/Environment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { useAddProductReviewMutation } from '@/app/services/reviewsApi';

const tagsList = ['Friendly', 'Supportive', 'Super Tasker', 'Fast worker'];

const RateScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { user } = useSelector(selectAuth);
  const userId = user?.id;
  const { service } = route.params || {};
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [addProductReview, { isLoading, isSuccess, isError }] =
    useAddProductReviewMutation();

  const handleTagPress = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleRate = (value) => setRating(value);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }
    setError('');
    const tagsString =
      selectedTags.length > 0 ? `\n\nTags: ${selectedTags.join(', ')}` : '';
    const fullComment = feedback + tagsString;
    try {
      await addProductReview({
        productServiceId: service?.id,
        userId: user.id,
        rating,
        comment: fullComment,
      }).unwrap();
      setShowModal(true);
    } catch (e) {}
  };

  return (
    <>
      <ModalComponent
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          navigation.navigate('Task');
        }}
        title={t('RateScreen.modalTitle', 'Thank you for your feedback!')}
        confirmButtonText="OK"
        hideCancelButton
        onConfirm={() => {
          setShowModal(false);
          navigation.navigate('Task');
        }}
      >
        <Text variant="body" size="large" color="secondary">
          {t(
            'RateScreen.modalMessage',
            'Your review has been submitted successfully.',
          )}
        </Text>
      </ModalComponent>
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: (
            <Text
              variant="headline"
              size="small"
              color="info"
              style={{ marginTop: 8 }}
            >
              {t('rateScreen.taskFeedback', 'Give Feedback')}
            </Text>
          ),
          onLeftIconPress: () => navigation.goBack(),
        }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image
            source={getApiImageUrl(service?.urlImage)}
            style={styles.avatar}
          />
          <Text variant="title" size="large" color="info" style={styles.title}>
            {t('rateScreen.rate', 'Rate')} {service?.name}
          </Text>
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={styles.tipStars}
          >
            {t('rateScreen.subtitle', 'Tap a star to rate the service')}
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => handleRate(i)}>
                <Icon
                  name={
                    i <= Math.floor(rating)
                      ? 'star'
                      : i - rating < 1
                        ? 'star-half'
                        : 'star-outline'
                  }
                  family="Ioicons"
                  size={34}
                  color="#F6A609"
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text
            variant="body"
            size="large"
            color="info"
            style={styles.subtitle}
          >
            {t('rateScreen.leaveFeedback', 'Leave your feedback here')}
          </Text>
          <View style={styles.tagsRow}>
            {tagsList.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => handleTagPress(tag)}
              >
                <Icon
                  name={selectedTags.includes(tag) ? 'checkmark' : ''}
                  size={16}
                  color="#6C5DD3"
                  family="Ionicons"
                  style={{ marginRight: 4 }}
                />
                <Text variant="title" size="medium" style={styles.tagText}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={t(
              'rateScreen.feedbackPlaceholder',
              'Leave feedback about tasker',
            )}
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />
          {error ? (
            <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>
          ) : null}
          <Button
            title={t('rateScreen.submit', 'Submit')}
            variant="filled"
            style={styles.submitButton}
            onPress={handleSubmit}
          ></Button>
        </ScrollView>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  tipStars: {
    textAlign: 'center',
    marginTop: '8',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  subtitle: {
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C1B6F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#F8F7FD',
  },
  tagSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#6C5DD3',
  },
  tagText: {
    color: '#6C5DD3',
  },
  textInput: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#C1B6F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    width: '80%',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
});

export default RateScreen;
