import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { saveRegistration } from '../src/services/db';
import { syncPendingRegistrations, syncPendingScans } from '../src/services/SyncService';
import { useLanguage } from '../src/contexts/LanguageContext';

export default function RegisterCattleScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const { t } = useLanguage();

    // Parse params
    const breedName = params.breedName as string;
    const allImages = params.allImages ? JSON.parse(params.allImages as string) : [];
    const allPredictions = params.allPredictions ? JSON.parse(params.allPredictions as string) : [];
    const latitude = params.latitude ? parseFloat(params.latitude as string) : undefined;
    const longitude = params.longitude ? parseFloat(params.longitude as string) : undefined;
    const locationName = params.locationName as string;
    const timestamp = params.timestamp ? parseInt(params.timestamp as string) : Date.now();

    const [loading, setLoading] = useState(false);

    // Form State
    const [pashuAadharTagId, setPashuAadharTagId] = useState('');
    const [species, setSpecies] = useState('Cattle');
    const [breed, setBreed] = useState(breedName || '');
    const [isBreedOverridden, setIsBreedOverridden] = useState(false);
    const [overrideReason, setOverrideReason] = useState('');
    const [phenotypicCharacteristics, setPhenotypicCharacteristics] = useState('');
    const [identificationMarks, setIdentificationMarks] = useState('');
    const [sex, setSex] = useState('Female');
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [reproductiveBreedingHistory, setReproductiveBreedingHistory] = useState('');
    const [healthVaccinationRecords, setHealthVaccinationRecords] = useState('');
    const [milkYieldInfo, setMilkYieldInfo] = useState('');
    const [birthDeathRegistrationInfo, setBirthDeathRegistrationInfo] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerContact, setOwnerContact] = useState('');
    const [premisesType, setPremisesType] = useState('');
    const [premisesLocation, setPremisesLocation] = useState('');

    const handleRegister = async () => {
        if (!pashuAadharTagId || !ownerName || !ownerContact) {
            Alert.alert(t('common.error'), t('register.fillRequired'));
            return;
        }

        // Validate Phone Number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(ownerContact)) {
            Alert.alert(t('register.invalidPhone'), t('register.enterValidPhone'));
            return;
        }

        setLoading(true);
        try {
            await saveRegistration({
                pashuAadharTagId,
                species,
                breed,
                isBreedOverridden,
                overrideReason,
                phenotypicCharacteristics,
                identificationMarks,
                sex,
                ageYears,
                ageMonths,
                reproductiveBreedingHistory,
                healthVaccinationRecords,
                milkYieldInfo,
                birthDeathRegistrationInfo,
                ownerName,
                ownerAddress,
                ownerContact,
                premisesType,
                premisesLocation,
                imageUris: allImages,
                predictions: allPredictions,
                latitude,
                longitude,
                locationName,
                timestamp,
                userId: user?.id?.toString(),
                userRole: user?.role,
                isSynced: false
            });

            Alert.alert(t('common.success'), t('register.successSaved'), [
                {
                    text: t('common.ok'),
                    onPress: () => {
                        // Trigger sync immediately
                        syncPendingRegistrations();
                        router.replace('/(tabs)/history');
                    }
                }
            ]);
        } catch (error) {
            console.error('Registration failed:', error);
            Alert.alert(t('common.error'), t('register.saveFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{t('register.title')}</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>1. {t('register.sections.identity')}</Text>

                <Text style={styles.label}>{t('register.fields.tagId')} *</Text>
                <TextInput
                    style={styles.input}
                    value={pashuAadharTagId}
                    onChangeText={setPashuAadharTagId}
                    placeholder={t('register.placeholders.tagId')}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>{t('register.fields.species')}</Text>
                <TextInput
                    style={styles.input}
                    value={species}
                    onChangeText={setSpecies}
                />

                <View style={styles.row}>
                    <Text style={styles.label}>{t('register.fields.breed')}: {breed}</Text>
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>{t('register.fields.override')}?</Text>
                        <Switch
                            value={isBreedOverridden}
                            onValueChange={(val) => {
                                setIsBreedOverridden(val);
                                if (!val) setBreed(breedName || '');
                            }}
                        />
                    </View>
                </View>

                {isBreedOverridden && (
                    <>
                        <Text style={styles.label}>{t('register.fields.correctBreed')}</Text>
                        <TextInput
                            style={styles.input}
                            value={breed}
                            onChangeText={setBreed}
                            placeholder={t('register.placeholders.correctBreed')}
                        />
                        <Text style={styles.label}>{t('register.fields.overrideReason')}</Text>
                        <TextInput
                            style={styles.input}
                            value={overrideReason}
                            onChangeText={setOverrideReason}
                            placeholder={t('register.placeholders.overrideReason')}
                        />
                    </>
                )}

                <Text style={styles.label}>{t('register.fields.phenotype')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={phenotypicCharacteristics}
                    onChangeText={setPhenotypicCharacteristics}
                    multiline
                />

                <Text style={styles.label}>{t('register.fields.marks')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={identificationMarks}
                    onChangeText={setIdentificationMarks}
                    multiline
                />

                <Text style={styles.sectionTitle}>2. {t('register.sections.age')}</Text>

                <Text style={styles.label}>{t('register.fields.sex')}</Text>
                <View style={styles.row}>
                    {['Female', 'Male'].map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.radioBtn, sex === s && styles.radioBtnSelected]}
                            onPress={() => setSex(s)}
                        >
                            <Text style={[styles.radioText, sex === s && styles.radioTextSelected]}>{s === 'Female' ? t('register.sex.female') : t('register.sex.male')}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.row}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.label}>{t('register.fields.ageYears')}</Text>
                        <TextInput
                            style={styles.input}
                            value={ageYears}
                            onChangeText={setAgeYears}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.label}>{t('register.fields.ageMonths')}</Text>
                        <TextInput
                            style={styles.input}
                            value={ageMonths}
                            onChangeText={setAgeMonths}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <Text style={styles.label}>{t('register.fields.breedingHistory')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={reproductiveBreedingHistory}
                    onChangeText={setReproductiveBreedingHistory}
                    multiline
                />

                <Text style={styles.sectionTitle}>3. {t('register.sections.health')}</Text>

                <Text style={styles.label}>{t('register.fields.vaccination')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={healthVaccinationRecords}
                    onChangeText={setHealthVaccinationRecords}
                    multiline
                />

                <Text style={styles.label}>{t('register.fields.milkYield')}</Text>
                <TextInput
                    style={styles.input}
                    value={milkYieldInfo}
                    onChangeText={setMilkYieldInfo}
                />

                <Text style={styles.label}>{t('register.fields.birthDeath')}</Text>
                <TextInput
                    style={styles.input}
                    value={birthDeathRegistrationInfo}
                    onChangeText={setBirthDeathRegistrationInfo}
                />

                <Text style={styles.sectionTitle}>4. {t('register.sections.owner')}</Text>

                <Text style={styles.label}>{t('register.fields.ownerName')} *</Text>
                <TextInput
                    style={styles.input}
                    value={ownerName}
                    onChangeText={setOwnerName}
                />

                <Text style={styles.label}>{t('register.fields.ownerAddress')}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={ownerAddress}
                    onChangeText={setOwnerAddress}
                    multiline
                />

                <Text style={styles.label}>{t('register.fields.ownerContact')} *</Text>
                <TextInput
                    style={styles.input}
                    value={ownerContact}
                    onChangeText={setOwnerContact}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>{t('register.fields.premisesType')}</Text>
                <TextInput
                    style={styles.input}
                    value={premisesType}
                    onChangeText={setPremisesType}
                    placeholder={t('register.placeholders.premisesType')}
                />

                <Text style={styles.label}>{t('register.fields.premisesLocation')}</Text>
                <TextInput
                    style={styles.input}
                    value={premisesLocation}
                    onChangeText={setPremisesLocation}
                    placeholder={t('register.placeholders.premisesLocation')}
                />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>{t('register.submit')}</Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    backButtonText: {
        fontSize: 24,
        color: '#2c3e50',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3498db',
        marginTop: 20,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#2c3e50',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        marginRight: 8,
        color: '#7f8c8d',
    },
    radioBtn: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#dfe6e9',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: 'white',
    },
    radioBtnSelected: {
        backgroundColor: '#e8f8f5',
        borderColor: '#2ecc71',
    },
    radioText: {
        color: '#7f8c8d',
        fontWeight: '600',
    },
    radioTextSelected: {
        color: '#2ecc71',
    },
    submitButton: {
        backgroundColor: '#2ecc71',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
