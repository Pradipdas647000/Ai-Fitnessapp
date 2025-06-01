import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

type StatsCardProps = {
  title: string;
  value: number;
  target?: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
};

export default function StatsCard({ title, value, target, unit, icon, color }: StatsCardProps) {
  const progress = useSharedValue(0);
  
  // Calculate percentage if target is provided
  const percentage = target ? Math.min(Math.round((value / target) * 100), 100) : null;
  
  useEffect(() => {
    progress.value = withTiming(percentage ? percentage / 100 : 0, { duration: 1000 });
  }, [value, target]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {value.toLocaleString()}
          <Text style={styles.unit}> {unit}</Text>
        </Text>
        {target && (
          <Text style={styles.target}>
            of {target.toLocaleString()} {unit}
          </Text>
        )}
      </View>
      
      {target && (
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: color },
              progressStyle,
            ]}
          />
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.fonts.heading.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing.sm,
  },
  valueContainer: {
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.text,
  },
  unit: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.neutral[500],
  },
  target: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[500],
  },
  progressContainer: {
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  percentage: {
    position: 'absolute',
    right: 0,
    top: 12,
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[600],
  },
});