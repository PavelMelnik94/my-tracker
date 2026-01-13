import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MealEntry,
  SupplementEntry,
  WellbeingEntry,
  MeasurementEntry,
  BloodTestEntry,
  Recipe,
} from '../../../shared/types';

interface HealthStore {
  // State
  meals: MealEntry[];
  supplements: SupplementEntry[];
  wellbeing: WellbeingEntry[];
  measurements: MeasurementEntry[];
  bloodTests: BloodTestEntry[];
  recipes: Recipe[];

  // Meal actions
  addMeal: (meal: MealEntry) => void;
  updateMeal: (id: string, meal: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  toggleMealCompleted: (id: string) => void;

  // Supplement actions
  addSupplement: (supplement: SupplementEntry) => void;
  updateSupplement: (id: string, supplement: Partial<SupplementEntry>) => void;
  toggleSupplementTaken: (id: string) => void;

  // Wellbeing actions
  addWellbeing: (entry: WellbeingEntry) => void;
  updateWellbeing: (id: string, entry: Partial<WellbeingEntry>) => void;
  deleteWellbeing: (id: string) => void;

  // Measurement actions
  addMeasurement: (entry: MeasurementEntry) => void;
  updateMeasurement: (id: string, entry: Partial<MeasurementEntry>) => void;
  deleteMeasurement: (id: string) => void;

  // Blood test actions
  addBloodTest: (entry: BloodTestEntry) => void;
  updateBloodTest: (id: string, entry: Partial<BloodTestEntry>) => void;
  deleteBloodTest: (id: string) => void;

  // Recipe actions
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  trackRecipeCooked: (recipe: Recipe) => void;

  // Utility actions
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      meals: [],
      supplements: [],
      wellbeing: [],
      measurements: [],
      bloodTests: [],
      recipes: [],

      // Meal actions
      addMeal: (meal) =>
        set((state) => ({ meals: [...state.meals, meal] })),
      
      updateMeal: (id, updatedMeal) =>
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, ...updatedMeal } : m
          ),
        })),
      
      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
        })),
      
      toggleMealCompleted: (id) =>
        set((state) => ({
          meals: state.meals.map((m) =>
            m.id === id ? { ...m, completed: !m.completed } : m
          ),
        })),

      // Supplement actions
      addSupplement: (supplement) =>
        set((state) => ({ supplements: [...state.supplements, supplement] })),
      
      updateSupplement: (id, updatedSupplement) =>
        set((state) => ({
          supplements: state.supplements.map((s) =>
            s.id === id ? { ...s, ...updatedSupplement } : s
          ),
        })),
      
      toggleSupplementTaken: (id) =>
        set((state) => ({
          supplements: state.supplements.map((s) =>
            s.id === id ? { ...s, taken: !s.taken } : s
          ),
        })),

      // Wellbeing actions
      addWellbeing: (entry) =>
        set((state) => ({ wellbeing: [...state.wellbeing, entry] })),
      
      updateWellbeing: (id, updatedEntry) =>
        set((state) => ({
          wellbeing: state.wellbeing.map((w) =>
            w.id === id ? { ...w, ...updatedEntry } : w
          ),
        })),
      
      deleteWellbeing: (id) =>
        set((state) => ({
          wellbeing: state.wellbeing.filter((w) => w.id !== id),
        })),

      // Measurement actions
      addMeasurement: (entry) =>
        set((state) => ({ measurements: [...state.measurements, entry] })),
      
      updateMeasurement: (id, updatedEntry) =>
        set((state) => ({
          measurements: state.measurements.map((m) =>
            m.id === id ? { ...m, ...updatedEntry } : m
          ),
        })),
      
      deleteMeasurement: (id) =>
        set((state) => ({
          measurements: state.measurements.filter((m) => m.id !== id),
        })),

      // Blood test actions
      addBloodTest: (entry) =>
        set((state) => ({ bloodTests: [...state.bloodTests, entry] })),
      
      updateBloodTest: (id, updatedEntry) =>
        set((state) => ({
          bloodTests: state.bloodTests.map((b) =>
            b.id === id ? { ...b, ...updatedEntry } : b
          ),
        })),
      
      deleteBloodTest: (id) =>
        set((state) => ({
          bloodTests: state.bloodTests.filter((b) => b.id !== id),
        })),

      // Recipe actions
      addRecipe: (recipe) =>
        set((state) => ({ recipes: [...state.recipes, recipe] })),
      
      updateRecipe: (id, updatedRecipe) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updatedRecipe } : r
          ),
        })),
      
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        })),

      trackRecipeCooked: (recipe) => {
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().slice(0, 5);
        
        // Determine meal type based on current time
        const hour = now.getHours();
        let mealType: MealEntry['type'];
        if (hour >= 6 && hour < 11) {
          mealType = 'breakfast';
        } else if (hour >= 11 && hour < 16) {
          mealType = 'lunch';
        } else if (hour >= 16 && hour < 21) {
          mealType = 'dinner';
        } else {
          mealType = 'snack1';
        }

        const mealEntry: MealEntry = {
          id: `meal-${Date.now()}`,
          date: currentDate,
          type: mealType,
          time: currentTime,
          description: `${recipe.name} (из рецепта)`,
          calories: recipe.calories,
          completed: true,
        };

        set((state) => ({
          meals: [...state.meals, mealEntry],
        }));
      },

      // Utility actions
      resetAllData: () =>
        set({
          meals: [],
          supplements: [],
          wellbeing: [],
          measurements: [],
          bloodTests: [],
          recipes: [],
        }),
      
      exportData: () => {
        const data = {
          meals: get().meals,
          supplements: get().supplements,
          wellbeing: get().wellbeing,
          measurements: get().measurements,
          bloodTests: get().bloodTests,
          recipes: get().recipes,
        };
        return JSON.stringify(data, null, 2);
      },
      
      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            meals: data.meals || [],
            supplements: data.supplements || [],
            wellbeing: data.wellbeing || [],
            measurements: data.measurements || [],
            bloodTests: data.bloodTests || [],
            recipes: data.recipes || [],
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
    }),
    {
      name: 'health-tracker-storage',
    }
  )
);
