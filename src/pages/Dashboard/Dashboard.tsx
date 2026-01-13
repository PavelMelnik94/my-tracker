import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useHealthStore } from '../../entities/health';
import { Card, Checkbox, Button, StatCard } from '../../shared/components';
import { getTodayDate } from '../../shared/utils/date';

export const Dashboard: React.FC = () => {
  const { meals, supplements, wellbeing, measurements, toggleMealCompleted, toggleSupplementTaken } = useHealthStore();

  const todayDate = getTodayDate();

  // Get today's data
  const todayMeals = useMemo(() => {
    return meals.filter((meal) => meal.date === todayDate);
  }, [meals, todayDate]);

  const todaySupplements = useMemo(() => {
    return supplements.filter((sup) => sup.date === todayDate);
  }, [supplements, todayDate]);

  const latestWellbeing = useMemo(() => {
    return wellbeing
      .filter((w) => w.date === todayDate)
      .sort((a, b) => b.id.localeCompare(a.id))[0];
  }, [wellbeing, todayDate]);

  const latestMeasurement = useMemo(() => {
    return measurements
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [measurements]);

  // Calculate stats
  const totalCalories = useMemo(() => {
    return todayMeals.reduce((sum, meal) => sum + (meal.completed ? meal.calories : 0), 0);
  }, [todayMeals]);

  const mealsCompleted = todayMeals.filter((m) => m.completed).length;
  const supplementsTaken = todaySupplements.filter((s) => s.taken).length;

  // Calculate streak (simplified - count consecutive days with completed meals)
  const currentStreak = useMemo(() => {
    const sortedDates = [...new Set(meals.map(m => m.date))].sort().reverse();
    let streak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      const dateMeals = meals.filter(m => m.date === sortedDates[i]);
      if (dateMeals.some(m => m.completed)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [meals]);

  const mealLabels: Record<string, string> = {
    breakfast: 'Завтрак',
    snack1: 'Перекус 1',
    lunch: 'Обед',
    snack2: 'Перекус 2',
    dinner: 'Ужин',
    snack3: 'Перекус 3',
  };

  const supplementLabels: Record<string, string> = {
    'vitamin-d3': 'Vitamin D3 5000 IU',
    'omega-3': 'Omega-3',
    'magnesium': 'Magnesium Glycinate',
  };

  const randomQuote = useMemo(() => {
    const quotes = [
      'Ты на правильном пути! 🌟',
      'Каждый день - новая возможность! 💪',
      'Твоё здоровье - твоё богатство! ✨',
      'Маленькие шаги ведут к большим результатам! 🚀',
      'Продолжай в том же духе! 🎯',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [todayDate]);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 animate-fade-in">
      {/* Hero Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-1">
              Привет! 👋
            </h1>
            <p className="text-gray-600">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {currentStreak > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">🔥</div>
              <div className="text-sm font-semibold text-gray-600">{currentStreak} дней</div>
            </div>
          )}
        </div>
        <div className="glass-card p-4 mt-4 bg-gradient-to-r from-primary-50 to-accent-50 border-l-4 border-primary-500 shadow-md">
          <p className="text-primary-700 font-medium">{randomQuote}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="🔥"
          value={totalCalories}
          label="ккал"
          color="primary"
        />
        <StatCard
          icon="🍽️"
          value={`${mealsCompleted}/${todayMeals.length || 0}`}
          label="приёмов пищи"
          color="accent"
        />
        <StatCard
          icon="💊"
          value={`${supplementsTaken}/3`}
          label="добавок"
          color="success"
        />
        <StatCard
          icon="⚖️"
          value={latestMeasurement?.weight.toFixed(1) || '—'}
          label="кг"
          color="warning"
        />
      </div>

      {/* Wellbeing Quick View */}
      {latestWellbeing && (
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">😊</span>
              Самочувствие
            </h2>
            <Link to="/wellbeing">
              <Button variant="ghost" size="sm">Подробнее →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-lg font-bold text-gray-800">{latestWellbeing.energy}/10</div>
              <div className="text-xs text-gray-600">Энергия</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="text-2xl mb-1">😴</div>
              <div className="text-lg font-bold text-gray-800">{latestWellbeing.sleep}/10</div>
              <div className="text-xs text-gray-600">Сон</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50">
              <div className="text-2xl mb-1">😊</div>
              <div className="text-lg font-bold text-gray-800">{latestWellbeing.mood}/10</div>
              <div className="text-xs text-gray-600">Настроение</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-2xl mb-1">😌</div>
              <div className="text-lg font-bold text-gray-800">{latestWellbeing.stress}/10</div>
              <div className="text-xs text-gray-600">Стресс</div>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Meals */}
      <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            Питание сегодня
          </h2>
          <Link to="/meals">
            <Button variant="gradient" size="sm" icon="✨">
              Добавить
            </Button>
          </Link>
        </div>
        {todayMeals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-gray-500">Начни отслеживать питание!</p>
            <Link to="/meals">
              <Button variant="primary" size="sm" className="mt-3">
                Добавить приём пищи
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todayMeals.map((meal) => (
              <div key={meal.id} className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent hover:from-primary-50 transition-all duration-300">
                <Checkbox
                  label={`${mealLabels[meal.type]} • ${meal.calories} ккал`}
                  checked={meal.completed}
                  onChange={() => toggleMealCompleted(meal.id)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Today's Supplements */}
      <Card className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">💊</span>
            Добавки сегодня
          </h2>
          <Link to="/supplements">
            <Button variant="ghost" size="sm">Все →</Button>
          </Link>
        </div>
        {todaySupplements.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Нет добавок на сегодня</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySupplements.map((supplement) => (
              <div key={supplement.id} className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-transparent hover:from-accent-50 transition-all duration-300">
                <Checkbox
                  label={supplementLabels[supplement.supplement]}
                  checked={supplement.taken}
                  onChange={() => toggleSupplementTaken(supplement.id)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Link to="/wellbeing">
          <Button variant="gradient" className="w-full h-24 text-lg" icon="📝">
            Дневник
          </Button>
        </Link>
        <Link to="/recipes">
          <Button variant="primary" className="w-full h-24 text-lg" icon="🥗">
            Рецепты
          </Button>
        </Link>
        <Link to="/analytics">
          <Button variant="secondary" className="w-full h-24 text-lg" icon="📊">
            Аналитика
          </Button>
        </Link>
        <Link to="/wellbeing">
          <Button variant="secondary" className="w-full h-24 text-lg" icon="⚖️">
            Замеры
          </Button>
        </Link>
      </div>
    </div>
  );
};
