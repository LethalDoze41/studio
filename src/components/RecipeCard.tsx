'use client';

import Image from 'next/image';
import type { Recipe, SavedRecipe } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart, Flame, ChefHat, Utensils, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { toggleFavoriteRecipe } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  savedRecipes?: SavedRecipe[];
  onToggleFavorite?: (recipe: Recipe, isFavorite: boolean) => void;
}

export default function RecipeCard({ recipe, index, savedRecipes = [], onToggleFavorite }: RecipeCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const placeholderImage = PlaceHolderImages[index % PlaceHolderImages.length] || PlaceHolderImages[0];
  const recipeId = recipe.title.replace(/\s+/g, '-').toLowerCase();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(savedRecipes.some(r => r.id === recipeId));
  }, [savedRecipes, recipeId]);


  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dialog from opening
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to save recipes.' });
      return;
    }

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState); // Optimistic update

    try {
      await toggleFavoriteRecipe(user.uid, recipe, isFavorite);
      toast({
        title: newFavoriteState ? 'Recipe Saved!' : 'Recipe Unsaved',
        description: `"${recipe.title}" has been ${newFavoriteState ? 'added to' : 'removed from'} your favorites.`,
      });
      onToggleFavorite?.(recipe, newFavoriteState);
    } catch (error) {
      setIsFavorite(!newFavoriteState); // Revert on error
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update favorites.' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          <CardHeader className="p-0 relative">
            <div className="relative w-full h-48">
              <Image
                src={placeholderImage.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                data-ai-hint={placeholderImage.imageHint}
              />
            </div>
            {user && (
                 <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/70 hover:bg-background rounded-full h-9 w-9"
                    onClick={handleToggleFavorite}
                    aria-label="Save to favorites"
                >
                    <Heart className={cn("h-5 w-5", isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground/80')} />
                </Button>
            )}
            <div className="p-6 pb-2">
              <CardTitle className="text-xl leading-snug font-headline">
                {recipe.title}
              </CardTitle>
              <CardDescription className="mt-2 text-sm line-clamp-2">
                {recipe.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 pt-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {recipe.cookingTime} min
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <BarChart className="h-3 w-3" /> {recipe.difficulty}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Utensils className="h-3 w-3" /> {recipe.cuisine}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="h-3 w-3" /> {recipe.spiceLevel}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
             <p className="text-xs text-muted-foreground">Serves {recipe.servings}</p>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
             <Image
                src={placeholderImage.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
                data-ai-hint={placeholderImage.imageHint}
              />
          </div>
          <DialogTitle className="text-3xl font-headline">{recipe.title}</DialogTitle>
          <DialogDescription className="text-base">{recipe.description}</DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2 text-sm">
              <Badge variant="outline" className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {recipe.cookingTime} min</Badge>
              <Badge variant="outline" className="flex items-center gap-1.5"><BarChart className="h-4 w-4" /> {recipe.difficulty}</Badge>
              <Badge variant="outline" className="flex items-center gap-1.5"><Utensils className="h-4 w-4" /> {recipe.cuisine}</Badge>
              <Badge variant="outline" className="flex items-center gap-1.5"><ChefHat className="h-4 w-4" /> Serves {recipe.servings}</Badge>
              <Badge variant="outline" className="flex items-center gap-1.5"><Flame className="h-4 w-4" /> {recipe.spiceLevel}</Badge>
          </div>
           {recipe.dietaryCompliance.length > 0 && (
            <div className="pt-2">
              <h4 className="font-semibold mb-2">Dietary Information:</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.dietaryCompliance.map(diet => <Badge key={diet} variant="default">{diet}</Badge>)}
              </div>
            </div>
           )}
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-1">
                <h3 className="text-xl font-bold mb-3 font-headline">Ingredients</h3>
                <ul className="space-y-2 text-sm list-disc list-inside">
                    {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing.quantity} {ing.unit} {ing.name}</li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-3 font-headline">Instructions</h3>
                <ol className="space-y-3 text-sm list-decimal list-inside">
                    {recipe.instructions.map((step, i) => (
                        <li key={i} className="pl-2">{step}</li>
                    ))}
                </ol>
                {recipe.tips && (
                    <>
                        <h3 className="text-xl font-bold mt-6 mb-3 font-headline">Tips</h3>
                        <p className="text-sm italic">{recipe.tips}</p>
                    </>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
