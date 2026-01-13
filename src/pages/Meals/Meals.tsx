import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../entities/health';
import { Card, Button, Modal, Input, TextArea, Checkbox } from '../../shared/components';
import { getTodayDate, formatTime, generateId } from '../../shared/utils/date';
import type { MealEntry } from '../../shared/types';

export const Meals: React.FC = () => {
  const { meals, addMeal, updateMeal, toggleMealCompleted, deleteMeal } = useHealthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [formData, setFormData] = useState({
    type: 'breakfast' as MealEntry['type'],
    time: formatTime(new Date()),
    description: '',
    calories: '',
  });

  const filteredMeals = useMemo(() => {
    return meals
      .filter((meal) => meal.date === selectedDate)
      .sort((a, b) => {
        const order = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];
        return order.indexOf(a.type) - order.indexOf(b.type);
      });
  }, [meals, selectedDate]);

  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, meal) => sum + (meal.completed ? meal.calories : 0), 0);
  }, [filteredMeals]);

  const handleOpenModal = (meal?: MealEntry) => {
    if (meal) {
      setEditingMeal(meal);
      setFormData({
        type: meal.type,
        time: meal.time,
        description: meal.description,
        calories: meal.calories.toString(),
      });
    } else {
      setEditingMeal(null);
      setFormData({
        type: 'breakfast',
        time: formatTime(new Date()),
        description: '',
        calories: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeal(null);
  };

  const handleSubmit = () => {
    const calories = parseInt(formData.calories) || 0;

    if (editingMeal) {
      updateMeal(editingMeal.id, {
        type: formData.type,
        time: formData.time,
        description: formData.description,
        calories,
      });
    } else {
      addMeal({
        id: generateId(),
        date: selectedDate,
        type: formData.type,
        time: formData.time,
        description: formData.description,
        calories,
        completed: false,
      });
    }
    handleCloseModal();
  };

  const mealLabels: Record<MealEntry['type'], string> = {
    breakfast: 'Завтрак',
    snack1: 'Перекус 1',
    lunch: 'Обед',
    snack2: 'Перекус 2',
    dinner: 'Ужин',
    snack3: 'Перекус 3',
  };

  const mealIcons: Record<MealEntry['type'], string> = {
    breakfast: '🌅',
    snack1: '🍎',
    lunch: '🍜',
    snack2: '🥜',
    dinner: '🌙',
    snack3: '🍪',
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">🍽️</span>
            Питание
          </h1>
          <p className="text-gray-600 mt-1">Отслеживай свой рацион</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="gradient" icon="✨">
          Добавить
        </Button>
      </div>

      {/* Date selector */}
      <div className="mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
          icon="📅"
        />
      </div>

      {/* Total calories */}
      <div className="glass-card p-8 text-center mb-6 bg-gradient-to-br from-primary-50 to-accent-50 animate-slide-up">
        <div className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-2">
          {totalCalories}
        </div>
        <div className="text-gray-600 font-semibold text-lg">ккал за день</div>
        {totalCalories > 0 && (
          <div className="mt-3 text-sm text-gray-500">
            {filteredMeals.filter(m => m.completed).length} из {filteredMeals.length} приёмов пищи
          </div>
        )}
      </div>

      {/* Meals list */}
      <div className="space-y-4">
        {filteredMeals.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg mb-4">Нет записей за этот день</p>
            <Button onClick={() => handleOpenModal()} variant="primary">
              Добавить приём пищи
            </Button>
          </Card>
        ) : (
          filteredMeals.map((meal, index) => (
            <Card 
              key={meal.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{mealIcons[meal.type]}</span>
                    <Checkbox
                      label={mealLabels[meal.type]}
                      checked={meal.completed}
                      onChange={() => toggleMealCompleted(meal.id)}
                    />
                  </div>
                  <div className="ml-12 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>🕐</span>
                      <span className="font-medium">{meal.time}</span>
                    </div>
                    {meal.description && (
                      <p className="text-gray-800">{meal.description}</p>
                    )}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-accent-100">
                      <span className="text-lg">🔥</span>
                      <span className="font-bold text-primary-700">{meal.calories} ккал</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(meal)}
                    className="p-2 text-2xl hover:scale-110 transition-transform duration-200"
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="p-2 text-2xl hover:scale-110 transition-transform duration-200"
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMeal ? 'Редактировать приём пищи' : 'Добавить приём пищи'}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Тип приёма пищи
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as MealEntry['type'] })}
            className="w-full px-4 py-3 input-modern mb-4"
          >
            {Object.entries(mealLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {mealIcons[key as MealEntry['type']]} {label}
              </option>
            ))}
          </select>

          <Input
            type="time"
            label="Время"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            icon="🕐"
          />

          <TextArea
            label="Описание блюд"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Например: Овсянка с бананом и орехами"
          />

          <Input
            type="number"
            label="Калории"
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
            placeholder="400"
            icon="🔥"
          />

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSubmit} variant="gradient" className="flex-1">
              {editingMeal ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button onClick={handleCloseModal} variant="secondary" className="flex-1">
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
