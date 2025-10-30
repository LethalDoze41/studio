import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Recipe, RecipeHistoryItem, SavedRecipe } from './types';

// --- Favorite Recipes ---

export const toggleFavoriteRecipe = async (userId: string, recipe: Recipe, isFavorite: boolean) => {
  const recipeId = recipe.title.replace(/\s+/g, '-').toLowerCase();
  const dbInstance = db;
  const favRecipeRef = doc(dbInstance, 'users', userId, 'savedRecipes', recipeId);

  if (isFavorite) {
    await deleteDoc(favRecipeRef);
  } else {
    await setDoc(favRecipeRef, {
      id: recipeId,
      recipe: recipe,
      savedAt: serverTimestamp(),
    });
  }
};

export const getSavedRecipes = async (userId: string): Promise<SavedRecipe[]> => {
  const dbInstance = db;
  const savedRecipesRef = collection(dbInstance, 'users', userId, 'savedRecipes');
  const q = query(savedRecipesRef, orderBy('savedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as SavedRecipe);
};


// --- Recipe History ---

export const saveRecipeGeneration = async (
  userId: string, 
  ingredients: { name: string }[],
  preferences: RecipeHistoryItem['preferences'],
  recipes: Recipe[]
  ) => {
    const dbInstance = db;
    const historyCollectionRef = collection(dbInstance, 'users', userId, 'recipeHistory');
    await addDoc(historyCollectionRef, {
      ingredients,
      preferences,
      recipes,
      generatedAt: serverTimestamp(),
    });
}
