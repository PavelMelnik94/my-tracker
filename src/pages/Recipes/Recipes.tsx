import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useHealthStore } from '../../store/healthStore';
import { initialRecipes } from '../../store/initialRecipes';
import { Card, Button, Modal, Input } from '../../shared/components';
import type { Recipe } from '../../types';

export const Recipes: React.FC = () => {
  const { recipes, addRecipe } = useHealthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Recipe['category'] | 'all'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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

  const categoryIcons: Record<Recipe['category'], string> = {
    breakfast: '🌅',
    lunch: '🍜',
    dinner: '🌙',
    snack: '🍎',
  };

  const categoryColors: Record<Recipe['category'], string> = {
    breakfast: 'from-yellow-400 to-orange-500',
    lunch: 'from-green-400 to-emerald-500',
    dinner: 'from-purple-400 to-indigo-500',
    snack: 'from-pink-400 to-rose-500',
  };

  const categories: Array<{ value: Recipe['category'] | 'all'; label: string; icon: string }> = [
    { value: 'all', label: 'Все', icon: '🥗' },
    { value: 'breakfast', label: 'Завтраки', icon: '🌅' },
    { value: 'lunch', label: 'Обеды', icon: '🍜' },
    { value: 'dinner', label: 'Ужины', icon: '🌙' },
    { value: 'snack', label: 'Перекусы', icon: '🍎' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">🥗</span>
          Рецепты
        </h1>
        <p className="text-gray-600 mt-1">Здоровая еда на каждый день</p>
      </div>

      {/* Search and filters */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Поиск по названию или ингредиентам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon="🔍"
          className="mb-4"
        />

        {/* Category filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 font-medium">
          Найдено рецептов: <span className="text-primary-600 font-bold">{filteredRecipes.length}</span>
        </p>
      </div>

      {/* Recipes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecipes.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">Рецепты не найдены</p>
          </Card>
        ) : (
          filteredRecipes.map((recipe, index) => (
            <Card
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Category badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-gradient-to-r ${categoryColors[recipe.category]} text-white rounded-full shadow-md`}>
                  {categoryIcons[recipe.category]}
                  {categoryLabels[recipe.category]}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-primary-600 transition-colors">
                {recipe.name}
              </h3>

              {/* Nutrition info */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
                  <div className="text-lg font-bold text-gray-800">{recipe.calories}</div>
                  <div className="text-xs text-gray-600">ккал</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="text-lg font-bold text-gray-800">{recipe.protein}г</div>
                  <div className="text-xs text-gray-600">белки</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-yellow-50 to-amber-50">
                  <div className="text-lg font-bold text-gray-800">{recipe.fats}г</div>
                  <div className="text-xs text-gray-600">жиры</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-lg font-bold text-gray-800">{recipe.carbs}г</div>
                  <div className="text-xs text-gray-600">углев.</div>
                </div>
              </div>

              {/* Ingredients preview */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-lg">🥘</span>
                <p className="flex-1">
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 && '...'}
                </p>
              </div>

              <div className="mt-3 text-sm text-primary-600 font-semibold flex items-center gap-1">
                Подробнее →
              </div>
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
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold bg-gradient-to-r ${categoryColors[selectedRecipe.category]} text-white rounded-full shadow-md`}>
                {categoryIcons[selectedRecipe.category]}
                {categoryLabels[selectedRecipe.category]}
              </span>
            </div>

            {/* Nutrition info */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {selectedRecipe.calories}
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">ккал</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {selectedRecipe.protein}г
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">белки</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  {selectedRecipe.fats}г
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">жиры</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {selectedRecipe.carbs}г
                </div>
                <div className="text-xs text-gray-600 font-medium mt-1">углеводы</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-transparent">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">🥘</span>
                Ингредиенты
              </h3>
              <ul className="space-y-2">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-primary-500 font-bold mt-0.5">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-transparent">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <span className="text-2xl">👨‍🍳</span>
                Приготовление
              </h3>
              <ol className="space-y-3">
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-xs">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button onClick={() => setSelectedRecipe(null)} variant="gradient" className="w-full">
              Закрыть
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
