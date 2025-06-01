import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Platform, 
  StatusBar,
  Dimensions,
  Pressable,
  ImageBackground
} from 'react-native';
import { theme } from '@/constants/theme';
import { Search, Filter, Dumbbell, Activity, Flame, TrendingUp } from 'lucide-react-native';
import WorkoutCard from '@/components/WorkoutCard';
import { images } from '@/constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolate,
  withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.28;

export default function WorkoutsScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);
  const categoriesScrollRef = useRef<ScrollView>(null);
  
  // Sample data
  const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga', 'Mobility'];
  
  const workouts = [
    {
      id: '1',
      title: 'Full Body Strength',
      duration: 45,
      calories: 320,
      level: 'Intermediate' as const,
      category: 'Strength',
      imageUrl: images.workouts.strength
    },
    {
      id: '2',
      title: 'High Intensity Cardio',
      duration: 30,
      calories: 380,
      level: 'Advanced' as const,
      category: 'Cardio',
      imageUrl: images.workouts.cardio
    },
    {
      id: '3',
      title: 'Beginner HIIT',
      duration: 20,
      calories: 250,
      level: 'Beginner' as const,
      category: 'HIIT',
      imageUrl: images.workouts.hiit
    },
    {
      id: '4',
      title: 'Full Body Yoga Flow',
      duration: 40,
      calories: 180,
      level: 'Intermediate' as const,
      category: 'Yoga',
      imageUrl: images.workouts.yoga
    },
    {
      id: '5',
      title: 'Total Body Burn',
      duration: 50,
      calories: 420,
      level: 'Advanced' as const,
      category: 'HIIT',
      imageUrl: images.workouts.fullBody
    }
  ];
  
  // Filter workouts based on active category and search query
  const filteredWorkouts = workouts
    .filter(workout => {
      const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        workout.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  
  // Scroll handler for animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -10],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Handle category selection
  const handleCategoryPress = (category: string, index: number) => {
    setActiveCategory(category);
    // Scroll to make the selected category visible
    categoriesScrollRef.current?.scrollTo({
      x: index * 100, // Approximate width of each category button
      animated: true
    });
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <Animated.View style={[styles.container, headerAnimatedStyle]}>
        {/* Header - Fixed at the top */}
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.duration(600).springify()}
        >
          <Text style={styles.title}>Workouts</Text>
          <Text style={styles.subtitle}>Find your perfect workout</Text>
        </Animated.View>
        
        
        
        {/* Main Scrollable Content */}
        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={true}
          overScrollMode="never"
        >
          {/* Categories */}
          <Animated.View
            entering={FadeInDown.duration(600).delay(200).springify()}
            style={styles.categoriesWrapper}
          >
            <ScrollView 
              ref={categoriesScrollRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesScrollContent}
              style={styles.categoriesContainer}
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH}
              nestedScrollEnabled={true}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryButton,
                    activeCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => handleCategoryPress(category, index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      activeCategory === category && styles.activeCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
          
          {/* Featured Workout */}
          <Animated.View 
            style={styles.featuredWorkoutContainer}
            entering={FadeInDown.duration(600).delay(300).springify()}
          >
            <ImageBackground
              source={{ uri: images.workouts.fullBody }}
              style={styles.featuredWorkoutImage}
              imageStyle={{ borderRadius: theme.borderRadius.lg }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <TrendingUp size={14} color="#fff" />
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Weekly Challenge</Text>
                  <Text style={styles.featuredSubtitle}>Complete 3 workouts this week</Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </Animated.View>
          
          {/* Stats Cards */}
          <Animated.View 
            style={styles.statsContainer}
            entering={FadeInDown.duration(600).delay(400).springify()}
          >
            <Pressable style={styles.statCard} android_ripple={{ color: theme.colors.neutral[200], borderless: false }}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.primary[100] }]}>
                <Dumbbell size={20} color={theme.colors.primary[600]} />
              </View>
              <Text style={styles.statValue}>14</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </Pressable>
            
            <Pressable style={styles.statCard} android_ripple={{ color: theme.colors.neutral[200], borderless: false }}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.error[100] }]}>
                <Flame size={20} color={theme.colors.error[600]} />
              </View>
              <Text style={styles.statValue}>8,245</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </Pressable>
            
            <Pressable style={styles.statCard} android_ripple={{ color: theme.colors.neutral[200], borderless: false }}>
              <View style={[styles.statIconContainer, { backgroundColor: theme.colors.success[100] }]}>
                <Activity size={20} color={theme.colors.success[600]} />
              </View>
              <Text style={styles.statValue}>5.2</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </Pressable>
          </Animated.View>
          
          {/* Workouts Section */}
          <Text style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'All Workouts' : `${activeCategory} Workouts`}
          </Text>
          
          {/* Workout Cards */}
          <View style={styles.workoutsListContainer}>
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout, index) => (
                <Animated.View 
                  key={workout.id} 
                  entering={FadeInRight.delay(100 * index).duration(400).springify()}
                  style={styles.workoutCardContainer}
                >
                  <WorkoutCard
                    title={workout.title}
                    duration={workout.duration}
                    calories={workout.calories}
                    level={workout.level}
                    imageUrl={workout.imageUrl}
                    onPress={() => {}}
                  />
                </Animated.View>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No workouts found</Text>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.resetButtonText}>Reset filters</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Bottom padding for safe area */}
          <View style={{ height: 100 + (Platform.OS === 'ios' ? insets.bottom : 0) }} />
        </Animated.ScrollView>
      </Animated.View>
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
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxxl,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    zIndex: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginRight: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.neutral[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  // Main scroll view styles
  mainScrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  // Categories section
  categoriesWrapper: {
    marginBottom: theme.spacing.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoriesScrollContent: {
    paddingRight: theme.spacing.md,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[200],
    marginRight: theme.spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  activeCategoryButton: {
    backgroundColor: theme.colors.primary[600],
  },
  categoryText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral[700],
  },
  activeCategoryText: {
    color: '#fff',
  },
  // Featured workout section
  featuredWorkoutContainer: {
    height: 140,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featuredWorkoutImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
  featuredContent: {
    width: '100%',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  featuredBadgeText: {
    color: '#fff',
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    marginLeft: 4,
  },
  featuredTitle: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xl,
    color: '#fff',
  },
  featuredSubtitle: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Stats section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
  },
  statLabel: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[500],
  },
  // Workouts section
  sectionTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  workoutsListContainer: {
    width: '100%',
  },
  workoutCardContainer: {
    marginBottom: theme.spacing.md,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral[500],
    marginBottom: theme.spacing.md,
  },
  resetButton: {
    backgroundColor: theme.colors.primary[600],
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  resetButtonText: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: '#fff',
  },
});