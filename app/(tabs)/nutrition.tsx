import React, { useState, useCallback, useRef } from 'react';
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
import { Search, Filter, Dumbbell, Heart, Utensils, Clock } from 'lucide-react-native';
import MealCard from '@/components/MealCard';
import { images } from '@/constants/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function NutritionScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useSharedValue(0);
  const categoriesScrollRef = useRef<ScrollView>(null);

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Smoothies', 'Pre-Workout', 'Post-Workout'];

  const meals = [
    {
    id: '1',
    title: 'Protein-Rich Salad',
    imageUrl: images.nutrition.protein,
    category: 'Breakfast',
    prepTime: 10,
    calories: 320,
    protein: 24,
    videoUrl: 'https://youtube.com/shorts/A-6BYHoCuLs?si=tNfw7tgmuuiZ7ZCH'
  },
  {
    id: '2',
    title: 'Mediterranean Salad',
    imageUrl: images.nutrition.healthy,
    category: 'Lunch',
    prepTime: 20,
    calories: 410,
    protein: 35,
    videoUrl: 'https://youtu.be/-VDlsEIltho?si=PO1KzptUXjPjfIfc'
  },
  {
    id: '3',
    title: 'Veggie-Packed Stir Fry',
    imageUrl: images.nutrition.vegetables,
    category: 'Dinner',
    prepTime: 25,
    calories: 380,
    protein: 22,
    videoUrl: 'https://youtu.be/spDs_wzn8To?si=YDive0FXHT5tn03l'
  },
  {
    id: '4',
    title: 'Berry and Yogurt Parfait',
    imageUrl: images.nutrition.fruits,
    category: 'Snacks',
    prepTime: 5,
    calories: 180,
    protein: 12,
    videoUrl: 'https://youtu.be/aYwkYRm12QM?si=8tl8s-aQ6wUap2wE'
  },
  {
    id: '5',
    title: 'Green Energy Smoothie',
    imageUrl: images.nutrition.smoothies,
    category: 'Smoothies',
    prepTime: 8,
    calories: 210,
    protein: 15,
    videoUrl: 'https://youtu.be/M_AcyTqgB_8?si=V0u3KbkJlKCP1Kcs'
  },
  {
    id: '6',
    title: 'Lean Protein Omelette',
    imageUrl: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg',
    category: 'Breakfast',
    prepTime: 15,
    calories: 350,
    protein: 28,
    videoUrl: 'https://youtube.com/shorts/IZbIadtqFMk?si=YXM0M4h2iemc6B-n'
  },
  {
    id: '7',
    title: 'Quinoa Power Bowl',
    imageUrl: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg',
    category: 'Lunch',
    prepTime: 25,
    calories: 420,
    protein: 18,
    videoUrl: 'https://youtu.be/rIYqwpgNhu0?si=l1_0v521j0zUht5z'
  },
  {
    id: '8',
    title: 'Grilled Salmon with Asparagus',
    imageUrl: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg',
    category: 'Dinner',
    prepTime: 30,
    calories: 450,
    protein: 40,
    videoUrl: 'https://youtu.be/Kdq3khk_8n0?si=igZ2sqqdlBj1i_hc'
  },
  {
    id: '9',
    title: 'Protein Energy Balls',
    imageUrl: 'https://images.pexels.com/photos/1028598/pexels-photo-1028598.jpeg',
    category: 'Snacks',
    prepTime: 20,
    calories: 150,
    protein: 10,
    videoUrl: 'https://youtu.be/1noPmYc_DxI?si=YLKlZEQ8vyRy4hvi'
  },
  {
    id: '10',
    title: 'BCAA Recovery Smoothie',
    imageUrl: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg',
    category: 'Post-Workout',
    prepTime: 5,
    calories: 220,
    protein: 30,
    videoUrl: 'https://youtu.be/7ekbO2edWo8?si=hHK352E--zNr7tQZ'
  },
  {
    id: '11',
    title: 'Banana Peanut Butter Shake',
    imageUrl: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg',
    category: 'Pre-Workout',
    prepTime: 5,
    calories: 280,
    protein: 20,
    videoUrl: 'https://youtu.be/FSCVgmLjjQI?si=IAFxWJnb2bhge18w'
  }/* meal data here */]; // keep meals as in your input

  const filteredMeals = useCallback(() => {
    let filtered = meals;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(meal => meal.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(meal => 
        meal.title.toLowerCase().includes(query) || 
        meal.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery, meals]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.9], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -10], Extrapolate.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const handleCategoryPress = (category: string, index: number) => {
    setActiveCategory(category);
    categoriesScrollRef.current?.scrollTo({ x: index * 100, animated: true });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top }]}> 
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <Animated.View style={[styles.container, headerAnimatedStyle]}>
        <Animated.View style={styles.header} entering={FadeInDown.duration(600).springify()}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Fuel your fitness journey</Text>
        </Animated.View>

        <Animated.ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={true}
          overScrollMode="never"
        >
          <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.categoriesWrapper}>
            <ScrollView 
              ref={categoriesScrollRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesScrollContent}
              style={styles.categoriesContainer}
              decelerationRate="fast"
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
                  onPress={() => handleCategoryPress(category, index)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Featured Meal */}
          <Animated.View style={styles.featuredMealContainer} entering={FadeInDown.duration(600).delay(300).springify()}>
            <TouchableOpacity
              style={styles.featuredMealTouchable}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: images.nutrition.healthy }}
                style={styles.featuredMealImage}
                imageStyle={{ borderRadius: theme.borderRadius.lg }}
              >
                <View style={styles.featuredGradient}>
                  <View style={styles.featuredContent}>
                    <View style={styles.featuredBadge}>
                      <Utensils size={16} color="#fff" />
                      <Text style={styles.featuredBadgeText}>Featured</Text>
                    </View>
                    <Text style={styles.featuredTitle}>Mediterranean Salad</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>

          {/* Meal List */}
          <View style={styles.mealList}>
            {filteredMeals().map(meal => (
              <MealCard
                key={meal.id}
                title={meal.title}
                imageUrl={meal.imageUrl}
                category={meal.category}
                prepTime={meal.prepTime}
                calories={meal.calories}
                protein={meal.protein}
                videoUrl={meal.videoUrl}
                onPress={() => {
                  
                  // TODO: handle meal card press, e.g., navigate to details
                }}
              />
            ))}
          </View>
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
  // Featured meal section
  featuredMealContainer: {
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
  featuredMealTouchable: {
    width: '100%',
    height: '100%',
  },
  featuredMealImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  // Meals section
  sectionTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  mealsListContainer: {
    width: '100%',
  },
  mealCardContainer: {
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // Android shadow is handled in the MealCard component
      },
    }),
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
  mealList: {
    width: '100%',
  },
});// define your styles here as needed

