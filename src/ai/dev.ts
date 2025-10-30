import { config } from 'dotenv';
config();

import '@/ai/flows/detect-ingredients-from-image.ts';
import '@/ai/flows/generate-recipes-from-ingredients.ts';