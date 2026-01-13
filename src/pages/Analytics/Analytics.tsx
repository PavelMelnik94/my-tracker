import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHealthStore } from '../../store/healthStore';
import { Card, Button, Modal, Input } from '../../shared/components';
import { generateId, formatDate } from '../../shared/utils/date';
import type { BloodTestEntry } from '../../types';

export const Analytics: React.FC = () => {
  const { wellbeing, measurements, bloodTests, addBloodTest, updateBloodTest, deleteBloodTest } =
    useHealthStore();
  const [isBloodTestModalOpen, setIsBloodTestModalOpen] = useState(false);
  const [editingBloodTest, setEditingBloodTest] = useState<BloodTestEntry | null>(null);
  const [bloodTestForm, setBloodTestForm] = useState({
    date: formatDate(new Date()),
    leptin: '',
    vitaminD: '',
    iron: '',
    homaIR: '',
    notes: '',
  });

  // Prepare weight chart data
  const weightData = useMemo(() => {
    return measurements
      .map((m) => ({
        date: m.date,
        weight: m.weight,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 entries
  }, [measurements]);

  // Prepare wellbeing chart data
  const wellbeingData = useMemo(() => {
    return wellbeing
      .map((w) => ({
        date: w.date,
        energy: w.energy,
        sleep: w.sleep,
        mood: w.mood,
        stress: w.stress,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 entries
  }, [wellbeing]);

  const handleOpenBloodTestModal = (entry?: BloodTestEntry) => {
    if (entry) {
      setEditingBloodTest(entry);
      setBloodTestForm({
        date: entry.date,
        leptin: entry.leptin?.toString() || '',
        vitaminD: entry.vitaminD?.toString() || '',
        iron: entry.iron?.toString() || '',
        homaIR: entry.homaIR?.toString() || '',
        notes: entry.notes || '',
      });
    } else {
      setEditingBloodTest(null);
      setBloodTestForm({
        date: formatDate(new Date()),
        leptin: '',
        vitaminD: '',
        iron: '',
        homaIR: '',
        notes: '',
      });
    }
    setIsBloodTestModalOpen(true);
  };

  const handleSubmitBloodTest = () => {
    const entry: BloodTestEntry = {
      id: editingBloodTest?.id || generateId(),
      date: bloodTestForm.date,
      leptin: bloodTestForm.leptin ? parseFloat(bloodTestForm.leptin) : undefined,
      vitaminD: bloodTestForm.vitaminD ? parseFloat(bloodTestForm.vitaminD) : undefined,
      iron: bloodTestForm.iron ? parseFloat(bloodTestForm.iron) : undefined,
      homaIR: bloodTestForm.homaIR ? parseFloat(bloodTestForm.homaIR) : undefined,
      notes: bloodTestForm.notes,
    };

    if (editingBloodTest) {
      updateBloodTest(editingBloodTest.id, entry);
    } else {
      addBloodTest(entry);
    }
    setIsBloodTestModalOpen(false);
  };

  const sortedBloodTests = useMemo(() => {
    return [...bloodTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bloodTests]);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Прогресс и аналитика</h1>

      {/* Weight Chart */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Изменение веса</h2>
        {weightData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет данных для отображения</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
                formatter={(value) => [`${value} кг`, 'Вес']}
              />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="#10b981" name="Вес (кг)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Wellbeing Chart */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Динамика самочувствия</h2>
        {wellbeingData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет данных для отображения</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wellbeingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
              />
              <Legend />
              <Line type="monotone" dataKey="energy" stroke="#10b981" name="Энергия" strokeWidth={2} />
              <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Сон" strokeWidth={2} />
              <Line type="monotone" dataKey="mood" stroke="#f59e0b" name="Настроение" strokeWidth={2} />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Стресс" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Blood Tests */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Анализы крови</h2>
          <Button onClick={() => handleOpenBloodTestModal()}>+ Добавить</Button>
        </div>

        {sortedBloodTests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Нет записей об анализах</p>
        ) : (
          <div className="space-y-4">
            {sortedBloodTests.map((test) => (
              <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-gray-800">
                    {new Date(test.date).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenBloodTestModal(test)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteBloodTest(test.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {test.leptin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Лептин:</span>
                      <span className="font-semibold">{test.leptin} нг/мл</span>
                    </div>
                  )}
                  {test.vitaminD && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Витамин D:</span>
                      <span className="font-semibold">{test.vitaminD} нг/мл</span>
                    </div>
                  )}
                  {test.iron && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Железо:</span>
                      <span className="font-semibold">{test.iron} мкг/дл</span>
                    </div>
                  )}
                  {test.homaIR && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">HOMA-IR:</span>
                      <span className="font-semibold">{test.homaIR}</span>
                    </div>
                  )}
                </div>
                {test.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600">{test.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Blood Test Modal */}
      <Modal
        isOpen={isBloodTestModalOpen}
        onClose={() => setIsBloodTestModalOpen(false)}
        title={editingBloodTest ? 'Редактировать анализ' : 'Добавить анализ крови'}
      >
        <div>
          <Input
            type="date"
            label="Дата анализа"
            value={bloodTestForm.date}
            onChange={(e) => setBloodTestForm({ ...bloodTestForm, date: e.target.value })}
          />
          <Input
            type="number"
            step="0.1"
            label="Лептин (нг/мл)"
            value={bloodTestForm.leptin}
            onChange={(e) => setBloodTestForm({ ...bloodTestForm, leptin: e.target.value })}
            placeholder="5.2"
          />
          <Input
            type="number"
            step="0.1"
            label="Витамин D (нг/мл)"
            value={bloodTestForm.vitaminD}
            onChange={(e) => setBloodTestForm({ ...bloodTestForm, vitaminD: e.target.value })}
            placeholder="30.5"
          />
          <Input
            type="number"
            step="0.1"
            label="Железо (мкг/дл)"
            value={bloodTestForm.iron}
            onChange={(e) => setBloodTestForm({ ...bloodTestForm, iron: e.target.value })}
            placeholder="85"
          />
          <Input
            type="number"
            step="0.01"
            label="HOMA-IR"
            value={bloodTestForm.homaIR}
            onChange={(e) => setBloodTestForm({ ...bloodTestForm, homaIR: e.target.value })}
            placeholder="2.5"
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
            <textarea
              value={bloodTestForm.notes}
              onChange={(e) => setBloodTestForm({ ...bloodTestForm, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Дополнительные заметки..."
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmitBloodTest} className="flex-1">
              {editingBloodTest ? 'Сохранить' : 'Добавить'}
            </Button>
            <Button
              onClick={() => setIsBloodTestModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
