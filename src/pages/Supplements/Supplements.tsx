import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../store/healthStore';
import { Card, Button, Checkbox } from '../../shared/components';
import { getTodayDate, formatTime, generateId } from '../../shared/utils/date';
import type { SupplementEntry } from '../../types';

export const Supplements: React.FC = () => {
  const { supplements, addSupplement, toggleSupplementTaken } = useHealthStore();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const filteredSupplements = useMemo(() => {
    return supplements.filter((sup) => sup.date === selectedDate);
  }, [supplements, selectedDate]);

  const supplementLabels: Record<SupplementEntry['supplement'], { name: string; time: string }> = {
    'vitamin-d3': { name: 'Vitamin D3 5000 IU', time: 'утро' },
    'omega-3': { name: 'Omega-3', time: 'с едой' },
    'magnesium': { name: 'Magnesium Glycinate', time: 'вечер' },
  };

  const initializeTodaySupplements = () => {
    const today = getTodayDate();
    const existingSupplements = supplements.filter((s) => s.date === today);
    
    if (existingSupplements.length === 0) {
      const supplementTypes: SupplementEntry['supplement'][] = ['vitamin-d3', 'omega-3', 'magnesium'];
      supplementTypes.forEach((type) => {
        addSupplement({
          id: generateId(),
          date: today,
          supplement: type,
          taken: false,
          time: formatTime(new Date()),
        });
      });
    }
  };

  // Initialize supplements for today if they don't exist
  React.useEffect(() => {
    if (selectedDate === getTodayDate()) {
      initializeTodaySupplements();
    }
  }, [selectedDate]);

  const takenCount = filteredSupplements.filter((s) => s.taken).length;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Трекер добавок</h1>

      {/* Date selector */}
      <div className="mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Progress */}
      <Card className="mb-6 text-center">
        <div className="text-3xl font-bold text-primary">{takenCount}/3</div>
        <div className="text-gray-600">добавок принято</div>
      </Card>

      {/* Supplements checklist */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Чеклист добавок</h2>
        {filteredSupplements.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Нет записей за этот день</p>
            {selectedDate === getTodayDate() && (
              <Button onClick={initializeTodaySupplements}>
                Создать чеклист на сегодня
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSupplements.map((supplement) => (
              <div key={supplement.id} className="border-b border-gray-100 pb-4 last:border-0">
                <Checkbox
                  label={supplementLabels[supplement.supplement].name}
                  checked={supplement.taken}
                  onChange={() => toggleSupplementTaken(supplement.id)}
                />
                <p className="ml-7 text-sm text-gray-500 mt-1">
                  Рекомендуемое время: {supplementLabels[supplement.supplement].time}
                </p>
                {supplement.time && (
                  <p className="ml-7 text-xs text-gray-400 mt-1">
                    Принято в: {supplement.time}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Info card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Информация</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Vitamin D3 - принимать утром для лучшего усвоения</li>
          <li>• Omega-3 - принимать с едой для уменьшения побочных эффектов</li>
          <li>• Magnesium - принимать вечером для улучшения сна</li>
        </ul>
      </Card>
    </div>
  );
};
