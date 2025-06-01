import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { FadeInLeft } from 'react-native-reanimated';

type UserMessageBubbleProps = {
  message: string;
  timestamp: Date;
  imageUri?: string | null; // Ensure this is optional
};

export default function UserMessageBubble({ message, timestamp, imageUri }: UserMessageBubbleProps) {
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <Animated.View entering={FadeInLeft.duration(300)} style={styles.container}>
      <View style={styles.contentContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  contentContainer: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.lg,
    borderTopRightRadius: 0,
    padding: theme.spacing.md,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  message: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: '#fff',
    lineHeight: 22,
  },
  timestamp: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
});
