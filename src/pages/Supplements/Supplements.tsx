import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../entities/health';
import { Card, Button, Checkbox, Input } from '../../shared/components';
import { getTodayDate, formatTime, generateId } from '../../shared/utils/date';
import type { SupplementEntry } from '../../shared/types';

export const Supplements: React.FC = () => {
  const { supplements, addSupplement, toggleSupplementTaken } = useHealthStore();
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const filteredSupplements = useMemo(() => {
    return supplements.filter((sup) => sup.date === selectedDate);
  }, [supplements, selectedDate]);

  const supplementLabels: Record<SupplementEntry['supplement'], { name: string; time: string; icon: string; color: string }> = {
    'vitamin-d3': { name: 'Vitamin D3 5000 IU', time: 'утро', icon: '☀️', color: 'from-yellow-400 to-orange-500' },
    'omega-3': { name: 'Omega-3', time: 'с едой', icon: '🐟', color: 'from-blue-400 to-cyan-500' },
    'magnesium': { name: 'Magnesium Glycinate', time: 'вечер', icon: '🌙', color: 'from-purple-400 to-indigo-500' },
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
  const progress = filteredSupplements.length > 0 ? (takenCount / filteredSupplements.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-4xl">💊</span>
          Добавки
        </h1>
        <p className="text-gray-600 mt-1">Следи за приёмом витаминов</p>
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

      {/* Progress Card */}
      <div className="glass-card p-8 text-center mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 animate-slide-up">
        <div className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent mb-2">
          {takenCount}/{filteredSupplements.length}
        </div>
        <div className="text-gray-600 font-semibold text-lg mb-4">добавок принято</div>
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <div className="mt-3 text-green-600 font-semibold animate-bounce-slow">
            ✨ Отлично! Все добавки приняты!
          </div>
        )}
      </div>

      {/* Supplements checklist */}
      <div className="space-y-4">
        {filteredSupplements.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">💊</div>
            <p className="text-gray-500 text-lg mb-4">Нет записей за этот день</p>
            {selectedDate === getTodayDate() && (
              <Button onClick={initializeTodaySupplements} variant="gradient">
                Создать чеклист на сегодня
              </Button>
            )}
          </Card>
        ) : (
          filteredSupplements.map((supplement, index) => {
            const info = supplementLabels[supplement.supplement];
            return (
              <Card 
                key={supplement.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <Checkbox
                      label={info.name}
                      checked={supplement.taken}
                      onChange={() => toggleSupplementTaken(supplement.id)}
                    />
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <span>⏰</span>
                      <span>Рекомендуемое время: <span className="font-semibold">{info.time}</span></span>
                    </div>
                    {supplement.taken && supplement.time && (
                      <div className="mt-1 flex items-center gap-2 text-xs text-green-600">
                        <span>✓</span>
                        <span>Принято в: {supplement.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Info card */}
      <Card className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="font-bold text-blue-800 mb-3 text-lg">Полезная информация</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">☀️</span>
                <span><strong>Vitamin D3</strong> - принимать утром для лучшего усвоения</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">🐟</span>
                <span><strong>Omega-3</strong> - принимать с едой для уменьшения побочных эффектов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">🌙</span>
                <span><strong>Magnesium</strong> - принимать вечером для улучшения сна</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
