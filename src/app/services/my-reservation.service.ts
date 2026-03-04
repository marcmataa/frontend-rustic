import { Injectable, signal } from '@angular/core';
import api from '../interceptors/axios';

@Injectable({
  providedIn: 'root',
})
export class MyReservationService {
  seeReservationSignal = signal<any[]>([]);

  async getReservation() {
    const config = {
      method: 'get',
      url: 'reserva/',
      data: '',
    };
    try {
      const response = await api.request(config);
      this.seeReservationSignal.set(response.data.data);
      console.log("Datos en el servicio de ver reservas: ", this.seeReservationSignal());
    } catch (e){
      console.log("Error en los datos en el servicio de ver reservas: ", e);
      throw e;
    }
  }

  async deleteReservation(id: string){
    const config = {
      method: 'delete',
      url: `reserva/delete/${id}`,
      data:  ''
    };
    try {

      const response = await api.request(config);
      await this.getReservation();
      console.log("Datos en el servicio de reseravs a eliminar: ", this.seeReservationSignal());
      return response.data
    } catch (e){
      console.log("Error en el servicio de eliminar reservas: ", e);
      throw (e)
    }
  }
}


