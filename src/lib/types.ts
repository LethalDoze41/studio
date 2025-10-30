import type { GenerateRecipesFromIngredientsOutput } from '@/ai/flows/generate-recipes-from-ingredients';
import type { Timestamp } from 'firebase/firestore';

export type Recipe = GenerateRecipesFromIngredientsOutput[number];

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt: Timestamp;
  photoURL?: string | null;
  defaultDietaryRestrictions?: string[];
  defaultCuisines?: string[];
  defaultSpiceLevel?: string;
}

export interface SavedRecipe {
  id: string;
  recipe: Recipe;
  savedAt: Timestamp;
}

export interface RecipeHistoryItem {
  id: string;
  ingredients: { name: string }[];
  preferences: {
    cuisine: string[];
    mealType: string;
    dietaryRestrictions: string[];
    spiceLevel: string;
  };
  generatedAt: Timestamp;
  recipes: Recipe[];
}
