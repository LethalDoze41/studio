'use server';

/**
 * @fileOverview Generates personalized recipes based on user-provided ingredients and dietary preferences.
 *
 * - generateRecipesFromIngredients - A function that takes ingredients and preferences and returns a list of recipes.
 * - GenerateRecipesFromIngredientsInput - The input type for the generateRecipesFromIngredients function.
 * - GenerateRecipesFromIngredientsOutput - The return type for the generateRecipesFromIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IngredientSchema = z.object({
  name: z.string().describe('The name of the ingredient.'),
  quantity: z.string().optional().describe('The quantity of the ingredient.'),
  unit: z.string().optional().describe('The unit of measurement for the ingredient.'),
});

const RecipeSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  description: z.string().describe('A brief description of the recipe.'),
  cuisine: z.string().describe('The cuisine type of the recipe.'),
  mealType: z.string().describe('The meal type of the recipe.'),
  spiceLevel: z.string().describe('The spice level of the recipe.'),
  cookingTime: z.number().describe('The total cooking time in minutes (prep + cook).'),
  difficulty: z.string().describe('The difficulty level of the recipe (Easy, Medium, Hard).'),
  servings: z.number().describe('The number of servings the recipe makes.'),
  ingredients: z.array(IngredientSchema).describe('A list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('Step-by-step instructions for preparing the recipe.'),
  tips: z.string().optional().describe('Optional cooking tips or variations.'),
  dietaryCompliance: z.array(z.string()).describe('A list of dietary compliances the recipe adheres to (e.g., Vegetarian, Gluten-Free).'),
});

const GenerateRecipesFromIngredientsInputSchema = z.object({
  ingredients: z.array(IngredientSchema).describe('A list of ingredients to use in the recipes.'),
  cuisine: z.string().describe('The desired cuisine type (e.g., Italian, Mexican, Chinese). Use \'any\' for no preference.'),
  mealType: z.string().describe('The desired meal type (e.g., Breakfast, Lunch, Dinner).'),
  dietaryRestrictions: z.array(z.string()).describe('A list of dietary restrictions to comply with (e.g., Vegetarian, Vegan, Gluten-Free).'),
  spiceLevel: z.string().describe('The desired spice level (None, Mild, Medium, Hot, Extra Hot).'),
});

export type GenerateRecipesFromIngredientsInput = z.infer<typeof GenerateRecipesFromIngredientsInputSchema>;

const GenerateRecipesFromIngredientsOutputSchema = z.array(RecipeSchema);

export type GenerateRecipesFromIngredientsOutput = z.infer<typeof GenerateRecipesFromIngredientsOutputSchema>;

export async function generateRecipesFromIngredients(
    input: GenerateRecipesFromIngredientsInput
): Promise<GenerateRecipesFromIngredientsOutput> {
  return generateRecipesFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesFromIngredientsPrompt',
  input: {schema: GenerateRecipesFromIngredientsInputSchema},
  output: {schema: GenerateRecipesFromIngredientsOutputSchema},
  prompt: `Generate 3 diverse recipes using these ingredients: {{#each ingredients}}{{{name}}}{{#if quantity}} ({{{quantity}}} {{{unit}}}){{/if}}{{#unless @last}}, {{/unless}}{{/each}}

Requirements:
- Cuisine: {{{cuisine}}}
- Meal type: {{{mealType}}}
- Dietary restrictions: MUST comply with {{#each dietaryRestrictions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Spice level: {{{spiceLevel}}}
- Difficulty: Include varied difficulty levels (at least one easy option)
- Use at least 80% of provided ingredients
- Clearly indicate any additional ingredients needed

For each recipe, provide:
1. Title (creative, appetizing)
2. Description (2-3 sentences highlighting key flavors)
3. Cooking time in minutes (prep + cook)
4. Difficulty (Easy/Medium/Hard)
5. Servings (number)
6. Ingredients with precise measurements
7. Step-by-step instructions (numbered, clear, concise)
8. Cooking tips (optional but helpful)

Return response as a JSON array with this structure:
[{
  "title": string,
  "description": string,
  "cuisine": string,
  "mealType": string,
  "spiceLevel": string,
  "cookingTime": number,
  "difficulty": string,
  "servings": number,
  "ingredients": [{"name": string, "quantity": string, "unit": string}],
  "instructions": [string],
  "tips": string,
  "dietaryCompliance": [string]
}]`,

  // Add a fix step to the prompt to handle any formatting or schema-related errors in the AI's response.
  fix: {
    prompt: `The AI response had the following errors: {{{error}}}. Please fix them and provide the response in the correct format.`,
  },
});

const generateRecipesFromIngredientsFlow = ai.defineFlow(
    {
      name: 'generateRecipesFromIngredientsFlow',
      inputSchema: GenerateRecipesFromIngredientsInputSchema,
      outputSchema: GenerateRecipesFromIngredientsOutputSchema,
    },
    async input => {
      const {output} = await prompt(input);
      return output!;
    }
);
