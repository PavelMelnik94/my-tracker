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
import { useHealthStore } from '../../entities/health';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/ui/card';
import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Textarea } from '../../shared/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../shared/ui/dialog';
import { BarChart3, Activity, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { generateId, formatDate } from '../../shared/utils/date';
import type { BloodTestEntry } from '../../shared/types';
import { cn } from '../../shared/lib/utils';

// Helper function to get status and recommendation based on blood test values
const getBloodTestAnalysis = (bloodTests: BloodTestEntry[]) => {
  if (bloodTests.length === 0) return null;

  const latest = bloodTests[bloodTests.length - 1];
  const recommendations: string[] = [];
  const warnings: string[] = [];

  // Leptin analysis (normal range: 1-15 ng/mL for men, 2-25 ng/mL for women)
  if (latest.leptin !== undefined) {
    if (latest.leptin < 2) {
      warnings.push('Критически низкий уровень лептина');
      recommendations.push('Увеличьте калорийность рациона, включите больше здоровых жиров');
      recommendations.push('Рекомендуются: авокадо, орехи, жирная рыба, оливковое масло');
      recommendations.push('Попробуйте специальные рецепты для повышения лептина');
    } else if (latest.leptin < 5) {
      warnings.push('Низкий уровень лептина');
      recommendations.push('Следите за достаточной калорийностью питания');
    }
  }

  // Vitamin D analysis (optimal: >30 ng/mL, deficiency: <20 ng/mL)
  if (latest.vitaminD !== undefined) {
    if (latest.vitaminD < 20) {
      warnings.push('Дефицит витамина D');
      recommendations.push('Увеличьте потребление продуктов, богатых витамином D');
      recommendations.push('Рекомендуются: жирная рыба (лосось, скумбрия), печень трески, яичные желтки');
      recommendations.push('Рассмотрите прием добавок витамина D3 (1000-2000 МЕ/день)');
      recommendations.push('Больше времени проводите на солнце (15-20 минут в день)');
    } else if (latest.vitaminD < 30) {
      warnings.push('Недостаточный уровень витамина D');
      recommendations.push('Увеличьте потребление витамина D через питание и солнечный свет');
    }
  }

  // HOMA-IR analysis (optimal: <2, insulin resistance: >2.5)
  if (latest.homaIR !== undefined) {
    if (latest.homaIR > 2.5) {
      warnings.push('Признаки инсулинорезистентности');
      recommendations.push('Снизьте потребление простых углеводов');
      recommendations.push('Увеличьте физическую активность (минимум 30 минут ходьбы ежедневно)');
      recommendations.push('Добавьте больше клетчатки в рацион');
    } else if (latest.homaIR > 2) {
      warnings.push('Повышенный HOMA-IR');
      recommendations.push('Контролируйте потребление углеводов');
    }
  }

  // Iron analysis (normal: 60-170 μg/dL)
  if (latest.iron !== undefined) {
    if (latest.iron < 60) {
      warnings.push('Низкий уровень железа');
      recommendations.push('Увеличьте потребление красного мяса, печени, бобовых');
      recommendations.push('Сочетайте железо с витамином C для лучшего усвоения');
    } else if (latest.iron > 170) {
      warnings.push('Повышенный уровень железа');
      recommendations.push('Ограничьте продукты, богатые железом');
      recommendations.push('Проконсультируйтесь с врачом');
    }
  }

  return { warnings, recommendations, latest };
};

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
      .slice(-30);
  }, [measurements]);

  // Calculate weight trend
  const weightTrend = useMemo(() => {
    if (weightData.length < 2) return null;
    const first = weightData[0].weight;
    const last = weightData[weightData.length - 1].weight;
    const change = last - first;
    return {
      change: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  }, [weightData]);

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
      .slice(-30);
  }, [wellbeing]);

  // Calculate wellbeing averages
  const wellbeingAverages = useMemo(() => {
    if (wellbeingData.length === 0) return null;
    const sum = wellbeingData.reduce(
      (acc, curr) => ({
        energy: acc.energy + curr.energy,
        sleep: acc.sleep + curr.sleep,
        mood: acc.mood + curr.mood,
        stress: acc.stress + curr.stress,
      }),
      { energy: 0, sleep: 0, mood: 0, stress: 0 }
    );
    const count = wellbeingData.length;
    return {
      energy: (sum.energy / count).toFixed(1),
      sleep: (sum.sleep / count).toFixed(1),
      mood: (sum.mood / count).toFixed(1),
      stress: (sum.stress / count).toFixed(1),
    };
  }, [wellbeingData]);

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

  const bloodTestAnalysis = useMemo(() => {
    return getBloodTestAnalysis(sortedBloodTests);
  }, [sortedBloodTests]);

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          Аналитика и прогресс
        </h1>
        <p className="text-muted-foreground mt-1">Отслеживайте свои показатели здоровья</p>
      </div>

      {/* Wellbeing Summary */}
      {wellbeingAverages && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Средние показатели самочувствия (за последние {wellbeingData.length} дней)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">{wellbeingAverages.energy}</div>
                <div className="text-sm text-muted-foreground">Энергия</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-blue-600">{wellbeingAverages.sleep}</div>
                <div className="text-sm text-muted-foreground">Сон</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-yellow-600">{wellbeingAverages.mood}</div>
                <div className="text-sm text-muted-foreground">Настроение</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-red-600">{wellbeingAverages.stress}</div>
                <div className="text-sm text-muted-foreground">Стресс</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blood Test Analysis & Recommendations */}
      {bloodTestAnalysis && (bloodTestAnalysis.warnings.length > 0 || bloodTestAnalysis.recommendations.length > 0) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Анализ результатов и рекомендации
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bloodTestAnalysis.warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="w-4 h-4" />
                  Обратите внимание
                </h4>
                <ul className="space-y-1">
                  {bloodTestAnalysis.warnings.map((warning, idx) => (
                    <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
            {bloodTestAnalysis.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <CheckCircle className="w-4 h-4" />
                  Рекомендации
                </h4>
                <ul className="space-y-1">
                  {bloodTestAnalysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-blue-700 dark:text-blue-300">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Weight Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Изменение веса
            </CardTitle>
            {weightTrend && (
              <div className="flex items-center gap-2 text-sm">
                {weightTrend.direction === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : weightTrend.direction === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                ) : null}
                <span className={cn(
                  "font-semibold",
                  weightTrend.direction === 'up' && "text-red-500",
                  weightTrend.direction === 'down' && "text-green-500"
                )}>
                  {weightTrend.direction === 'up' ? '+' : '-'}{weightTrend.change} кг
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {weightData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Нет данных для отображения</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
                  formatter={(value) => [`${value} кг`, 'Вес']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" name="Вес (кг)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Wellbeing Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Динамика самочувствия
          </CardTitle>
        </CardHeader>
        <CardContent>
          {wellbeingData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Нет данных для отображения</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wellbeingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#10b981" name="Энергия" strokeWidth={2} />
                <Line type="monotone" dataKey="sleep" stroke="#3b82f6" name="Сон" strokeWidth={2} />
                <Line type="monotone" dataKey="mood" stroke="#f59e0b" name="Настроение" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Стресс" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Blood Tests */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Анализы крови</CardTitle>
            <Button onClick={() => handleOpenBloodTestModal()} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedBloodTests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Нет записей об анализах</p>
          ) : (
            <div className="space-y-4">
              {sortedBloodTests.map((test) => (
                <div key={test.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold">
                      {new Date(test.date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenBloodTestModal(test)}
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteBloodTest(test.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {test.leptin && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Лептин:</span>
                        <span className="font-semibold">{test.leptin} нг/мл</span>
                      </div>
                    )}
                    {test.vitaminD && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Витамин D:</span>
                        <span className="font-semibold">{test.vitaminD} нг/мл</span>
                      </div>
                    )}
                    {test.iron && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Железо:</span>
                        <span className="font-semibold">{test.iron} мкг/дл</span>
                      </div>
                    )}
                    {test.homaIR && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">HOMA-IR:</span>
                        <span className="font-semibold">{test.homaIR}</span>
                      </div>
                    )}
                  </div>
                  {test.notes && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">{test.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blood Test Modal */}
      <Dialog open={isBloodTestModalOpen} onOpenChange={setIsBloodTestModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBloodTest ? 'Редактировать анализ' : 'Добавить анализ крови'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <Textarea
              label="Заметки"
              value={bloodTestForm.notes}
              onChange={(e) => setBloodTestForm({ ...bloodTestForm, notes: e.target.value })}
              placeholder="Дополнительные заметки..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBloodTestModalOpen(false)} variant="outline">
              Отмена
            </Button>
            <Button onClick={handleSubmitBloodTest}>
              {editingBloodTest ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
