import { Injectable, signal } from '@angular/core';
import api from '../interceptors/axios'

@Injectable({
  providedIn: 'root',
})
export class EditCartaService {
  // Creamos un signal con un array vacio y en editCartaSignal es donde se guardaran los platos de la BD
  editCartaSignal= signal<any[]>([])

  async getCarta(){
    // Este config es para decir a axios la informacion que llevara el objeto
    const config = {
      method: 'post',
      url:'carta/edit-carta',
      data:''
    }
    try {
      const response = await api.request(config);
      // Esto sirve para recibir los datos que tiene el response.data
      this.editCartaSignal.set(response.data);
      console.log('Datos en servicio: ', this.editCartaSignal())
    } catch(e){
      console.log('Error en el servicio: ', e);
      throw e;
    }
  };
}
