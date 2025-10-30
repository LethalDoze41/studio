// src/app/actions.ts
'use server';

import { detectIngredientsFromImage, type DetectIngredientsFromImageInput } from '@/ai/flows/detect-ingredients-from-image';
import { generateRecipesFromIngredients, type GenerateRecipesFromIngredientsInput } from '@/ai/flows/generate-recipes-from-ingredients';

export async function runGenerateRecipes(input: GenerateRecipesFromIngredientsInput) {
  try {
    const recipes = await generateRecipesFromIngredients(input);
    if (!recipes || recipes.length === 0) {
      return { success: false, error: 'Could not generate recipes. Try adjusting your preferences.' };
    }
    return { success: true, data: recipes };
  } catch (error) {
    console.error('Error generating recipes:', error);
    return { success: false, error: 'An unexpected error occurred while generating recipes.' };
  }
}

export async function runDetectIngredients(input: DetectIngredientsFromImageInput) {
  try {
    const { ingredients } = await detectIngredientsFromImage(input);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    return { success: false, error: 'An unexpected error occurred while detecting ingredients.' };
  }
}
