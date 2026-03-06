import { Component, EventEmitter, Output, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();
  @Input() selectedDate: Date | null = null;
  @Input() adminMode: boolean = false; // Si es true, no bloquea nada

  currentDate = signal(new Date());

  get daysInMonth(): number[] {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  selectDate(day: number) {
    if (this.isDisabled(day)) return; // Bloquea el click si está deshabilitado
    const selected = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    this.dateSelected.emit(selected);
  }

  changeMonth(delta: number) {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + delta);
    this.currentDate.set(newDate);
  }

  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  diasSemana: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  isPast(day: number): boolean {
    const checkDate = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    const d = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    return d.toDateString() === this.selectedDate.toDateString();
  }

  isMonday(day: number): boolean {
    const d = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    return d.getDay() === 1;
  }

  // Solo bloquea si NO es admin
  isDisabled(day: number): boolean {
  if (this.adminMode) return false; // Admin nunca tiene nada bloqueado
  return this.isPast(day) || this.isMonday(day);
}

  get firstDayOffset(): number[] {
    const firstDay = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 1).getDay();
    const offset = (firstDay + 6) % 7;
    return Array.from({ length: offset }, (_, i) => i);
  }
}