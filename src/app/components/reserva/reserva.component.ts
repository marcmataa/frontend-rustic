import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import api from '../../interceptors/axios';
import { AuthService } from '../../services/auth.service';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [FormsModule, RouterLink, CalendarComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})
export class ReservaComponent implements OnInit {
  private router = inject(Router);
  public authService = inject(AuthService);

  // Sireve para poder usarlo en el template
  Number = Number;

  name = signal('');
  surname = signal('');
  phone = signal('');
  guests = signal('1');
  date = signal('');
  startTime = signal('');
  showLoginPrompt = signal(false);

  // Objeto Date para pasarle al calendario como @Input
  selectedDateObj: Date | null = null;

  ngOnInit() {
    // Recuperamos el borrador si venimos del login
    const draft = sessionStorage.getItem('reserva_draft');
    if (draft) {
      const data = JSON.parse(draft);
      this.name.set(data.name || '');
      this.surname.set(data.surname || '');
      this.phone.set(data.phone || '');
      this.guests.set(data.guests || '1');
      this.date.set(data.date || '');
      this.startTime.set(data.startTime || '');

      // Si había fecha, reconstruimos el objeto Date para el calendario
      if (data.date) {
        const [yyyy, mm, dd] = data.date.split('-').map(Number);
        this.selectedDateObj = new Date(yyyy, mm - 1, dd);
      }

      // Limpiamos el borrador para que no reaparezca en visitas futuras
      sessionStorage.removeItem('reserva_draft');
    }

    if (localStorage.getItem('token')) {
      this.userInfo();
    }
  }
  userInfo() {
    // Llamamos al servicio de getUserProfile del authservice para recojer los datos del usuario
    this.authService.getUserProfile().subscribe({
      next: (user: any) => {
        console.log(user);
        // Rellenamos los signals automáticamente
        this.name.set(user.data.data.name);
        this.surname.set(user.data.data.surname);
      },
      error: (e) => console.log('No se pudo cargar el perfil', e),
    });
  }

  isSunday = signal(false);
  isMonday = signal(false);
  // Cuando el calendario emite una fecha
  onDateSelected(date: Date) {
  const day = date.getDay();
  const sunday = day === 0;

  this.isSunday.set(sunday);

  // Si cambia a domingo y tenía una hora de cena seleccionada, la limpiamos
  if (sunday && this.startTime().startsWith('20')) {
    this.startTime.set('');
  }

  this.selectedDateObj = date;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  this.date.set(`${yyyy}-${mm}-${dd}`);
}

  // Formatea la fecha para mostrarla bonita en los chips
  formatDateDisplay(dateStr: string): string {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    const meses = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];
    return `${parseInt(dd)} ${meses[parseInt(mm) - 1]} ${yyyy}`;
  }

  // Control de personas con botones +/-
  incrementGuests() {
    this.guests.set(String(Number(this.guests()) + 1));
  }

  decrementGuests() {
    const current = Number(this.guests());
    if (current > 1) this.guests.set(String(current - 1));
  }

  isFormValid(): boolean {
    const phoneRegex = /^[0-9]{9}$/;
    return (
      this.name().trim().length > 0 &&
      this.surname().trim().length > 0 &&
      phoneRegex.test(this.phone()) &&
      this.date().length > 0 &&
      this.startTime().length > 0 &&
      Number(this.guests()) >= 1
    );
  }

  onReserva() {
    // Si no estas logueado mostrar el modal en vez de enviar
    if (!this.authService.isLogged()) {
      this.showLoginPrompt.set(true);
      document.body.style.overflow = 'hidden';
      return;
    }

    let data = {
      name: this.name(),
      surname: this.surname(),
      phone: this.phone(),
      guests: Number(this.guests()),
      date: this.date(),
      startTime: this.startTime(),
    };
    console.log('Datos que voy a enviar:', data);

    let config = {
      method: 'post',
      url: 'reserva/create',
      headers: { 'Content-Type': 'application/json' },
      data: data,
    };
    api
      .request(config)
      .then(() => {
        alert('¡Reserva realizada con éxito!');

        this.resetForm();
        this.router.navigate(['/']);
      })
      .catch((e) => {
        if (e.response && e.response.status === 409) {
          const mensajeDeError = e.response.data.message;

          // Mostramos el error de cuando esta todo lleno
          alert(mensajeDeError);
        } else {
          // Error genérico para otras cosas
          alert('Ha ocurrido un error inesperado. Por favor, intenta de nuevo.');
        }
        console.log('Error en la reserva: ', e);
      });
  }
  // Ir al login conservando la url de retorno
  goToLogin() {
    document.body.style.overflow = '';
    // Guardamos los datos del formulario antes de ir al login
    sessionStorage.setItem(
      'reserva_draft',
      JSON.stringify({
        name: this.name(),
        surname: this.surname(),
        phone: this.phone(),
        guests: this.guests(),
        date: this.date(),
        startTime: this.startTime(),
      }),
    );

    this.router.navigate(['/login'], { queryParams: { returnUrl: '/reserva' } });
  }

  //Cerrar el modal
  closeLoginPrompt() {
    this.showLoginPrompt.set(false);
    document.body.style.overflow = '';
  }

  private resetForm() {
    this.name.set('');
    this.surname.set('');
    this.phone.set('');
    this.guests.set('1');
    this.date.set('');
    this.startTime.set('');
  }

  // Creamos loos horarios para reservar
  lunchSlots = this.generateSlots('12:45', '14:15');
  dinnerSlots = this.generateSlots('20:00', '22:00');

  isTimePickerVisible = signal(false);

  toggleTimePicker() {
    this.isTimePickerVisible.update((visible) => !visible);
  }

  selectTime(time: string) {
    this.startTime.set(time);
    this.isTimePickerVisible.set(false);

  }
  // Select time para que se cierre al elegir
  closeTimePicker() {
    this.isTimePickerVisible.set(false);
  }
  // Lógica para generar los intervalos de tiempo de reserva
  private generateSlots(start: string, end: string): string[] {
    const slots = [];
    let [hour, minute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    // Bucle para pasarlo mientras las horas y minutos sean menores al end
    while (hour < endHour || (hour === endHour && minute <= endMinute)) {
      // Se combierte cada hora en una cadena de strings con hora: minutos
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
      minute += 15;
      // Si los minutos llegan a 60, lo combierte en hora y cambia los minutos
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }
}
