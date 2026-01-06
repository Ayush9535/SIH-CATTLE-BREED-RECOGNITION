import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../src/contexts/LanguageContext';
import { useAuth } from '../src/contexts/AuthContext';

interface BreedPrediction {
  breed: string;
  confidence: number;
}

interface BreedResult {
  breedName: string;
  confidence: number;
  imageUrl?: string;
  characteristics: string[];
  careTips: string[];
  description?: string;
  allPredictions?: BreedPrediction[];
  allImages?: string[];
  timestamp?: number;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  isGuest?: boolean;
}

const { width } = Dimensions.get('window');

// --- CONSTANTS ---
// Moved to localization file (en.json) under 'breed_regions' and 'breed_traits'

function ResultScreen(): React.JSX.Element {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Initialize with default data to avoid null
  const [originalResult, setOriginalResult] = useState<BreedResult>({
    breedName: 'Loading...',
    confidence: 0,
    imageUrl: undefined,
    characteristics: [],
    careTips: [],
    allPredictions: [],
    allImages: [],
    timestamp: undefined,
    locationName: undefined,
    latitude: undefined,
    longitude: undefined,
    isGuest: false,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  const params = useLocalSearchParams();

  // Load result data from params
  useEffect(() => {
    if (params.breedName) {
      try {
        setOriginalResult({
          breedName: params.breedName as string,
          confidence: Number(params.confidence),
          imageUrl: params.imageUrl as string,
          characteristics: params.characteristics ? JSON.parse(params.characteristics as string) : [],
          careTips: params.careTips ? JSON.parse(params.careTips as string) : [],
          description: params.description as string,
          allPredictions: params.allPredictions ? JSON.parse(params.allPredictions as string) : [],
          allImages: params.allImages ? JSON.parse(params.allImages as string) : [params.imageUrl],
          timestamp: params.timestamp ? Number(params.timestamp) : undefined,
          locationName: params.locationName as string,
          latitude: params.latitude ? Number(params.latitude) : undefined,
          longitude: params.longitude ? Number(params.longitude) : undefined,
          isGuest: params.isGuest === 'true',
        });
      } catch (e) {
        console.error('Error parsing params:', e);
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback for direct access or testing
      setLoading(false);
    }
  }, [params]);

  // Convert to BreedData format - always non-null (memoized for performance)
  const breedData = useMemo(() => ({
    breedName: originalResult.breedName,
    description: originalResult.description || `${originalResult.breedName} is one of the finest indigenous dairy breeds from India. Known for excellent characteristics.`,
    characteristics: originalResult.characteristics,
    careTips: originalResult.careTips,
    allPredictions: originalResult.allPredictions,
    allImages: originalResult.allImages,
    timestamp: originalResult.timestamp,
    locationName: originalResult.locationName,
    latitude: originalResult.latitude,
    longitude: originalResult.longitude,
    isGuest: originalResult.isGuest,
  }), [originalResult]);


  // --- VERIFICATION LOGIC ---
  const verificationResult = useMemo(() => {
    if (!breedData.breedName) return { status: 'UNKNOWN', origin: 'Unknown' };

    const detectedBreed = breedData.breedName;

    // Logic: Always use English for location matching/checks
    // We access the English translation resource directly for logic stability
    // Note: detailed logic relies on English state names from geocoder
    const originRegionEn = t(`breed_regions.${detectedBreed}`, { lng: 'en' });

    // Display: Use current language for UI presentation
    // Using t() normally here ensures it follows the active language
    const originRegionDisplay = t(`breed_regions.${detectedBreed}`);

    const userLocation = breedData.locationName;

    // Check if we have data for this breed
    // If the key reflects itself (and we assume English usually has it), treat as unknown
    const isUnknown = originRegionEn === `breed_regions.${detectedBreed}`;

    if (isUnknown) return { status: 'MATCH', origin: t('registration.unknownLocation') };

    // Handle 'All India' case
    if (originRegionEn.toLowerCase() === 'all') {
      return { status: 'MATCH', origin: t('breed_regions.all') || 'All India' };
    }

    // Case: No user location
    if (!userLocation) {
      return { status: 'LOCATION_UNAVAILABLE', origin: originRegionDisplay };
    }

    // Split region string "Gujarat and Rajasthan" -> ["gujarat", "rajasthan"]
    const targetStates = originRegionEn.split(/, | and | & /).map(s => s.trim().toLowerCase());

    // Check if user location (e.g., "Anand, Gujarat, India") contains any target state
    const userLocLower = userLocation.toLowerCase();
    const isMatch = targetStates.some(state => userLocLower.includes(state));

    return {
      status: isMatch ? 'MATCH' : 'MISMATCH',
      origin: originRegionDisplay
    };
  }, [breedData.breedName, breedData.locationName, t]);


  // Define helper for camelCase conversion (for 'breeds' keys)
  const toCamelCase = (str: string | undefined) => {
    if (!str) return '';
    // Special handling for known patterns or generic camelCase
    // Ex: "Red Sindhi" -> "redSindhi"
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  };

  // Check trait key existence helper
  const getVisualTraits = (breed: string) => {
    const key = `breed_traits.${breed}`;
    const trait = t(key);
    return trait === key ? undefined : trait;
  }

  // Fetch visual traits
  const visualTraits = getVisualTraits(breedData.breedName);

  // Show loading state AFTER all hooks are called
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={{ marginTop: 20, fontSize: 16, color: '#7f8c8d' }}>{t('result.loading')}</Text>
      </View>
    );
  }

  // Use translated data if available, otherwise original
  const displayData = breedData;
  const result: BreedResult = {
    ...originalResult,
    breedName: displayData.breedName,
    characteristics: displayData.characteristics,
    careTips: displayData.careTips,
    allPredictions: displayData.allPredictions,
    isGuest: displayData.isGuest,
  };

  const isMismatch = verificationResult.status === 'MISMATCH';
  const isLocationNull = verificationResult.status === 'LOCATION_UNAVAILABLE';
  const showWarningDetails = isMismatch || isLocationNull;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('result.title')}</Text>
        </View>

        {/* Image Slider */}
        {result.allImages && result.allImages.length > 0 ? (
          <View style={styles.sliderContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
                if (slide !== activeSlide) {
                  setActiveSlide(slide);
                }
              }}
              scrollEventThrottle={16}
              style={styles.slider}
            >
              {result.allImages.map((img, index) => (
                <Image key={index} source={{ uri: img }} style={styles.sliderImage} />
              ))}
            </ScrollView>
            {/* Pagination Dots */}
            {result.allImages.length > 1 && (
              <View style={styles.pagination}>
                {result.allImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      activeSlide === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          result.imageUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: result.imageUrl }} style={styles.image} />
            </View>
          )
        )}

        {/* Breed Info Card (ALWAYS GREEN) */}
        <View style={styles.resultCard}>
          <View style={styles.breedHeader}>
            <Text style={styles.breedName}>{t(`breeds.${toCamelCase(result.breedName)}`) || result.breedName}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {(result.confidence).toFixed(1)}{t('result.matchLabel')}
              </Text>
            </View>
          </View>

          <Text style={styles.breedDescription}>
            {displayData.description}
          </Text>

          {/* Extra Info INSIDE card for Null Location */}
          {isLocationNull && visualTraits && (
            <View style={styles.extraInfoContainer}>
              <Text style={styles.extraInfoTitle}>📍 {t('result.nativeOrigin')}: {verificationResult.origin}</Text>
              <Text style={styles.extraInfoTitle}>👁️ {t('result.visualTraits')}:</Text>
              <Text style={styles.extraInfoText}>{visualTraits}</Text>
            </View>
          )}

          {/* Location and Date Info */}
          {!result.isGuest && (result.timestamp || result.locationName) && (
            <View style={styles.metaInfoContainer}>
              {result.timestamp && (
                <Text style={styles.metaText}>
                  📅 {new Date(result.timestamp).toLocaleDateString()} {new Date(result.timestamp).toLocaleTimeString()}
                </Text>
              )}
              {result.locationName && (
                <Text style={styles.metaText}>
                  📍 {result.locationName}
                </Text>
              )}
              {result.latitude && result.longitude && !result.locationName && (
                <Text style={styles.metaText}>
                  📍 {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* --- Mismatch Warning Box (SEPARATE) --- */}
        {isMismatch && (
          <View style={styles.warningContainer}>
            <View style={styles.warningHeader}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningTitle}>{t('result.mismatchTitle')}</Text>
            </View>

            <Text style={styles.warningText}>
              {t('result.mismatchDesc', { origin: verificationResult.origin, location: result.locationName })}
            </Text>

            <Text style={styles.warningText}>
              {t('result.checkTraits')}
            </Text>

            {visualTraits && (
              <View style={styles.warningTraitsBox}>
                <Text style={styles.warningTraitsText}>{visualTraits}</Text>
              </View>
            )}
          </View>
        )}




        {/* GUEST MESSAGE */}
        {result.isGuest && (
          <View style={styles.guestMessageContainer}>
            <Text style={styles.guestMessageTitle}>🔒 {t('result.guestLockedTitle')}</Text>
            <Text style={styles.guestMessageText}>
              {t('result.guestLockedDesc')}
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/' as any)}
            >
              <Text style={styles.loginButtonText}>{t('result.loginNow')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Top Matches (HIDDEN FOR GUESTS) */}
        {!result.isGuest && result.allPredictions && result.allPredictions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 {t('result.topMatches')}</Text>
            <View style={styles.card}>
              {result.allPredictions.slice(0, 3).map((pred, index) => (
                <View key={index} style={styles.matchItem}>
                  <View style={styles.matchRow}>
                    <Text style={styles.matchBreed}>{t(`breeds.${toCamelCase(pred.breed)}`) || pred.breed}</Text>
                    <Text style={styles.matchScore}>{(pred.confidence).toFixed(2)}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${pred.confidence}%`, backgroundColor: index === 0 ? '#2ecc71' : '#3498db' }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Characteristics (HIDDEN FOR GUESTS) */}
        {!result.isGuest && result.characteristics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 {t('result.characteristics')}</Text>
            <View style={styles.card}>
              {result.characteristics.map((char, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{char}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Care Tips (HIDDEN FOR GUESTS) */}
        {!result.isGuest && result.careTips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💚 {t('result.careTips')}</Text>
            <View style={styles.card}>
              {result.careTips.map((tip, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>✓</Text>
                  <Text style={styles.listText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>

          {user?.role === 'flw' && (
            <TouchableOpacity
              style={styles.primaryAction}
              onPress={() => {
                router.push({
                  pathname: '/register',
                  params: {
                    breedName: result.breedName,
                    allImages: JSON.stringify(result.allImages),
                    allPredictions: JSON.stringify(result.allPredictions),
                    latitude: result.latitude,
                    longitude: result.longitude,
                    locationName: result.locationName,
                    timestamp: result.timestamp
                  }
                } as any);
              }}
            >
              <Text style={styles.actionText}>📝 {t('result.registerCattle')}</Text>
            </TouchableOpacity>
          )}


          <TouchableOpacity
            style={styles.secondaryAction}
            onPress={() => router.push('/upload' as any)}
          >
            <Text style={styles.secondaryActionText}>📸 {t('result.analyzeAnother')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryAction}
            onPress={() => router.push('/(tabs)' as any)}
          >
            <Text style={styles.tertiaryActionText}>🏠 {t('result.toHome')}</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            {t('result.warning')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  sliderContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  slider: {
    width: '100%',
    height: 300,
  },
  sliderImage: {
    width: width - 40, // Container padding is 20 on each side, so width is window width - 40
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  resultCard: {
    backgroundColor: '#2ecc71',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Removed old mismatch styles
  warningContainer: {
    backgroundColor: '#fff3cd', // Light yellow
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#f39c12', // Darker yellow/orange
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d35400',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 6,
    lineHeight: 20,
  },
  warningTraitsBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  warningTraitsText: {
    fontSize: 14,
    color: '#856404',
    fontStyle: 'italic',
  },
  infoContainer: {
    backgroundColor: '#d1ecf1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#17a2b8',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 5,
    lineHeight: 20
  },
  breedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  breedName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  confidenceBadge: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#27ae60', // Always green text if card is green
    fontSize: 14,
    fontWeight: 'bold',
  },
  breedDescription: {
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
  },
  extraInfoContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  extraInfoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  extraInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 8,
  },
  metaInfoContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  metaText: {
    color: 'white',
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.9,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 16,
    color: '#2ecc71',
    marginRight: 10,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  primaryAction: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryAction: {
    backgroundColor: '#9b59b6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tertiaryAction: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dee2e6',
  },
  tertiaryActionText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
    textAlign: 'center',
  },
  matchItem: {
    marginBottom: 15,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  matchBreed: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  matchScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  guestMessageContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  guestMessageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  guestMessageText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default React.memo(ResultScreen);
