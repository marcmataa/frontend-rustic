// Importaciones
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditCartaService } from '../../services/edit-carta.service'
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
  router=inject(Router)
  // Creo un acceso signal del servicio para si algo cambia, aqui tambien
  editCarta= this.editCartaService.editCartaSignal
  
  // El funcionamiento de ngOnInit es buscar y ejecutar automaticamente una vez el componente en el navegador.
  async ngOnInit(){
try {

  if(!localStorage.getItem('token')){
    this.router.navigate(['/login']);
    return;
  }
  // Lo que hace esto es cojer la informacion que llega del back y con un get hace que aparezcan en el HTML
  await this.editCartaService.getCarta()
  console.log(this.editCarta())
} catch (e){
  console.log(e)
}
}
async createDishes(){
  const newDishes = {
    name: 'Nombre Producto',
    description: 'Descripcion Producto',
    price: '10',
    category: 'burguers'
  };
}
async updateDishes(dishes: any){
  console.log('Actualizando: ', dishes)
}
async deleteDishes(id: string){
  console.log('Eliminando plato: ', id)
}
}
