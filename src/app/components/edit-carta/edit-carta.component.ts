// Importaciones
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditCartaService } from '../../services/edit-carta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-carta',
  imports: [FormsModule],
  templateUrl: './edit-carta.component.html',
  styleUrl: './edit-carta.component.css',
})
export class EditCartaComponent {
  // El inject lo que hace es decir dame lo que tengas de EditCartaservice y te lo doy
  private editCartaService = inject(EditCartaService);
  router = inject(Router);
  // Creo un acceso signal del servicio para si algo cambia, aqui tambien
  editCarta = this.editCartaService.editCartaSignal;

  newDish = {
    name: '',
    description: '',
    price: 0,
    category: 'entrantes' // Pon un valor por defecto que coincida con tus <option>
  };

  // El funcionamiento de ngOnInit es buscar y ejecutar automaticamente una vez el componente en el navegador.
  async ngOnInit() {
    try {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['/login']);
        return;
      }
      // Lo que hace esto es cojer la informacion que llega del back y con un get hace que aparezcan en el HTML
      await this.editCartaService.getCarta();
      console.log(this.editCarta());
    } catch (e) {
      console.log(e);
    }
  }

  async updateDishes(dishes: any) {
    try {
      // Entra a edit-carta.service y le da todo lo que hay dentro de la funcion updateDish, luego da los parametros dishes._id para recoger el id especifico del plato y el dishes para dar todo el objeto. Este dishes lo recoge desde el HTML
      const response = await this.editCartaService.updateDish(dishes._id, dishes);
      // Si el success es true, como le hemos dicho a node, saltara la alerta de que todo ha ido correctamente
      if (response.success) {
        alert('Plato acutalizado correctamente');
      }
    } catch (e) {
      alert('No se ha podido actualizar el plato');
      console.log('Erorr al actualizar el plato: ', e);
    }
  }
  async deleteDishes(dishes: any) {
    try {
      const response = await this.editCartaService.deleteDishes(dishes._id);
      if (response.success) {
        alert('Plato eliminado correctamente');
      }
    } catch (e) {
      alert('No se ha podido eliminar el plato');
      console.log('Error al eliminar el plato: ', e);
    }
  }
  async createDishes(dishes: any) {
    try {
      const response = await this.editCartaService.createDishes(dishes);
      if (response.success) {
        this.newDish = {
          name: '',
          description: '',
          price: 0,
          category: 'entrantes',
        };
        alert('Plato creado correctamente');
      }
    } catch (e) {
      alert('No se ha podido crear el plato');
      console.log('Error al crear el plato: ', e);
    }
  }
}
