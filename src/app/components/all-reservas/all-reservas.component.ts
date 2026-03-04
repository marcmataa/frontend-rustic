import { Component, inject, signal, computed } from '@angular/core';
import { AllReservasService } from '../../services/all-reservas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-reservas',
  imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './all-reservas.component.html',
  styleUrl: './all-reservas.component.css',
})
export class AllReservasComponent {
  private allReservasService = inject(AllReservasService);
  router = inject(Router);
  // Variables
  allReservas = this.allReservasService.allReservasSignal;
  // Sirve para guardar el dia que seleccionamos en el calendario.
  selectedDate = signal<Date | null>(null);
  editingId: string | null = null;
  tempReserva: any = null; // Aquí guardaremos la copia temporal
  showCreateForm: boolean = false;
  isTimePickerVisible = signal(false);
  // Slots para gestionar el horario
  lunchSlots = this.generateSlots('12:45', '14:15');
  dinnerSlots = this.generateSlots('20:00', '22:00');

  reservas = {
    name: '',
    surname: '',
    phone: '',
    guests: 1,
    date: '',
    startTime: '',
    endTime: '',
    status: 'confirmada',
  };

  toggleTimePicker() {
    this.isTimePickerVisible.update((visible) => !visible);
  }

  selectTime(time: string) {
    this.reservas.startTime = time;
    this.isTimePickerVisible.set(false); // Cerramos tras elegir
  }

  private generateSlots(start: string, end: string): string[] {
    const slots = [];
    let [hour, minute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      minute += 15;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  private calculateEndTime(startTime: string): string {
  if (!startTime) return "00:00";
  const [h, m] = startTime.split(':').map(Number);
  
  // Creamos fecha, sumamos 2 horas
  const date = new Date();
  date.setHours(h + 2, m); 
  
  const finalH = String(date.getHours()).padStart(2, '0');
  const finalM = String(date.getMinutes()).padStart(2, '0');
  return `${finalH}:${finalM}`;
}
  // Funciones
  // 2. Ajustamos el computed para que si es null, no intente filtrar nada
  filteredReservas = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return []; // Si no hay ninguna fecha, no mostramos reservas

    return this.allReservas().filter((reserva) => {
      const rDate = new Date(reserva.date);
      return (
        rDate.getFullYear() === selected.getFullYear() &&
        rDate.getMonth() === selected.getMonth() &&
        rDate.getDate() === selected.getDate()
      );
    });
  });

  onDateReceived(date: Date) {
    this.selectedDate.set(date);
    console.log('Fecha seleccionada:', date);
  }

  async ngOnInit() {
    try {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login']);
        return;
      }
      await this.allReservasService.getReservas();
      console.log(this.allReservas());
    } catch (e) {
      console.log('Error en el all-reservas component: ', e);
    }
  }

  async updateReserva(data: any) {
    try {
      const response = await this.allReservasService.updateReservas(data._id, data);
      if (response.success) {
        alert('Reserva actualizada correctamente');
      }
    } catch (e: any) {
      const mensajeError = e.response?.data?.message || 'Error al actualizar la reserva';

      // 2. Mostramos ese mensaje en lugar del genérico
      alert(mensajeError);
      console.log('error al actualizar la reserva: ', e);
    }
  }

  // Al pulsar el botón editar
  startEdit(reserva: any) {
    this.editingId = reserva._id;
    this.tempReserva = { ...reserva }; // Clonamos el objeto para no modificar el original
  }

  // Al pulsar el botón guardar
  async saveEdit() {
    await this.updateReserva(this.tempReserva); // Usamos tu función existente
    this.editingId = null; // Salimos del modo edición
  }

  // Al cancelar
  cancelEdit() {
    this.editingId = null;
  }

  async createReserva() {
    try {
    const selectedDate = this.selectedDate();
    
    // 1. Validar fecha (¡MUY IMPORTANTE!)
    if (!selectedDate) {
      alert("Por favor, selecciona un día en el calendario.");
      return;
    }

    // 2. Preparar fecha en formato YYYY-MM-DD (Evita el cambio de día por UTC)
    this.reservas.date = selectedDate.toLocaleDateString('en-CA'); 

    // 3. Cálculo de 2 horas
    this.reservas.endTime = this.calculateEndTime(this.reservas.startTime);

    console.log("Enviando al servidor:", JSON.stringify(this.reservas, null, 2));
      

      const response = await this.allReservasService.createReservas(this.reservas);
      if (response.success) {
        this.reservas = {
          name: '',
          surname: '',
          phone: '',
          guests: 1,
          date: '',
          startTime: '',
          endTime: '',
          status: 'confirmada',
        };
        this.showCreateForm = false;
        await this.allReservasService.getReservas();
        alert('Reserva creada correctamente');
      }
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || 'Error al actualizar la reserva';

      // 2. Mostramos ese mensaje en lugar del genérico
      alert(errorMessage);
      console.log('error al actualizar la reserva: ', e);
    }
  }
}
