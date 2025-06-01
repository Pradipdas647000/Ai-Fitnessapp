export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';
  height?: number; // in cm
  weight?: number; // in kg
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  dietaryPreferences?: string[];
  foodAllergies?: string[];
}