import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBotBubble, TypingBubble } from '../../components/AnimatedChatBubbles';
import { UserBubble } from '../../components/ChatBubbles';
import { useLanguage } from '../../src/contexts/LanguageContext';

// Import breed JSON files
import girData from '../../assets/cattle/gir.json';
import sahiwalData from '../../assets/cattle/sahiwal.json';
import redSindhiData from '../../assets/cattle/red_sindhi.json';
import tharparkarData from '../../assets/cattle/tharparkar.json';
import kankrejData from '../../assets/cattle/kankrej.json';

import murrahData from '../../assets/buffalo/murrah.json';
import jaffarabadiData from '../../assets/buffalo/jaffarabadi.json';
import surtiData from '../../assets/buffalo/surti.json';
import niliRaviData from '../../assets/buffalo/nili_ravi.json';
import pandharpuriData from '../../assets/buffalo/pandharpuri.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  options?: string[];
  onOptionClick?: (option: string) => void;
}

type ConversationState = 'initial' | 'category-selected' | 'breed-selected' | 'info-shown';

const breedData: any = {
  cattle: {
    Gir: girData,
    Sahiwal: sahiwalData,
    'Red Sindhi': redSindhiData,
    Tharparkar: tharparkarData,
    Kankrej: kankrejData,
  },
  buffalo: {
    Murrah: murrahData,
    Jaffarabadi: jaffarabadiData,
    Surti: surtiData,
    'Nili Ravi': niliRaviData,
    Pandharpuri: pandharpuriData,
  },
};

export default function ChatbotScreen() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationState, setConversationState] = useState<ConversationState>('initial');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Map displayed text (translated) to internal logic keys (English)
  const valueMapRef = useRef<Record<string, string>>({});

  const addToMap = (label: string, value: string) => {
    valueMapRef.current[label] = value;
    return label;
  };



  const startChat = () => {
    // Initialize with greeting
    const greetingMessage: Message = {
      id: '1',
      text: t('chatbotExt.greet'),
      sender: 'bot',
    };

    const cattleLabel = t('chatbotExt.cattle');
    const buffaloLabel = t('chatbotExt.buffalo');

    // Clear map on start
    valueMapRef.current = {};
    addToMap(cattleLabel, 'cattle');
    addToMap(buffaloLabel, 'buffalo');

    const questionMessage: Message = {
      id: '2',
      text: t('chatbotExt.whatKnow'),
      sender: 'bot',
      options: [cattleLabel, buffaloLabel],
      onOptionClick: handleCategorySelect,
    };




    setMessages([greetingMessage, questionMessage]);
    setConversationState('initial');
    setSelectedCategory(null);
    setSelectedBreed(null);
    setIsTyping(false);
  };

  useEffect(() => {
    startChat();
  }, [language]); // Reload chat when language changes

  const resetChat = () => {
    startChat();
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleCategorySelect = (categoryLabel: string) => {
    // Resolve internal key from translated label
    const categoryKey = valueMapRef.current[categoryLabel] || categoryLabel.toLowerCase();

    setSelectedCategory(categoryKey);
    setConversationState('category-selected');

    // Add user's choice
    const userMessage: Message = {
      id: Date.now().toString(),
      text: categoryLabel,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate typing delay
    setIsTyping(true);
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds

    setTimeout(() => {
      setIsTyping(false);

      if (!breedData[categoryKey]) {
        console.error('Invalid category key:', categoryKey);
        return;
      }

      // Get breed names from the data
      const englishBreedNames = Object.keys(breedData[categoryKey]);

      // Create translated options and map them
      const breedOptions = englishBreedNames.map(breedKey => {
        // Try to find translation for breed name, fallback to key
        // Assuming keys in breedData match keys in en.json > breeds for translation
        // Adjust key format if needed (e.g. "Red Sindhi" -> "redSindhi")
        const lookupKey = `breeds.${breedKey.replace(/ /g, '').replace(/-/g, '').replace(/^./, c => c.toLowerCase())}`;
        const translated = t(lookupKey);
        const label = translated.startsWith('breeds.') ? breedKey : translated; // Fallback if no translation
        return addToMap(label, breedKey);
      });

      // Bot asks which breed
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chatbotExt.greatWhich', { category: categoryLabel }),
        sender: 'bot',
        options: breedOptions,
        onOptionClick: (selectedBreedLabel) => handleBreedSelect(categoryKey, selectedBreedLabel),
      };

      setMessages(prev => [...prev, botMessage]);
    }, delay);
  };

  const handleBreedSelect = (categoryKey: string, breedLabel: string) => {
    const breedNameKey = valueMapRef.current[breedLabel] || breedLabel;
    const breed = breedData[categoryKey][breedNameKey];

    if (!breed) {
      console.error('Breed not found:', breedNameKey);
      return;
    }

    setSelectedBreed({ ...breed, breed_name: breedNameKey }); // Ensure name is attached
    setConversationState('breed-selected');

    // Add user's choice
    const userMessage: Message = {
      id: Date.now().toString(),
      text: breedLabel,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate typing delay
    setIsTyping(true);
    const delay = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {
      setIsTyping(false);

      // Setup options map for info types
      const opts = {
        [t('chatbotExt.options.origin')]: 'origin',
        [t('chatbotExt.options.appearance')]: 'appearance',
        [t('chatbotExt.options.milk')]: 'milk',
        [t('chatbotExt.options.feeding')]: 'feeding',
        [t('chatbotExt.options.health')]: 'health',
        [t('chatbotExt.options.all')]: 'all',
      };

      Object.entries(opts).forEach(([label, key]) => addToMap(label, key));

      // Bot asks what info they want
      const questionMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chatbotExt.whatAbout', { breed: breedLabel }),
        sender: 'bot',
        options: Object.keys(opts),
        onOptionClick: (infoTypeLabel) => handleInfoSelect(breed, breedNameKey, infoTypeLabel),
      };

      setMessages(prev => [...prev, questionMessage]);
    }, delay);
  };

  const handleInfoSelect = (breed: any, breedName: string, infoTypeLabel: string) => {
    const infoTypeKey = valueMapRef.current[infoTypeLabel] || 'all';

    const userMessage: Message = {
      id: Date.now().toString(),
      text: infoTypeLabel,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationState('info-shown');

    let infoMessages: Message[] = [];

    if (infoTypeKey === 'origin') {
      infoMessages.push({
        id: (Date.now() + 1).toString(),
        text: `${t('chatbotExt.labels.origin')}: ${breed.origin.state_region}, ${breed.origin.country}\n\n${t('chatbotExt.labels.history')}: ${breed.origin.history}`,
        sender: 'bot',
      });
    } else if (infoTypeKey === 'appearance') {
      infoMessages.push({
        id: (Date.now() + 1).toString(),
        text: `${t('chatbotExt.labels.coatColor')}: ${breed.appearance.coat_color}\n${t('chatbotExt.labels.bodySize')}: ${breed.appearance.body_size}\n${t('chatbotExt.labels.hornShape')}: ${breed.appearance.horn_shape}\n${t('chatbotExt.labels.ears')}: ${breed.appearance.ears}\n\n${t('chatbotExt.labels.distinctiveFeatures')}:\n${breed.appearance.distinctive_features.map((f: string) => `• ${f}`).join('\n')}`,
        sender: 'bot',
      });
    } else if (infoTypeKey === 'milk') {
      infoMessages.push({
        id: (Date.now() + 1).toString(),
        text: `${t('chatbotExt.labels.dailyMilkYield')}: ${breed.productivity.milk_yield_liters_per_day} ${t('chatbotExt.labels.liters')}\n${t('chatbotExt.labels.lactationYield')}: ${breed.productivity.milk_yield_liters_per_lactation} ${t('chatbotExt.labels.liters')}\n${t('chatbotExt.labels.fatContent')}: ${breed.productivity.milk_fat_percentage}%\n${t('chatbotExt.labels.proteinContent')}: ${breed.productivity.milk_protein_percentage}%\n${t('chatbotExt.labels.lactationPeriod')}: ${breed.productivity.lactation_period_days} ${t('chatbotExt.labels.days')}`,
        sender: 'bot',
      });
    } else if (infoTypeKey === 'feeding') {
      infoMessages.push({
        id: (Date.now() + 1).toString(),
        text: `${t('chatbotExt.labels.dailyDryMatter')} (${t('chatbotExt.labels.adult')}): ${breed.feeding.daily_dry_matter_kg.adult} ${t('chatbotExt.labels.kg')}\n${t('chatbotExt.labels.dailyDryMatter')} (${t('chatbotExt.labels.young')}): ${breed.feeding.daily_dry_matter_kg.young} ${t('chatbotExt.labels.kg')}\n\n${t('chatbotExt.labels.preferredFeed')}:\n${breed.feeding.preferred_feed.map((f: string) => `• ${f}`).join('\n')}`,
        sender: 'bot',
      });
    } else if (infoTypeKey === 'health') {
      infoMessages.push({
        id: (Date.now() + 1).toString(),
        text: `${t('chatbotExt.labels.commonDiseases')}: ${breed.health.common_diseases.join(', ')}\n\n${t('chatbotExt.labels.vaccinationsRequired')}:\n${breed.health.vaccination_required.map((v: string) => `• ${v}`).join('\n')}\n\n${t('chatbotExt.labels.lifespan')}: ${breed.health.lifespan_years.range} (${t('chatbotExt.labels.average')}: ${breed.health.lifespan_years.average})`,
        sender: 'bot',
      });
    } else if (infoTypeKey === 'all') {
      infoMessages = [
        {
          id: (Date.now() + 1).toString(),
          text: `${t('chatbotExt.labels.origin')}: ${breed.origin.state_region}, ${breed.origin.country}\n${breed.origin.history}`,
          sender: 'bot',
        },
        {
          id: (Date.now() + 2).toString(),
          text: `👁️ ${t('chatbotExt.options.appearance')}:\n• ${t('chatbotExt.labels.color')}: ${breed.appearance.coat_color}\n• ${t('chatbotExt.labels.size')}: ${breed.appearance.body_size}\n• ${t('chatbotExt.labels.horns')}: ${breed.appearance.horn_shape}\n• ${t('chatbotExt.labels.features')}: ${breed.appearance.distinctive_features.join(', ')}`,
          sender: 'bot',
        },
        {
          id: (Date.now() + 3).toString(),
          text: `🥛 ${t('chatbotExt.options.milk')}:\n• ${t('chatbotExt.labels.daily')}: ${breed.productivity.milk_yield_liters_per_day}L\n• ${t('chatbotExt.labels.perLactation')}: ${breed.productivity.milk_yield_liters_per_lactation}L\n• ${t('chatbotExt.labels.fat')}: ${breed.productivity.milk_fat_percentage}%`,
          sender: 'bot',
        },
        {
          id: (Date.now() + 4).toString(),
          text: `🌾 ${t('chatbotExt.labels.feeding')}: ${breed.feeding.daily_dry_matter_kg.adult}kg/${t('chatbotExt.labels.days')} (${t('chatbotExt.labels.forAdults')})\n${t('chatbotExt.labels.prefers')}: ${breed.feeding.preferred_feed.join(', ')}`,
          sender: 'bot',
        },
      ];
    }

    setIsTyping(true);
    const delay = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {
      setMessages(prev => [...prev, ...infoMessages]);

      const moreSame = t('chatbotExt.moreSame');
      const moreOther = t('chatbotExt.moreOther');

      addToMap(moreSame, 'same');
      addToMap(moreOther, 'other');

      // Ask if they want to know more after a short pause
      setTimeout(() => {
        const askMoreMessage: Message = {
          id: (Date.now() + 10).toString(),
          text: t('chatbotExt.askMore'),
          sender: 'bot',
          options: [moreSame, moreOther],
          onOptionClick: handleMoreOptions,
        };
        setMessages(prev => [...prev, askMoreMessage]);
      }, 1000);
    }, delay);
  };

  const handleMoreOptions = (choiceLabel: string) => {
    const choiceKey = valueMapRef.current[choiceLabel];

    const userMessage: Message = {
      id: Date.now().toString(),
      text: choiceLabel,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    if (choiceKey === 'same') {
      setIsTyping(true);
      const delay = Math.floor(Math.random() * 2000) + 1000;
      setTimeout(() => {
        setIsTyping(false);

        // Setup options map for info types (re-use logic)
        const opts = {
          [t('chatbotExt.options.origin')]: 'origin',
          [t('chatbotExt.options.appearance')]: 'appearance',
          [t('chatbotExt.options.milk')]: 'milk',
          [t('chatbotExt.options.feeding')]: 'feeding',
          [t('chatbotExt.options.health')]: 'health',
          [t('chatbotExt.options.all')]: 'all',
        };
        Object.entries(opts).forEach(([label, key]) => addToMap(label, key));

        const questionMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t('chatbotExt.whatAbout', { breed: selectedBreed.breed_name }),
          sender: 'bot',
          options: Object.keys(opts),
          onOptionClick: (infoType) => handleInfoSelect(selectedBreed, selectedBreed.breed_name, infoType),
        };

        setMessages(prev => [...prev, questionMessage]);
      }, delay);
    } else if (choiceKey === 'other') {
      setConversationState('initial');
      setSelectedCategory(null);
      setSelectedBreed(null);

      setIsTyping(true);
      const delay = Math.floor(Math.random() * 2000) + 1000;

      setTimeout(() => {
        setIsTyping(false);

        const cattleLabel = t('chatbotExt.cattle');
        const buffaloLabel = t('chatbotExt.buffalo');
        addToMap(cattleLabel, 'cattle');
        addToMap(buffaloLabel, 'buffalo');

        const questionMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t('chatbotExt.whatKnow'),
          sender: 'bot',
          options: [cattleLabel, buffaloLabel],
          onOptionClick: handleCategorySelect,
        };

        setMessages(prev => [...prev, questionMessage]);
      }, delay);
    } else {
      setIsTyping(true);
      const delay = Math.floor(Math.random() * 2000) + 1000;

      setTimeout(() => {
        setIsTyping(false);
        const thankYouMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: t('chatbotExt.thankYou'),
          sender: 'bot',
        };
        setMessages(prev => [...prev, thankYouMessage]);

        // Add Start New Chat button
        setTimeout(() => {
          const startNewMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: "Would you like to start a new chat?",
            sender: 'bot',
            options: ["Start New Chat"],
            onOptionClick: (opt) => {
              if (opt === "Start New Chat") startChat();
            }
          };
          setMessages(prev => [...prev, startNewMessage]);
        }, 1000);
      }, delay);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    if (item.sender === 'user') {
      return <UserBubble text={item.text} />;
    } else {
      return (
        <View>
          <AnimatedBotBubble text={item.text} />
          {item.options && item.options.length > 0 && (
            <View style={styles.optionsContainer}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => item.onOptionClick && item.onOptionClick(option)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('chatbotExt.assistantTitle')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={resetChat} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isTyping ? <TypingBubble /> : null}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f4ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34a853',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#34a853',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  refreshButton: {
    padding: 4,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 80,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 48,
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#526ff0ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
