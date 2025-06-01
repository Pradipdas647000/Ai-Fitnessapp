import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { Bot } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

type AIMessageBubbleProps = {
  message: string;
  timestamp: Date;
};

export default function AIMessageBubble({ message, timestamp }: AIMessageBubbleProps) {
  // Format timestamp
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <Animated.View entering={FadeInRight.duration(300)} style={styles.container}>
      <View style={styles.iconContainer}>
        <Bot size={20} color="#fff" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.timestamp}>{formattedTime}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  contentContainer: {
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.lg,
    borderTopLeftRadius: 0,
    padding: theme.spacing.md,
    flex: 1,
  },
  message: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  timestamp: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[500],
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
});