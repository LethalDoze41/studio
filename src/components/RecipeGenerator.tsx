'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { AlertCircle, Camera, Check, ChevronsUpDown, ChefHat, Sparkles, UploadCloud, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { runDetectIngredients, runGenerateRecipes } from '@/app/actions';
import { getSavedRecipes, saveRecipeGeneration } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import RecipeCard from '@/components/RecipeCard';
import { Spinner } from '@/components/Spinner';

import { CUISINES, DIETARY_RESTRICTIONS, MEAL_TYPES, SPICE_LEVELS } from '@/lib/constants';
import type { Recipe, SavedRecipe } from '@/lib/types';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";


export default function RecipeGenerator() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualIngredient, setManualIngredient] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDetecting, startDetectingTransition] = useTransition();
  const [isGenerating, startGeneratingTransition] = useTransition();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mealType, setMealType] = useState('Dinner');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getSavedRecipes(user.uid).then(setSavedRecipes);
    } else {
      setSavedRecipes([]);
    }
  }, [user]);

  const handleImageUpload = (file: File) => {
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 20MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const photoDataUri = e.target?.result as string;
        setImagePreview(photoDataUri);
        startDetectingTransition(async () => {
          const result = await runDetectIngredients({ photoDataUri });
          if (result.success && result.data) {
            setIngredients(prev => [...new Set([...prev, ...result.data!])]);
            toast({
              title: "Ingredients Detected!",
              description: "We've added the detected ingredients to your list.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Detection Failed",
              description: result.error,
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => e.preventDefault();
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const addIngredient = () => {
    if (manualIngredient.trim() && !ingredients.includes(manualIngredient.trim())) {
      setIngredients([...ingredients, manualIngredient.trim()]);
      setManualIngredient('');
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };
  
  const handleGenerate = () => {
    if (ingredients.length < 3) {
      toast({
        variant: "destructive",
        title: "Not enough ingredients",
        description: "Please add at least 3 ingredients to generate recipes.",
      });
      return;
    }
    startGeneratingTransition(async () => {
      setRecipes([]);
      const preferences = {
        ingredients: ingredients.map(name => ({ name })),
        cuisine: cuisines.length > 0 ? cuisines.join(', ') : 'Any',
        mealType,
        dietaryRestrictions,
        spiceLevel
      };
      const result = await runGenerateRecipes(preferences);
      if (result.success && result.data) {
        setRecipes(result.data);
        if (user) {
          await saveRecipeGeneration(user.uid, preferences.ingredients, {cuisine: cuisines, mealType, dietaryRestrictions, spiceLevel}, result.data);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error,
        });
      }
    });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-headline flex items-center justify-center gap-2">
            <ChefHat className="h-8 w-8 text-primary"/>
            Let's Get Cooking!
          </CardTitle>
          <CardDescription className="text-base">
            Add your ingredients by uploading a photo or typing them in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Image Uploader */}
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="font-semibold">Upload a photo of your ingredients</Label>
              <label
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                  "group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 bg-card hover:border-primary transition-colors aspect-video",
                  isDetecting && 'animate-pulse'
                  )}
              >
                  {imagePreview ? (
                      <Image src={imagePreview} alt="Ingredients preview" fill className="object-contain rounded-lg p-2"/>
                  ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
                        <UploadCloud className="h-12 w-12" />
                        <p className="font-semibold">Drag & drop an image or click to upload</p>
                        <p className="text-xs">JPEG, PNG, HEIC up to 20MB</p>
                      </div>
                  )}
                  <Input id="image-upload" type="file" className="sr-only" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/heic" disabled={isDetecting}/>
                  {isDetecting && <Spinner className="absolute h-8 w-8 text-primary"/>}
              </label>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full gap-2">
                <Camera className="h-4 w-4"/>
                Choose Image
              </Button>
            </div>
            {/* Manual Input */}
            <div className="space-y-2">
                <Label htmlFor="manual-ingredient" className="font-semibold">Or add ingredients manually</Label>
                <div className="flex gap-2">
                    <Input
                    id="manual-ingredient"
                    value={manualIngredient}
                    onChange={(e) => setManualIngredient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                    placeholder="e.g., Cherry Tomatoes"
                    />
                    <Button onClick={addIngredient}>Add</Button>
                </div>
                <Card className="mt-2 min-h-[150px] p-3 bg-secondary/50">
                    {ingredients.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {ingredients.map(ing => (
                                <motion.div
                                  key={ing}
                                  layout
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                <Badge variant="default" className="text-sm py-1 pl-3 pr-2 gap-1 bg-primary/20 text-primary-foreground hover:bg-primary/30">
                                    {ing}
                                    <button onClick={() => removeIngredient(ing)} className="rounded-full hover:bg-destructive/20 p-0.5">
                                        <X className="h-3 w-3"/>
                                    </button>
                                </Badge>
                                </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Your ingredients will appear here.
                        </div>
                    )}
                </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Your Preferences</CardTitle>
          <CardDescription>Help us tailor the perfect recipes for you.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
                <Label>Cuisine</Label>
                <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {cuisines.length > 0 ? `${cuisines.length} selected` : "Select cuisines..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search cuisines..." />
                        <CommandList>
                            <CommandEmpty>No cuisine found.</CommandEmpty>
                            <CommandGroup>
                            {CUISINES.map((cuisine) => (
                                <CommandItem key={cuisine} onSelect={() => toggleCuisine(cuisine)}>
                                <Check className={cn("mr-2 h-4 w-4", cuisines.includes(cuisine) ? "opacity-100" : "opacity-0")} />
                                {cuisine}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
            </div>
            <div className="space-y-1.5">
                <Label>Dietary Needs</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {dietaryRestrictions.length > 0 ? `${dietaryRestrictions.length} selected` : "Select diets..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search diets..." />
                         <CommandList>
                            <CommandEmpty>No diet found.</CommandEmpty>
                            <CommandGroup>
                            {DIETARY_RESTRICTIONS.map((diet) => (
                                <CommandItem key={diet} onSelect={() => toggleDietaryRestriction(diet)}>
                                <Check className={cn("mr-2 h-4 w-4", dietaryRestrictions.includes(diet) ? "opacity-100" : "opacity-0")}/>
                                {diet}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
            </div>
            <div className="space-y-1.5">
                <Label>Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{MEAL_TYPES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="space-y-1.5">
                <Label>Spice Level</Label>
                <Select value={spiceLevel} onValueChange={setSpiceLevel}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>{SPICE_LEVELS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      {/* Action Button */}
      <div className="text-center">
        <Button size="lg" onClick={handleGenerate} disabled={isGenerating || ingredients.length < 3} className="w-full md:w-auto gap-2 text-lg py-7 px-8 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-accent hover:bg-accent/90 text-accent-foreground">
          {isGenerating ? <Spinner className="h-6 w-6"/> : <Sparkles className="h-6 w-6"/>}
          Generate Recipes
        </Button>
        {ingredients.length < 3 && <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1"><AlertCircle className="h-4 w-4"/> A minimum of 3 ingredients is required.</p>}
      </div>

      {/* Results */}
      {(isGenerating || recipes.length > 0) && (
        <div className="space-y-6 pt-8">
            <h2 className="text-3xl font-bold text-center font-headline">Your Custom Recipes</h2>
            {isGenerating ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="bg-muted h-48 w-full"></div>
                    <CardHeader><div className="h-6 w-3/4 bg-muted rounded"></div></CardHeader>
                    <CardContent className="space-y-2"><div className="h-4 w-full bg-muted rounded"></div><div className="h-4 w-5/6 bg-muted rounded"></div></CardContent>
                  </Card>
                ))}
              </div>
            ) : (
                <motion.div 
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                    <AnimatePresence>
                    {recipes.map((recipe, i) => (
                        <motion.div
                          key={recipe.title}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <RecipeCard recipe={recipe} index={i} savedRecipes={savedRecipes} onToggleFavorite={() => user && getSavedRecipes(user.uid).then(setSavedRecipes)} />
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
      )}
    </div>
  );
}
