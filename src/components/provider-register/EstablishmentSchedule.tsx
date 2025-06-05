
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScheduleEntry {
  open: string;
  close: string;
  closed: boolean;
}

interface Schedule {
  monday: ScheduleEntry;
  tuesday: ScheduleEntry;
  wednesday: ScheduleEntry;
  thursday: ScheduleEntry;
  friday: ScheduleEntry;
  saturday: ScheduleEntry;
  sunday: ScheduleEntry;
}

interface EstablishmentScheduleProps {
  schedule: Schedule;
  onScheduleChange: (schedule: Schedule) => void;
}

const EstablishmentSchedule = ({ schedule, onScheduleChange }: EstablishmentScheduleProps) => {
  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const updateSchedule = (day: keyof Schedule, field: keyof ScheduleEntry, value: string | boolean) => {
    onScheduleChange({
      ...schedule,
      [day]: { ...schedule[day], [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-cerrado-700">Horário de funcionamento</h4>
      <div className="space-y-3">
        {Object.entries(schedule).map(([day, scheduleEntry]) => (
          <div key={day} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-full md:w-32">
              <Label className="text-sm font-medium">{dayNames[day as keyof typeof dayNames]}</Label>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-1">
              <Input
                type="time"
                value={scheduleEntry.open}
                onChange={(e) => updateSchedule(day as keyof Schedule, 'open', e.target.value)}
                disabled={scheduleEntry.closed}
                className="w-full sm:w-24"
              />
              <span className="text-sm text-gray-500 hidden sm:inline">às</span>
              <Input
                type="time"
                value={scheduleEntry.close}
                onChange={(e) => updateSchedule(day as keyof Schedule, 'close', e.target.value)}
                disabled={scheduleEntry.closed}
                className="w-full sm:w-24"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={scheduleEntry.closed}
                  onChange={(e) => updateSchedule(day as keyof Schedule, 'closed', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Fechado</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstablishmentSchedule;
