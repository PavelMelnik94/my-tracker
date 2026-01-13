import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../store/healthStore';
import { Card, Button, Modal, Input, TextArea, Checkbox } from '../../shared/components';
import { getTodayDate, formatTime, generateId } from '../../shared/utils/date';
import type { MealEntry } from '../../types';

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

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Трекер питания</h1>
        <Button onClick={() => handleOpenModal()}>+ Добавить</Button>
      </div>

      {/* Date selector */}
      <div className="mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Total calories */}
      <Card className="mb-6 text-center">
        <div className="text-3xl font-bold text-primary">{totalCalories}</div>
        <div className="text-gray-600">ккал за день</div>
      </Card>

      {/* Meals list */}
      <div className="space-y-4">
        {filteredMeals.length === 0 ? (
          <Card>
            <p className="text-gray-500 text-center">Нет записей за этот день</p>
          </Card>
        ) : (
          filteredMeals.map((meal) => (
            <Card key={meal.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Checkbox
                    label={mealLabels[meal.type]}
                    checked={meal.completed}
                    onChange={() => toggleMealCompleted(meal.id)}
                  />
                  <div className="ml-7 mt-2">
                    <p className="text-sm text-gray-600">Время: {meal.time}</p>
                    <p className="text-sm text-gray-800 mt-1">{meal.description}</p>
                    <p className="text-sm font-semibold text-primary mt-1">
                      {meal.calories} ккал
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(meal)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteMeal(meal.id)}
                    className="text-red-500 hover:text-red-700"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип приёма пищи
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as MealEntry['type'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          >
            {Object.entries(mealLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <Input
            type="time"
            label="Время"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
          />

          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmit} className="flex-1">
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
