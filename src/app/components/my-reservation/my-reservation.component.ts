import { Component, computed, inject, signal } from '@angular/core';
import { MyReservationService } from '../../services/my-reservation.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common'; //Sirve para poder leer datas de mejor forma

@Component({
  selector: 'app-my-reservation',
  imports: [DatePipe, CommonModule],
  templateUrl: './my-reservation.component.html',
  styleUrl: './my-reservation.component.css',
})
export class MyReservationComponent {
  private myReservationsService = inject(MyReservationService);
  router = inject(Router);

  seeReservation = this.myReservationsService.seeReservationSignal;

  // Estado para la paginación
  currentPage = signal(1);
  pageSize = 3;
  // Filtro para poder crear el historial
  currentView = signal<'upcoming' | 'past'>('upcoming');
  // Lista paginada calculada automáticamente
  paginatedReservations = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.seeReservation().slice(start, start + this.pageSize);
  });

  // Calcular si hay más páginas
  totalPages = computed(() => Math.ceil(this.seeReservation().length / this.pageSize));

  changePage(page: number) {
    this.currentPage.set(page);
  }

  async ngOnInit() {
    try {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login']);
        return;
      }
      await this.loadData('upcoming');
    } catch (e) {
      console.log(e);
    }
  }

  async loadData(filter: 'upcoming' | 'past') {
    this.currentView.set(filter);
    this.currentPage.set(1); // Importante: volver a la página 1 al cambiar de filtro
    await this.myReservationsService.getReservation(filter);
  }

  async deleteReservation(data: any) {
    try {
      const response = await this.myReservationsService.deleteReservation(data._id);
      if (response.success) {
        alert('Reserva cancelada correctamente');
      }
    } catch (e: any) {
      if (e.response && e.response.status === 403) {
        alert('Lo sentimos, las reservas deben cancelarse con al menos 1 hora de antelación');
      } else {
        alert('No se ha podido cancelar la reserva');
      }
    }
  }

  goToReservation() {
    this.router.navigate(['/reserva']); 
  }
}
