import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet, Image } from 'react-native';

export const AnimatedBotBubble = ({ text }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.botBubbleContainer, { opacity: fadeAnim }]}>
      <Image source={require('../assets/images/icon.png')} style={styles.avatar} />
      <View style={styles.botBubble}>
        <Text style={styles.botText}>{text}</Text>
      </View>
    </Animated.View>
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
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
  },
});

export const TypingBubble = () => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (anim, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
            delay: delay,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      ).start();
    };

    animate(dot1Opacity, 0);
    animate(dot2Opacity, 200);
    animate(dot3Opacity, 400);
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.botBubbleContainer}>
      <Image source={require('../assets/images/icon.png')} style={styles.avatar} />
      <View style={styles.botBubble}>
        <View style={styles.typingContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      </View>
    </View>
  );
};