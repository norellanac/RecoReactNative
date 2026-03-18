import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { BusinessStackParams } from './BusinessStack';
import { Screen } from '@/app/components/templates';
import { Text } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { getApiImageUrl } from '@/app/utils/Environment';
import Carousel from '@/app/components/molecules/Carousel';
import ReviewsSection from '@/app/components/molecules/ReviewsSection';
import { useTranslation } from 'react-i18next';

type MyServiceDetailsRouteProp = RouteProp<
  BusinessStackParams,
  'MyServiceDetails'
>;

const MyServiceDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<MyServiceDetailsRouteProp>();
  const navigation = useNavigation();
  const { product } = route.params;

  const service = product;
  const reviews = service.reviews || [];
  const images = [{ img: getApiImageUrl(service?.urlImage) }];
  const categories = service.categories || [];
  const mainLocation = service.locations?.find((loc) => loc.type === 1);
  const coverageLocations =
    service.locations?.filter((loc) => loc.type === 2) || [];

  return (
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
            {t('business.myServices', 'Editar mis servicios')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Carousel images={images} />

        {/* Nombre y editar */}
        <View style={styles.titleRow}>
          <Text
            variant="title"
            size="large"
            color="info"
            style={styles.title}
            numberOfLines={3}
          >
            {service.name}
          </Text>
          <Icon
            name="pencil"
            family="MaterialCommunityIcons"
            size={28}
            color="#7B61FF"
            onPress={() => navigation.navigate('EditProduct', { product })}
          />
        </View>

        {/* Precio destacado */}
        <View style={styles.priceBadge}>
          <Text variant="body" size="large" style={styles.priceText}>
            Q{service.price} /día
          </Text>
        </View>

        {/* Categorías */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Categorías
        </Text>
        <View style={styles.chipRow}>
          {categories.length === 0 ? (
            <Text variant="body" size="medium" color="secondary">
              Sin categorías
            </Text>
          ) : (
            categories.map((cat) => (
              <View key={cat.id} style={styles.chip}>
                <Text
                  variant="body"
                  size="medium"
                  color="secondary"
                  style={styles.chipText}
                >
                  {cat.name}
                </Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.divider} />

        {/* Descripción */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Habilidades y experiencia
        </Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>{service.description}</Text>
        </View>
        {/* Dirección principal */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Dirección principal
        </Text>
        <View style={styles.infoCard}>
          {mainLocation ? (
            <Text style={styles.infoText}>
              {mainLocation.description ? ` ${mainLocation.description}` : ''}
              {mainLocation.city?.name ? `, ${mainLocation.city.name}` : ''}
            </Text>
          ) : (
            <Text color="secondary">No registrada</Text>
          )}
        </View>

        {/* Áreas de cobertura */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Áreas de cobertura
        </Text>
        <View style={styles.chipRow}>
          {coverageLocations.length === 0 ? (
            <Text color="secondary">No registradas</Text>
          ) : (
            coverageLocations.map((loc) => (
              <View key={loc.id} style={styles.chipSecondary}>
                <Text style={styles.chipTextSecondary}>
                  {loc.city?.name ? ` ${loc.city.name} |` : ''}
                </Text>
              </View>
            ))
          )}
        </View>
        <View style={styles.divider} />

        {/* Servicios adicionales */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Servicios adicionales
        </Text>
        {service.details && service.details.length > 0 ? (
          <View style={styles.skillsGrid}>
            {service.details.map((detail, index) => (
              <View key={index} style={styles.skillCard}>
                <View style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{detail.label}</Text>
                </View>
                <Text style={styles.skillValue}>{detail.value}</Text>
                <Text style={styles.skillDescription}>
                  {detail.description}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text color="secondary" style={{ marginHorizontal: 18 }}>
            No hay servicios adicionales registrados.
          </Text>
        )}

        {/* Reseñas */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          Reseñas
        </Text>
        <ReviewsSection reviews={reviews} baseUrl={''} onSeeAll={() => {}} />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //backgroundColor: '#FAF8FF',
  },
  contentContainer: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    fontSize: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
    //marginHorizontal: -16,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EADDFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 4,
    marginTop: 2,
  },
  priceText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    //fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  chipText: {
    //fontWeight: 'bold',
  },
  chipSecondary: {
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipTextSecondary: {
    color: '#7B7B7B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EADDFF',
  },
  infoText: {
    color: '#444',
    fontSize: 15,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  skillCard: {
    flexBasis: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EADDFF',
  },
  skillChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EADDFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  skillChipText: {
    color: '#6750A4',
    fontWeight: 'bold',
    fontSize: 13,
  },
  skillValue: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  skillDescription: {
    color: '#7B7B7B',
    fontSize: 13,
  },
});

export default MyServiceDetails;
