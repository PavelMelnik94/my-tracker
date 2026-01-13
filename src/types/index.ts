export interface MealEntry {
  id: string;
  date: string; // ISO format
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2' | 'snack3';
  time: string;
  description: string;
  calories: number;
  completed: boolean;
}

export interface SupplementEntry {
  id: string;
  date: string;
  supplement: 'vitamin-d3' | 'omega-3' | 'magnesium';
  taken: boolean;
  time?: string;
}

export interface WellbeingEntry {
  id: string;
  date: string;
  energy: number; // 1-10
  sleep: number;
  mood: number;
  stress: number;
  libido?: number;
  notes?: string;
}

export interface MeasurementEntry {
  id: string;
  date: string;
  weight: number;
  waist?: number;
  hips?: number;
  chest?: number;
}

export interface BloodTestEntry {
  id: string;
  date: string;
  leptin?: number;
  vitaminD?: number;
  iron?: number;
  homaIR?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  steps: string[];
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  image?: string;
}

export interface HealthData {
  meals: MealEntry[];
  supplements: SupplementEntry[];
  wellbeing: WellbeingEntry[];
  measurements: MeasurementEntry[];
  bloodTests: BloodTestEntry[];
  recipes: Recipe[];
}
