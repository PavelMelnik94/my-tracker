import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useHealthStore } from '../../entities/health';
import { initialRecipes } from '../../entities/recipes';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../shared/ui/dialog';
import { Search, Flame, Beef, Droplet, Wheat, ChefHat, UtensilsCrossed, Check } from 'lucide-react';
import type { Recipe } from '../../shared/types';
import { cn } from '../../shared/lib/utils';

export const Recipes: React.FC = () => {
  const { recipes, addRecipe, trackRecipeCooked } = useHealthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | 'all'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookedSuccess, setCookedSuccess] = useState(false);
  const initialized = useRef(false);

  // Initialize recipes if empty
  useEffect(() => {
    if (!initialized.current && recipes.length === 0) {
      initialized.current = true;
      initialRecipes.forEach((recipe) => addRecipe(recipe));
    }
  }, [recipes.length, addRecipe]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory]);

  const categoryLabels: Record<Recipe['category'], string> = {
    breakfast: 'Завтраки',
    lunch: 'Обеды',
    dinner: 'Ужины',
    snack: 'Перекусы',
  };

  const categoryColors: Record<Recipe['category'], string> = {
    breakfast: 'bg-amber-500 text-white',
    lunch: 'bg-emerald-500 text-white',
    dinner: 'bg-blue-500 text-white',
    snack: 'bg-purple-500 text-white',
  };

  const categories: Array<{ value: Recipe['category'] | 'all'; label: string }> = [
    { value: 'all', label: 'Все' },
    { value: 'breakfast', label: 'Завтраки' },
    { value: 'lunch', label: 'Обеды' },
    { value: 'dinner', label: 'Ужины' },
    { value: 'snack', label: 'Перекусы' },
  ];

  const handleCookedAndAte = () => {
    if (selectedRecipe) {
      trackRecipeCooked(selectedRecipe);
      setCookedSuccess(true);
      setTimeout(() => {
        setCookedSuccess(false);
        setSelectedRecipe(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
          <ChefHat className="w-8 h-8 text-primary" />
          Рецепты
        </h1>
        <p className="text-muted-foreground mt-1">Здоровая еда на каждый день</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Поиск по названию или ингредиентам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />

        {/* Category filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 mt-4">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recipes count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground font-medium">
          Найдено рецептов: <span className="text-primary font-bold">{filteredRecipes.length}</span>
        </p>
      </div>

      {/* Recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecipes.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Рецепты не найдены</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 hover:border-primary/50"
            >
              <CardHeader>
                <div className="mb-2">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full",
                    categoryColors[recipe.category]
                  )}>
                    {categoryLabels[recipe.category]}
                  </span>
                </div>
                <CardTitle className="text-xl">{recipe.name}</CardTitle>
              </CardHeader>

              <CardContent>
                {/* Nutrition info */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-sm font-bold">{recipe.calories}</div>
                    <div className="text-xs text-muted-foreground">ккал</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Beef className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-sm font-bold">{recipe.protein}г</div>
                    <div className="text-xs text-muted-foreground">белки</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Droplet className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-sm font-bold">{recipe.fats}г</div>
                    <div className="text-xs text-muted-foreground">жиры</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      <Wheat className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-sm font-bold">{recipe.carbs}г</div>
                    <div className="text-xs text-muted-foreground">углев.</div>
                  </div>
                </div>

                {/* Ingredients preview */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <UtensilsCrossed className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="flex-1">
                    {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 && '...'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl pr-8">{selectedRecipe.name}</DialogTitle>
              <div className="mt-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-full",
                  categoryColors[selectedRecipe.category]
                )}>
                  {categoryLabels[selectedRecipe.category]}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Nutrition info */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{selectedRecipe.calories}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">ккал</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Beef className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{selectedRecipe.protein}г</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">белки</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Droplet className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{selectedRecipe.fats}г</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">жиры</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <Wheat className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{selectedRecipe.carbs}г</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">углеводы</div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="p-4 rounded-xl bg-muted/30">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-lg">
                  <UtensilsCrossed className="w-5 h-5" />
                  Ингредиенты
                </h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="p-4 rounded-xl bg-muted/30">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-lg">
                  <ChefHat className="w-5 h-5" />
                  Приготовление
                </h3>
                <ol className="space-y-3">
                  {selectedRecipe.steps.map((step, index) => (
                    <li key={index} className="text-sm flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={() => setSelectedRecipe(null)} variant="outline" className="flex-1">
                Закрыть
              </Button>
              <Button 
                onClick={handleCookedAndAte} 
                className={cn(
                  "flex-1 gap-2",
                  cookedSuccess && "bg-green-600 hover:bg-green-600"
                )}
                disabled={cookedSuccess}
              >
                {cookedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    Добавлено!
                  </>
                ) : (
                  <>
                    <ChefHat className="w-4 h-4" />
                    Приготовил и съел
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
