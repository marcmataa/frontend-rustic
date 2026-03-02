import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import api from '../../interceptors/axios';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name= signal ('');
  surname = signal('');
  email = signal('');
  phone = signal('');
  guests = signal('1');
  date = signal('');
  startTime = signal('');

  onReserva() {
    const end = this.calcularEndTime(this.startTime())
    let data = {
      name: this.name(),
      surname: this.surname(),
      email: this.email(),
      phone: this.phone(),
      guests: Number(this.guests()), 
      date: this.date(),
      startTime: this.startTime(),
      endTime: end
    };
    console.log("Datos que voy a enviar:", data);

    let config = {
      method: 'post',
      url: 'reserva/create',
      headers: {'Content-Type': 'application/json'},
      data: data
    }
    api.request(config) 
    .then((response)=>{
      
       alert('¡Reserva realizada con éxito!');

        this.resetForm();
        this.router.navigate(['/']);
      
    })
    .catch((e)=>{
      console.log('Error en la reserva: ', e)
    })
  }
  private resetForm() {
    this.name.set('');
    this.surname.set('');
    this.email.set('');
    this.phone.set('');
    this.guests.set('1');
    this.date.set('');
    this.startTime.set('');
  }

  private calcularEndTime(start: string): string {
    const [hours, minutes] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(hours + 2, minutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  lunchSlots = this.generateSlots('12:30', '15:00');
  dinnerSlots = this.generateSlots('20:00', '22:30');
// Añade esta signal arriba con las demás
isTimePickerVisible = signal(false);

// Añade estos métodos
toggleTimePicker() {
  this.isTimePickerVisible.update(visible => !visible);
}

// Modifica ligeramente tu selectTime para que se cierre al elegir
selectTime(time: string) {
  this.startTime.set(time);

}
closeTimePicker() {
  this.isTimePickerVisible.set(false);
}
  // Lógica para generar los intervalos
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
}
