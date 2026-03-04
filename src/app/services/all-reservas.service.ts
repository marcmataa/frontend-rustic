import { Injectable, signal } from '@angular/core';
import api from '../interceptors/axios';

@Injectable({
  providedIn: 'root',
})
export class AllReservasService {
  allReservasSignal = signal<any[]>([])
  async getReservas(){
    const config = {
      method: 'get',
      url: 'reserva/all',
      data: '',
    };
    try {
      const response = await api.request(config);
      this.allReservasSignal.set(response.data.data)
      console.log('Datos en el servicio de ver todas las reservas: ', this.allReservasSignal());
    } catch (e){
      console.log('Error en el servicio: ', e);
      throw e;
    }
  }

  async updateReservas(id: string, updateData: any){
    const config = {
      method: 'put',
      url: `reserva/update/${id}`,
      data:updateData,
    };
    try {
      const response = await api.request(config);
      await this.getReservas();
      console.log('Datos en el servicio de editar reserva: ', this.allReservasSignal());
      return response.data;
    } catch (e){
      console.log("Error en el servicio de actualizar reservas: ", e);
      throw e;
    }
  }

  async createReservas (createData: any){
    try {
      const config = {
        method: 'post',
        url: 'reserva/create',
        data: createData
      }

      const response = await api.request(config);

      await this.getReservas();
      return response.data;    
    } catch (e){
      console.log("Error en el servicio al crear una reserva: ",e);
      throw e;
    }
  }
}
