import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { theme } from '@/constants/theme';
import { Footprints, Flame, Timer, ChevronRight, LogOut, Bot, Target, TrendingUp } from 'lucide-react-native';
import StatsCard from '@/components/StatsCard';
import WorkoutCard from '@/components/WorkoutCard';
import MealCard from '@/components/MealCard';
import { images } from '@/constants/images';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';
import { useUser } from '../../context/UserContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userContext = useUser();
  const user = userContext?.user;
  
  // Sample data
  const fitnessStats = {
    steps: 7652,
    stepsTarget: 10000,
    calories: 450,
    caloriesTarget: 600,
    minutes: 35,
    minutesTarget: 60
  };
  
  const workouts = [
    {
      title: 'Full Body Strength',
      duration: 45,
      calories: 320,
      level: 'Intermediate' as const,
      imageUrl: images.workouts.strength
    },
    {
      title: 'Yoga Flexibility',
      duration: 30,
      calories: 200,
      level: 'Beginner' as const,
      imageUrl: images.workouts.yoga
    },
    {
      title: 'HIIT Cardio',
      duration: 20,
      calories: 400,
      level: 'Advanced' as const,
      imageUrl: images.workouts.hiit
    }
  ];
  
  const meals = [
    {
      title: 'Protein-Rich Smoothie Bowl',
      imageUrl: images.nutrition.protein,
      category: 'Breakfast',
      prepTime: 10,
      calories: 320,
      protein: 24
    },
    {
      title: 'Grilled Chicken Salad',
      imageUrl: images.nutrition.healthy,
      category: 'Lunch',
      prepTime: 15,
      calories: 450,
      protein: 35
    },
    {
      title: 'Quinoa and Veggie Stir Fry',
      imageUrl: images.nutrition.vegetables,
      category: 'Dinner',
      prepTime: 20,
      calories: 500,
      protein: 20
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear user data from context
            userContext?.setUser(null);
            // Navigate to auth screen
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {user?.name ? `Hello, ${user.name}! 👋` : 'Welcome to BodyBoss! 💪'}
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={20} color={theme.colors.neutral[600]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          {/* Main Progress Card */}
          <View style={styles.mainProgressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressHeaderLeft}>
                <Target size={24} color={theme.colors.primary[600]} />
                <Text style={styles.progressTitle}>Daily Goals</Text>
              </View>
              <View style={styles.progressPercentage}>
                <TrendingUp size={16} color={theme.colors.success[600]} />
                <Text style={styles.progressPercentageText}>68%</Text>
              </View>
            </View>
            
            <View style={styles.progressStats}>
              {/* Steps Progress */}
              <View style={styles.progressItem}>
                <View style={styles.progressItemHeader}>
                  <View style={styles.progressItemLeft}>
                    <Footprints size={18} color={theme.colors.primary[600]} />
                    <Text style={styles.progressItemTitle}>Steps</Text>
                  </View>
                  <Text style={styles.progressItemValue}>
                    {fitnessStats.steps.toLocaleString()} / {fitnessStats.stepsTarget.toLocaleString()}
                  </Text>
                </View>
                <Progress.Bar
                  progress={fitnessStats.steps / fitnessStats.stepsTarget}
                  width={null}
                  height={8}
                  color={theme.colors.primary[500]}
                  unfilledColor={theme.colors.neutral[200]}
                  borderWidth={0}
                  borderRadius={4}
                  style={styles.progressBar}
                />
              </View>

              {/* Calories Progress */}
              <View style={styles.progressItem}>
                <View style={styles.progressItemHeader}>
                  <View style={styles.progressItemLeft}>
                    <Flame size={18} color={theme.colors.error[500]} />
                    <Text style={styles.progressItemTitle}>Calories</Text>
                  </View>
                  <Text style={styles.progressItemValue}>
                    {fitnessStats.calories} / {fitnessStats.caloriesTarget} cal
                  </Text>
                </View>
                <Progress.Bar
                  progress={fitnessStats.calories / fitnessStats.caloriesTarget}
                  width={null}
                  height={8}
                  color={theme.colors.error[500]}
                  unfilledColor={theme.colors.neutral[200]}
                  borderWidth={0}
                  borderRadius={4}
                  style={styles.progressBar}
                />
              </View>

              {/* Active Minutes Progress */}
              <View style={styles.progressItem}>
                <View style={styles.progressItemHeader}>
                  <View style={styles.progressItemLeft}>
                    <Timer size={18} color={theme.colors.success[500]} />
                    <Text style={styles.progressItemTitle}>Active Time</Text>
                  </View>
                  <Text style={styles.progressItemValue}>
                    {fitnessStats.minutes} / {fitnessStats.minutesTarget} min
                  </Text>
                </View>
                <Progress.Bar
                  progress={fitnessStats.minutes / fitnessStats.minutesTarget}
                  width={null}
                  height={8}
                  color={theme.colors.success[500]}
                  unfilledColor={theme.colors.neutral[200]}
                  borderWidth={0}
                  borderRadius={4}
                  style={styles.progressBar}
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* AI Assistant Card */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <TouchableOpacity style={styles.aiAssistantCard} onPress={() => router.push('/(tabs)/assistant')}>
            <View style={styles.aiAssistantIconContainer}>
              <Bot size={24} color="#fff" />
            </View>
            <View style={styles.aiAssistantContent}>
              <Text style={styles.aiAssistantTitle}>AI Fitness Assistant</Text>
              <Text style={styles.aiAssistantDescription}>
                Get personalized workout tips and nutrition advice
              </Text>
              <View style={styles.aiAssistantButton}>
                <Text style={styles.aiAssistantButtonText}>Chat Now</Text>
                <ChevronRight size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Workouts</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={theme.colors.primary[600]} />
            </TouchableOpacity>
          </View>
          {workouts.map((workout, index) => (
            <WorkoutCard
              key={index}
              title={workout.title}
              duration={workout.duration}
              calories={workout.calories}
              level={workout.level}
              imageUrl={workout.imageUrl}
              onPress={() => {}}
            />
          ))}
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Meals</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={theme.colors.primary[600]} />
            </TouchableOpacity>
          </View>
          {meals.map((meal, index) => (
            <MealCard
              key={index}
              title={meal.title}
              imageUrl={meal.imageUrl}
              category={meal.category}
              prepTime={meal.prepTime}
              calories={meal.calories}
              protein={meal.protein}
              onPress={() => { } } videoUrl={''}            />
          ))}
        </Animated.View>
        
        
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[500],
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  mainProgressCard: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
    borderWidth: 1,
    borderColor: theme.colors.neutral[100],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  progressPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success[100],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  progressPercentageText: {
    fontFamily: theme.fonts.body.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.success[600],
    marginLeft: 4,
  },
  progressStats: {
    gap: theme.spacing.lg,
  },
  progressItem: {
    gap: theme.spacing.sm,
  },
  progressItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressItemTitle: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  progressItemValue: {
    fontFamily: theme.fonts.body.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
  progressBar: {
    marginTop: theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary[600],
    marginRight: 4,
  },
  aiAssistantCard: {
    backgroundColor: theme.colors.primary[100],
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    ...theme.shadows.md,
  },
  aiAssistantIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  aiAssistantContent: {
    flex: 1,
  },
  aiAssistantTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  aiAssistantDescription: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing.sm,
  },
  aiAssistantButton: {
    backgroundColor: theme.colors.primary[600],
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  aiAssistantButtonText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: '#fff',
    marginRight: 4,
  },
  bottomPadding: {
    height: 100,
  },
});
