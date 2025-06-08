import React, { useState, useEffect, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Settings, Calendar as CalendarIcon, Clock, Ban } from 'lucide-react';
import { guideAvailabilityService } from '../../services/guide-availability.service';
import { GuideScheduleSettings } from '../../types/guide-availability';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GuideAvailabilityManagerProps {
  guideId: string;
}

export const GuideAvailabilityManager: React.FC<GuideAvailabilityManagerProps> = ({
  guideId
}) => {
  const [settings, setSettings] = useState<GuideScheduleSettings | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockReason, setBlockReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [guideId]);

  const loadSettings = async () => {
    try {
      const guideSettings = await guideAvailabilityService.getGuideSettings(guideId);
      setSettings(guideSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<GuideScheduleSettings>) => {
    if (!settings) return;

    setLoading(true);
    try {
      await guideAvailabilityService.updateGuideSettings(guideId, newSettings);
      setSettings({ ...settings, ...newSettings });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const blockSelectedDates = async () => {
    if (selectedDates.length === 0) return;

    setLoading(true);
    try {
      const dateStrings = selectedDates.map(date => format(date, 'yyyy-MM-dd'));
      await guideAvailabilityService.blockDates(guideId, dateStrings, blockReason);
      setSelectedDates([]);
      setBlockReason('');
    } catch (error) {
      console.error('Erro ao bloquear datas:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' }
  ];

  if (!settings) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Configurações de Horário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações de Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dias da Semana */}
          <div>
            <Label className="text-base font-medium">Dias de Trabalho</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {weekDays.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Switch
                    checked={settings.workingDays.includes(day.value)}
                    onCheckedChange={(checked) => {
                      const newWorkingDays = checked
                        ? [...settings.workingDays, day.value]
                        : settings.workingDays.filter(d => d !== day.value);
                      updateSettings({ workingDays: newWorkingDays });
                    }}
                  />
                  <Label className="text-sm">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Horário de Trabalho */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Horário de Início</Label>
              <Input
                id="start-time"
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => updateSettings({
                  workingHours: {
                    ...settings.workingHours,
                    start: e.target.value
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="end-time">Horário de Fim</Label>
              <Input
                id="end-time"
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => updateSettings({
                  workingHours: {
                    ...settings.workingHours,
                    end: e.target.value
                  }
                })}
              />
            </div>
          </div>

          {/* Configurações Avançadas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-advance">Antecedência Mínima (horas)</Label>
              <Input
                id="min-advance"
                type="number"
                value={settings.minimumAdvanceHours}
                onChange={(e) => updateSettings({
                  minimumAdvanceHours: parseInt(e.target.value)
                })}
              />
            </div>
            <div>
              <Label htmlFor="break-time">Intervalo entre Reservas (min)</Label>
              <Input
                id="break-time"
                type="number"
                value={settings.breakBetweenBookings}
                onChange={(e) => updateSettings({
                  breakBetweenBookings: parseInt(e.target.value)
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloquear Datas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ban className="h-5 w-5 mr-2" />
            Bloquear Datas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DayPicker
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            locale={ptBR}
            className="rounded-md border"
          />
          
          {selectedDates.length > 0 && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="block-reason">Motivo do Bloqueio (opcional)</Label>
                <Input
                  id="block-reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Ex: Férias, compromisso pessoal..."
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedDates.map((date, index) => (
                  <Badge key={index} variant="secondary">
                    {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                  </Badge>
                ))}
              </div>
              
              <Button
                onClick={blockSelectedDates}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Bloqueando...' : `Bloquear ${selectedDates.length} data(s)`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};