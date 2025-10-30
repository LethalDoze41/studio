'use client';
import { useEffect, useState } from 'react';
import { getSavedRecipes } from '@/lib/firestore';
import type { SavedRecipe, Recipe } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RecipeCard from '../RecipeCard';
import { HeartOff } from 'lucide-react';

interface SavedRecipesProps {
  userId: string;
}

export default function SavedRecipes({ userId }: SavedRecipesProps) {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = () => {
    setLoading(true);
    getSavedRecipes(userId)
      .then(setSavedRecipes)
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    fetchRecipes();
  }, [userId]);

  const handleToggleFavorite = (recipe: Recipe, isFavorite: boolean) => {
    if (!isFavorite) {
        setSavedRecipes(prev => prev.filter(r => r.recipe.title !== recipe.title));
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Recipes</CardTitle>
          <CardDescription>Recipes you want to try later.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Saved Recipes</CardTitle>
        <CardDescription>Recipes you want to try later.</CardDescription>
      </CardHeader>
      <CardContent>
        {savedRecipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {savedRecipes.map(({ recipe }, index) => (
              <RecipeCard key={recipe.title} recipe={recipe} index={index} savedRecipes={savedRecipes} onToggleFavorite={handleToggleFavorite}/>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <HeartOff className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Saved Recipes Yet</h3>
            <p className="text-muted-foreground mt-1">
              Click the heart icon on a recipe to save it here!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
