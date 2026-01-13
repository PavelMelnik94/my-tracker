import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHealthStore } from '../../store/healthStore';
import { Card, Checkbox, Button } from '../../shared/components';
import { getTodayDate } from '../../shared/utils/date';

export const Dashboard: React.FC = () => {
  const { meals, supplements, toggleMealCompleted, toggleSupplementTaken } = useHealthStore();

  const todayDate = getTodayDate();

  // Get today's meals
  const todayMeals = useMemo(() => {
    return meals.filter((meal) => meal.date === todayDate);
  }, [meals, todayDate]);

  // Get today's supplements
  const todaySupplements = useMemo(() => {
    return supplements.filter((sup) => sup.date === todayDate);
  }, [supplements, todayDate]);

  // Calculate stats
  const totalCalories = useMemo(() => {
    return todayMeals.reduce((sum, meal) => sum + (meal.completed ? meal.calories : 0), 0);
  }, [todayMeals]);

  const mealsCompleted = todayMeals.filter((m) => m.completed).length;
  const supplementsTaken = todaySupplements.filter((s) => s.taken).length;

  const mealLabels: Record<string, string> = {
    breakfast: 'Завтрак',
    snack1: 'Перекус 1',
    lunch: 'Обед',
    snack2: 'Перекус 2',
    dinner: 'Ужин',
    snack3: 'Перекус 3',
  };

  const supplementLabels: Record<string, string> = {
    'vitamin-d3': 'Vitamin D3 5000 IU (утро)',
    'omega-3': 'Omega-3 (с едой)',
    'magnesium': 'Magnesium Glycinate (вечер)',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Здоровье трекер</h1>

      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary">{totalCalories}</div>
          <div className="text-sm text-gray-600">ккал</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary">{mealsCompleted}/{todayMeals.length}</div>
          <div className="text-sm text-gray-600">приёмов пищи</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary">{supplementsTaken}/3</div>
          <div className="text-sm text-gray-600">добавок</div>
        </Card>
      </div>

      {/* Today's Meals */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Питание сегодня</h2>
          <Link to="/meals">
            <Button variant="secondary" className="text-sm py-1 px-3">
              Подробнее
            </Button>
          </Link>
        </div>
        {todayMeals.length === 0 ? (
          <p className="text-gray-500 text-sm">Пока нет записей о питании</p>
        ) : (
          <div className="space-y-2">
            {todayMeals.map((meal) => (
              <Checkbox
                key={meal.id}
                label={`${mealLabels[meal.type]} (${meal.calories} ккал)`}
                checked={meal.completed}
                onChange={() => toggleMealCompleted(meal.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Today's Supplements */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Добавки сегодня</h2>
          <Link to="/supplements">
            <Button variant="secondary" className="text-sm py-1 px-3">
              Подробнее
            </Button>
          </Link>
        </div>
        {todaySupplements.length === 0 ? (
          <p className="text-gray-500 text-sm">Пока нет записей о добавках</p>
        ) : (
          <div className="space-y-2">
            {todaySupplements.map((supplement) => (
              <Checkbox
                key={supplement.id}
                label={supplementLabels[supplement.supplement]}
                checked={supplement.taken}
                onChange={() => toggleSupplementTaken(supplement.id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/wellbeing">
          <Button className="w-full">📝 Дневник</Button>
        </Link>
        <Link to="/recipes">
          <Button className="w-full">🥗 Рецепты</Button>
        </Link>
      </div>
    </div>
  );
};
