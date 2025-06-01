export interface DailyStats {
  id: string;
  userId: string;
  date: Date;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  distanceCovered: number; // in kilometers
  workoutsCompleted: WorkoutRecord[];
  mealsLogged: MealRecord[];
}

export interface WorkoutRecord {
  id: string;
  workoutId: string;
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  completedAt: Date;
}

export interface MealRecord {
  id: string;
  mealId?: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  consumedAt: Date;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'hiit' | 'yoga' | 'mobility';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  caloriesBurn: number; // estimated calories
  imageUrl: string;
  exercises: Exercise[];
  instructions?: string;
  voiceGuidance?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps?: number;
  duration?: number; // in seconds
  restBetweenSets: number; // in seconds
  imageUrl?: string;
  videoUrl?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'smoothie';
  prepTime: number; // in minutes
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  imageUrl: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionalInfo?: string;
  videoUrl?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}