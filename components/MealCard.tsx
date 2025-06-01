import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, Button, Linking } from 'react-native';
import { theme } from '@/constants/theme';
import { UtensilsCrossed, Clock, ChevronRight, X, Play, Users, ChefHat, Flame, Zap } from 'lucide-react-native';

type MealCardProps = {
  title: string;
  imageUrl: string;
  category: string;
  prepTime: number;
  calories: number;
  protein: number;
  videoUrl: string;
  onPress: () => void;
};

// Recipe data based on meal titles
const getRecipeData = (title: string) => {
  const recipes: { [key: string]: any } = {
    'Protein-Rich Salad': {
      servings: 2,
      difficulty: 'Easy',
      carbs: 12,
      fat: 18,
      fiber: 4,
      ingredients: [
        '2 cups mixed greens',
        '1 grilled chicken breast (sliced)',
        '1/2 cup cherry tomatoes',
        '1/4 cup cucumber (diced)',
        '2 tbsp olive oil',
        '1 tbsp balsamic vinegar',
        '1/4 cup feta cheese',
        'Salt and pepper to taste',
      ],
      steps: [
        'Wash and prepare all vegetables',
        'Grill chicken breast until cooked through',
        'Slice chicken and set aside',
        'In a large bowl, combine mixed greens, tomatoes, and cucumber',
        'Whisk olive oil and balsamic vinegar together',
        'Add sliced chicken to the salad',
        'Drizzle with dressing and top with feta cheese',
        'Season with salt and pepper, serve immediately',
      ],
    },
    'Mediterranean Salad': {
      servings: 1,
      difficulty: 'Easy',
      carbs: 15,
      fat: 22,
      fiber: 6,
      ingredients: [
        '3 cups mixed Mediterranean greens',
        '1/2 cup cherry tomatoes',
        '1/4 cup kalamata olives',
        '1/4 cup red onion (sliced)',
        '1/2 cucumber (diced)',
        '1/4 cup feta cheese',
        '2 tbsp extra virgin olive oil',
        '1 tbsp lemon juice',
        '1 tsp dried oregano',
      ],
      steps: [
        'Combine all vegetables in a large bowl',
        'Add olives and feta cheese',
        'Whisk together olive oil, lemon juice, and oregano',
        'Pour dressing over salad and toss gently',
        'Let sit for 5 minutes before serving',
      ],
    },
    'Veggie-Packed Stir Fry': {
      servings: 2,
      difficulty: 'Medium',
      carbs: 20,
      fat: 15,
      fiber: 8,
      ingredients: [
        '2 cups mixed vegetables (broccoli, bell peppers, carrots)',
        '1 tbsp sesame oil',
        '2 cloves garlic (minced)',
        '1 tbsp ginger (grated)',
        '2 tbsp soy sauce',
        '1 tbsp rice vinegar',
        '1 tsp honey',
        '1 tbsp sesame seeds',
      ],
      steps: [
        'Heat sesame oil in a large wok or skillet',
        'Add garlic and ginger, stir-fry for 30 seconds',
        'Add vegetables and stir-fry for 5-7 minutes',
        'Mix soy sauce, rice vinegar, and honey',
        'Pour sauce over vegetables and toss',
        'Cook for 2 more minutes',
        'Garnish with sesame seeds and serve',
      ],
    },
    'Berry and Yogurt Parfait': {
      servings: 1,
      difficulty: 'Easy',
      carbs: 25,
      fat: 8,
      fiber: 5,
      ingredients: [
        '1 cup Greek yogurt',
        '1/2 cup mixed berries',
        '2 tbsp granola',
        '1 tbsp honey',
        '1 tbsp chia seeds',
        '1/4 cup blueberries',
        'Mint leaves for garnish',
      ],
      steps: [
        'Layer half the yogurt in a glass',
        'Add half the berries and granola',
        'Drizzle with honey',
        'Repeat layers',
        'Top with chia seeds and mint',
        'Serve immediately',
      ],
    },
    'Green Energy Smoothie': {
      servings: 1,
      difficulty: 'Easy',
      carbs: 18,
      fat: 6,
      fiber: 7,
      ingredients: [
        '1 cup spinach',
        '1/2 banana',
        '1/2 avocado',
        '1 cup almond milk',
        '1 tbsp protein powder',
        '1 tsp honey',
        'Ice cubes',
      ],
      steps: [
        'Add all ingredients to blender',
        'Blend until smooth',
        'Add ice if needed',
        'Pour into glass',
        'Serve immediately',
      ],
    },
    'Lean Protein Omelette': {
      servings: 1,
      difficulty: 'Medium',
      carbs: 8,
      fat: 20,
      fiber: 2,
      ingredients: [
        '3 large eggs',
        '1/4 cup egg whites',
        '1/4 cup spinach',
        '2 tbsp cheese',
        '1 tbsp olive oil',
        'Salt and pepper',
        'Fresh herbs',
      ],
      steps: [
        'Beat eggs and egg whites together',
        'Heat oil in non-stick pan',
        'Pour in egg mixture',
        'Add spinach and cheese',
        'Fold omelette in half',
        'Cook until set',
        'Garnish with herbs',
      ],
    },
    // Add default recipe for other meals
  };

  return recipes[title] || {
    servings: 1,
    difficulty: 'Easy',
    carbs: 10,
    fat: 5,
    fiber: 3,
    ingredients: ['Recipe ingredients coming soon...'],
    steps: ['Recipe steps will be available soon.'],
  };
};

export default function MealCard({ 
  title, 
  imageUrl, 
  category, 
  prepTime, 
  calories, 
  protein, 
  videoUrl,
  onPress 
}: MealCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const recipeData = getRecipeData(title);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleVideoPress = () => {
    if (videoUrl) {
      Linking.openURL(videoUrl);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={toggleModal} activeOpacity={0.9}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.categoryContainer}>
            <UtensilsCrossed size={14} color={theme.colors.primary[600]} />
            <Text style={styles.category}>{category}</Text>
          </View>
          
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Clock size={14} color={theme.colors.neutral[500]} />
              <Text style={styles.statText}>{prepTime} min</Text>
            </View>
            
            <View style={styles.nutritionContainer}>
              <Text style={styles.nutritionText}>{calories} cal</Text>
              <Text style={styles.nutritionSeparator}>•</Text>
              <Text style={styles.nutritionText}>{protein}g protein</Text>
            </View>
            
            <ChevronRight size={18} color={theme.colors.neutral[400]} />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalImageContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.modalImage} />
                  {videoUrl && (
                    <TouchableOpacity style={styles.playButton} onPress={handleVideoPress}>
                      <Play size={24} color="#fff" fill="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                  <X size={24} color={theme.colors.neutral[600]} />
                </TouchableOpacity>
              </View>

              {/* Title and Category */}
              <View style={styles.modalTitleSection}>
                <View style={styles.modalCategoryContainer}>
                  <UtensilsCrossed size={16} color={theme.colors.primary[600]} />
                  <Text style={styles.modalCategory}>{category}</Text>
                </View>
                <Text style={styles.modalTitle}>{title}</Text>
              </View>

              {/* Quick Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Clock size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.statLabel}>Prep Time</Text>
                  <Text style={styles.statValue}>{prepTime} min</Text>
                </View>
                <View style={styles.statCard}>
                  <Users size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.statLabel}>Servings</Text>
                  <Text style={styles.statValue}>{recipeData.servings}</Text>
                </View>
                <View style={styles.statCard}>
                  <ChefHat size={20} color={theme.colors.primary[600]} />
                  <Text style={styles.statLabel}>Difficulty</Text>
                  <Text style={styles.statValue}>{recipeData.difficulty}</Text>
                </View>
              </View>

              {/* Nutrition Facts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionCard}>
                    <Flame size={18} color={theme.colors.accent[600]} />
                    <Text style={styles.nutritionLabel}>Calories</Text>
                    <Text style={styles.nutritionValue}>{calories}</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Zap size={18} color={theme.colors.success[600]} />
                    <Text style={styles.nutritionLabel}>Protein</Text>
                    <Text style={styles.nutritionValue}>{protein}g</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionIcon}>🍞</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                    <Text style={styles.nutritionValue}>{recipeData.carbs}g</Text>
                  </View>
                  <View style={styles.nutritionCard}>
                    <Text style={styles.nutritionIcon}>🥑</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                    <Text style={styles.nutritionValue}>{recipeData.fat}g</Text>
                  </View>
                </View>
              </View>

              {/* Ingredients */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsList}>
                  {recipeData.ingredients.map((ingredient: string, index: number) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Recipe Steps */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recipe Steps</Text>
                <View style={styles.stepsList}>
                  {recipeData.steps.map((step: string, index: number) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.lg,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.primary[600],
    marginLeft: 4,
  },
  title: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[500],
    marginLeft: 4,
  },
  nutritionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[600],
  },
  nutritionSeparator: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[400],
    marginHorizontal: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '90%',
    paddingBottom: theme.spacing.xl,
  },
  modalHeader: {
    position: 'relative',
    height: 200,
    marginBottom: theme.spacing.md,
  },
  modalImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  modalCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  modalCategory: {
    fontFamily: theme.fonts.body.medium,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary[600],
    marginLeft: theme.spacing.xs,
  },
  modalTitle: {
    fontFamily: theme.fonts.heading.bold,
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.text,
    lineHeight: 28,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.neutral[100],
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.xs,
  },
  statValue: {
    fontFamily: theme.fonts.body.semiBold,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.fonts.heading.semiBold,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  nutritionIcon: {
    fontSize: 18,
  },
  nutritionLabel: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.xs,
  },
  nutritionValue: {
    fontFamily: theme.fonts.body.bold,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginTop: 2,
  },
  ingredientsList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary[600],
    marginRight: theme.spacing.sm,
  },
  ingredientText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    flex: 1,
  },
  stepsList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: theme.fonts.body.bold,
    fontSize: theme.fontSizes.xs,
    color: '#fff',
  },
  stepText: {
    fontFamily: theme.fonts.body.regular,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
});