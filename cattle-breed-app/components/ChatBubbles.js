import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// BotBubble Component
export const BotBubble = ({ text }) => {
  return (
    <View style={styles.botBubbleContainer}>
      <Image source={require('../assets/images/icon.png')} style={styles.avatar} />
      <View style={styles.botBubble}>
        <Text style={styles.botText}>{text}</Text>
      </View>
    </View>
  );
};

// UserBubble Component
export const UserBubble = ({ text }) => {
  return (
    <View style={styles.userBubbleContainer}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  botBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  botText: {
    color: '#333',
    fontSize: 16,
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
});