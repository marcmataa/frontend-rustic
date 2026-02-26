import { Injectable, signal } from '@angular/core';
import api from '../interceptors/axios';

@Injectable({
  providedIn: 'root',
})
export class EditCartaService {
  // Creamos un signal con un array vacio y en editCartaSignal es donde se guardaran los platos de la BD
  editCartaSignal = signal<any[]>([]);

  async getCarta() {
    // Este config es para decir a axios la informacion que llevara el objeto
    const config = {
      method: 'get',
      url: 'carta/',
      data: '',
    };
    try {
      const response = await api.request(config);
      // Esto sirve para recibir los datos que tiene el response.data
      this.editCartaSignal.set(response.data.data);
      console.log('Datos en servicio: ', this.editCartaSignal());
    } catch (e) {
      console.log('Error en el servicio: ', e);
      throw e;
    }
  }
  async updateDish(id: String, updatedData: any) {
    const config = {
      method: 'put',
      url: `carta/update/${id}`,
      data: updatedData,
    };
    try {
      const response = await api.request(config);
      // Ponemos el this.getCarta() para que Signal se actualice automaticamente una vez hagas la modificacion, es decir se vea la tabla de mongoDB correctamente
      await this.getCarta();
      console.log('Datos en servicio de editar: ', this.editCartaSignal());
      // Cuando hacemos algun cambio enviamos este return para que angular sepa si la accion en el back tuvo algun fallo o funcionó correctamente
      return response.data;
    } catch (e) {
      console.log('Error en el servicio: ', e);
      throw e;
    }
  }
}
