import React, { useState, useMemo, useEffect } from 'react';
import { useHealthStore } from '../../store/healthStore';
import { initialRecipes } from '../../store/initialRecipes';
import { Card, Button, Modal } from '../../shared/components';
import type { Recipe } from '../../types';

export const Recipes: React.FC = () => {
  const { recipes, addRecipe } = useHealthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | 'all'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Initialize recipes if empty
  useEffect(() => {
    if (recipes.length === 0) {
      initialRecipes.forEach((recipe) => addRecipe(recipe));
    }
  }, []);

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

  const categories: Array<{ value: Recipe['category'] | 'all'; label: string }> = [
    { value: 'all', label: 'Все' },
    { value: 'breakfast', label: 'Завтраки' },
    { value: 'lunch', label: 'Обеды' },
    { value: 'dinner', label: 'Ужины' },
    { value: 'snack', label: 'Перекусы' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Рецепты</h1>

      {/* Search and filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск по названию или ингредиентам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
        />

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes count */}
      <p className="text-sm text-gray-600 mb-4">
        Найдено рецептов: {filteredRecipes.length}
      </p>

      {/* Recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.length === 0 ? (
          <Card className="col-span-full">
            <p className="text-gray-500 text-center">Рецепты не найдены</p>
          </Card>
        ) : (
          filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer"
            >
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-green-100 rounded-full">
                  {categoryLabels[recipe.category]}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.name}</h3>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                <div>
                  <div className="font-semibold">{recipe.calories}</div>
                  <div>ккал</div>
                </div>
                <div>
                  <div className="font-semibold">{recipe.protein}г</div>
                  <div>белки</div>
                </div>
                <div>
                  <div className="font-semibold">{recipe.fats}г</div>
                  <div>жиры</div>
                </div>
                <div>
                  <div className="font-semibold">{recipe.carbs}г</div>
                  <div>углеводы</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {recipe.ingredients.slice(0, 3).join(', ')}
                {recipe.ingredients.length > 3 && '...'}
              </p>
            </Card>
          ))
        )}
      </div>

      {/* Recipe detail modal */}
      {selectedRecipe && (
        <Modal
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          title={selectedRecipe.name}
        >
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-green-100 rounded-full">
                {categoryLabels[selectedRecipe.category]}
              </span>
            </div>

            {/* Nutrition info */}
            <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{selectedRecipe.calories}</div>
                <div className="text-xs text-gray-600">ккал</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{selectedRecipe.protein}г</div>
                <div className="text-xs text-gray-600">белки</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{selectedRecipe.fats}г</div>
                <div className="text-xs text-gray-600">жиры</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{selectedRecipe.carbs}г</div>
                <div className="text-xs text-gray-600">углеводы</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Ингредиенты:</h3>
              <ul className="space-y-1">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Приготовление:</h3>
              <ol className="space-y-2">
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Button onClick={() => setSelectedRecipe(null)} className="w-full">
              Закрыть
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
