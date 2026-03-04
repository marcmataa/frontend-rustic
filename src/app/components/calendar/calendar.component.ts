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
  // Esta línea es la magia: avisa al componente padre cuando se pulsa una fecha
  @Output() dateSelected = new EventEmitter<Date>();
  // 2. Este Input recibe la fecha desde el padre
 @Input() selectedDate: Date | null = null;
  
  currentDate = signal(new Date());

  get daysInMonth(): number[] {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }

  selectDate(day: number) {
    const selected = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    this.dateSelected.emit(selected); // <--- Aquí enviamos la fecha seleccionada
  }
  // En calendar.component.ts
changeMonth(delta: number) {
  const newDate = new Date(this.currentDate());
  newDate.setMonth(newDate.getMonth() + delta);
  this.currentDate.set(newDate);
}
// Añade esto dentro de tu clase CalendarComponent
meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
diasSemana: string[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Verifica si el día es anterior a hoy
  isPast(day: number): boolean {
    const checkDate = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
    const today = new Date();
    today.setHours(0,0,0,0); // Reseteamos horas para comparar solo fechas
    return checkDate < today;
  }

  // Verifica si el día es el que el usuario ha seleccionado
  isSelected(day: number): boolean {
  if (!this.selectedDate) return false; // Si es null, nada está seleccionado

  const d = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), day);
  return d.toDateString() === this.selectedDate.toDateString();
}

get firstDayOffset(): number[] {
  // Obtenemos el día de la semana en que cae el día 1 (0=Domingo, 1=Lunes...)
  const firstDay = new Date(this.currentDate().getFullYear(), this.currentDate().getMonth(), 1).getDay();
  
  // Ajustamos: Sunday(0) -> 6, Mon(1) -> 0, Tue(2) -> 1 ...
  // Esto hace que el lunes sea el día 0 y el domingo el día 6
  const offset = (firstDay + 6) % 7; 
  
  return Array.from({ length: offset }, (_, i) => i);
}
}