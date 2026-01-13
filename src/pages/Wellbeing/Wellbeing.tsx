import React, { useState, useMemo } from 'react';
import { useHealthStore } from '../../entities/health';
import { Card, Button, Modal, Input, TextArea } from '../../shared/components';
import { getTodayDate, generateId } from '../../shared/utils/date';
import type { WellbeingEntry, MeasurementEntry } from '../../shared/types';

export const Wellbeing: React.FC = () => {
  const { wellbeing, measurements, addWellbeing, addMeasurement, updateWellbeing, updateMeasurement } =
    useHealthStore();
  const [isWellbeingModalOpen, setIsWellbeingModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const [wellbeingForm, setWellbeingForm] = useState({
    energy: 5,
    sleep: 5,
    mood: 5,
    stress: 5,
    libido: 5,
    notes: '',
  });

  const [measurementForm, setMeasurementForm] = useState({
    weight: '',
    waist: '',
    hips: '',
    chest: '',
  });

  const todayWellbeing = useMemo(() => {
    return wellbeing.find((w) => w.date === selectedDate);
  }, [wellbeing, selectedDate]);

  const todayMeasurement = useMemo(() => {
    return measurements.find((m) => m.date === selectedDate);
  }, [measurements, selectedDate]);

  const handleOpenWellbeingModal = () => {
    if (todayWellbeing) {
      setWellbeingForm({
        energy: todayWellbeing.energy,
        sleep: todayWellbeing.sleep,
        mood: todayWellbeing.mood,
        stress: todayWellbeing.stress,
        libido: todayWellbeing.libido || 5,
        notes: todayWellbeing.notes || '',
      });
    } else {
      setWellbeingForm({
        energy: 5,
        sleep: 5,
        mood: 5,
        stress: 5,
        libido: 5,
        notes: '',
      });
    }
    setIsWellbeingModalOpen(true);
  };

  const handleOpenMeasurementModal = () => {
    if (todayMeasurement) {
      setMeasurementForm({
        weight: todayMeasurement.weight.toString(),
        waist: todayMeasurement.waist?.toString() || '',
        hips: todayMeasurement.hips?.toString() || '',
        chest: todayMeasurement.chest?.toString() || '',
      });
    } else {
      setMeasurementForm({
        weight: '',
        waist: '',
        hips: '',
        chest: '',
      });
    }
    setIsMeasurementModalOpen(true);
  };

  const handleSubmitWellbeing = () => {
    const entry: WellbeingEntry = {
      id: todayWellbeing?.id || generateId(),
      date: selectedDate,
      energy: wellbeingForm.energy,
      sleep: wellbeingForm.sleep,
      mood: wellbeingForm.mood,
      stress: wellbeingForm.stress,
      libido: wellbeingForm.libido,
      notes: wellbeingForm.notes,
    };

    if (todayWellbeing) {
      updateWellbeing(todayWellbeing.id, entry);
    } else {
      addWellbeing(entry);
    }
    setIsWellbeingModalOpen(false);
  };

  const handleSubmitMeasurement = () => {
    const entry: MeasurementEntry = {
      id: todayMeasurement?.id || generateId(),
      date: selectedDate,
      weight: parseFloat(measurementForm.weight) || 0,
      waist: measurementForm.waist ? parseFloat(measurementForm.waist) : undefined,
      hips: measurementForm.hips ? parseFloat(measurementForm.hips) : undefined,
      chest: measurementForm.chest ? parseFloat(measurementForm.chest) : undefined,
    };

    if (todayMeasurement) {
      updateMeasurement(todayMeasurement.id, entry);
    } else {
      addMeasurement(entry);
    }
    setIsMeasurementModalOpen(false);
  };

  const RatingSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, value, onChange }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-primary">{value}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Дневник самочувствия</h1>

      {/* Date selector */}
      <div className="mb-6">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Wellbeing Card */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Оценка самочувствия</h2>
          <Button onClick={handleOpenWellbeingModal} variant="secondary">
            {todayWellbeing ? 'Редактировать' : '+ Добавить'}
          </Button>
        </div>
        {todayWellbeing ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Уровень энергии:</span>
              <span className="font-semibold text-primary">{todayWellbeing.energy}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Качество сна:</span>
              <span className="font-semibold text-primary">{todayWellbeing.sleep}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Настроение:</span>
              <span className="font-semibold text-primary">{todayWellbeing.mood}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Стресс:</span>
              <span className="font-semibold text-primary">{todayWellbeing.stress}/10</span>
            </div>
            {todayWellbeing.libido !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Либидо:</span>
                <span className="font-semibold text-primary">{todayWellbeing.libido}/10</span>
              </div>
            )}
            {todayWellbeing.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-medium mb-1">Заметки:</p>
                <p className="text-sm text-gray-800">{todayWellbeing.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Нет записи за этот день</p>
        )}
      </Card>

      {/* Measurements Card */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Замеры</h2>
          <Button onClick={handleOpenMeasurementModal} variant="secondary">
            {todayMeasurement ? 'Редактировать' : '+ Добавить'}
          </Button>
        </div>
        {todayMeasurement ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Вес:</span>
              <span className="font-semibold text-primary">{todayMeasurement.weight} кг</span>
            </div>
            {todayMeasurement.waist && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Талия:</span>
                <span className="font-semibold text-primary">{todayMeasurement.waist} см</span>
              </div>
            )}
            {todayMeasurement.hips && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Бёдра:</span>
                <span className="font-semibold text-primary">{todayMeasurement.hips} см</span>
              </div>
            )}
            {todayMeasurement.chest && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Грудь:</span>
                <span className="font-semibold text-primary">{todayMeasurement.chest} см</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Нет записи за этот день</p>
        )}
      </Card>

      {/* Wellbeing Modal */}
      <Modal
        isOpen={isWellbeingModalOpen}
        onClose={() => setIsWellbeingModalOpen(false)}
        title="Оценка самочувствия"
      >
        <div>
          <RatingSlider
            label="Уровень энергии"
            value={wellbeingForm.energy}
            onChange={(value) => setWellbeingForm({ ...wellbeingForm, energy: value })}
          />
          <RatingSlider
            label="Качество сна"
            value={wellbeingForm.sleep}
            onChange={(value) => setWellbeingForm({ ...wellbeingForm, sleep: value })}
          />
          <RatingSlider
            label="Настроение"
            value={wellbeingForm.mood}
            onChange={(value) => setWellbeingForm({ ...wellbeingForm, mood: value })}
          />
          <RatingSlider
            label="Стресс"
            value={wellbeingForm.stress}
            onChange={(value) => setWellbeingForm({ ...wellbeingForm, stress: value })}
          />
          <RatingSlider
            label="Либидо (опционально)"
            value={wellbeingForm.libido}
            onChange={(value) => setWellbeingForm({ ...wellbeingForm, libido: value })}
          />
          <TextArea
            label="Заметки"
            value={wellbeingForm.notes}
            onChange={(e) => setWellbeingForm({ ...wellbeingForm, notes: e.target.value })}
            rows={3}
            placeholder="Как вы себя чувствовали сегодня?"
          />
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmitWellbeing} className="flex-1">
              Сохранить
            </Button>
            <Button
              onClick={() => setIsWellbeingModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>

      {/* Measurement Modal */}
      <Modal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        title="Замеры"
      >
        <div>
          <Input
            type="number"
            step="0.1"
            label="Вес (кг) *"
            value={measurementForm.weight}
            onChange={(e) => setMeasurementForm({ ...measurementForm, weight: e.target.value })}
            placeholder="70.5"
          />
          <Input
            type="number"
            step="0.1"
            label="Талия (см)"
            value={measurementForm.waist}
            onChange={(e) => setMeasurementForm({ ...measurementForm, waist: e.target.value })}
            placeholder="75"
          />
          <Input
            type="number"
            step="0.1"
            label="Бёдра (см)"
            value={measurementForm.hips}
            onChange={(e) => setMeasurementForm({ ...measurementForm, hips: e.target.value })}
            placeholder="95"
          />
          <Input
            type="number"
            step="0.1"
            label="Грудь (см)"
            value={measurementForm.chest}
            onChange={(e) => setMeasurementForm({ ...measurementForm, chest: e.target.value })}
            placeholder="90"
          />
          <div className="flex space-x-3 mt-6">
            <Button onClick={handleSubmitMeasurement} className="flex-1">
              Сохранить
            </Button>
            <Button
              onClick={() => setIsMeasurementModalOpen(false)}
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
