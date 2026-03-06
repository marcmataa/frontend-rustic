import { Component, inject, ChangeDetectorRef } from '@angular/core';
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
  private editCartaService = inject(EditCartaService);
  private cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  editCarta = this.editCartaService.editCartaSignal;

  // Sirve para saber que fila se esta editando en cada momento
  editingId: string | null = null;
  // Mensaje temporal
  toast: string = '';

  // Sirve para activar o desactivar la edicion en al html
  openEdit(id: string) { this.editingId = id; }
  closeEdit()          { this.editingId = null; }

  // Creas el mensaje personalizado el cual le das un tiempo de 3000 ms
  showToast(msg: string) {
    this.toast = msg;
    setTimeout(() => {
      this.toast = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  newDish = { name: '', description: '', price: 0, category: 'entrantes' };
// Crea un array de los productos pero separado por la categoria
  getByCategory(cat: string) {
    return (this.editCarta() ?? []).filter((d: any) => d.category === cat);
  }

  async ngOnInit() {
    try {
      if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
      await this.editCartaService.getCarta();
    } catch (e) { console.log(e); }
  }

  async updateDishes(dishes: any) {
    try {
      const response = await this.editCartaService.updateDish(dishes._id, dishes);
      if (response.success) {
        this.editingId = null;
        await this.editCartaService.getCarta();
        this.showToast('Plato actualizado correctamente');
      }
    } catch (e) {
      this.showToast('No se ha podido actualizar el plato');
      console.log('Error al actualizar el plato: ', e);
    }
  }

  async deleteDishes(dishes: any) {
    try {
      const response = await this.editCartaService.deleteDishes(dishes._id);
      if (response.success) {
        this.editingId = null;
        await this.editCartaService.getCarta();
        this.showToast('Plato eliminado correctamente');
      }
    } catch (e) {
      this.showToast('No se ha podido eliminar el plato');
      console.log('Error al eliminar el plato: ', e);
    }
  }

  async createDishes(dishes: any) {
    try {
      const response = await this.editCartaService.createDishes(dishes);
      if (response.success) {
        this.newDish = { name: '', description: '', price: 0, category: 'entrantes' };
        await this.editCartaService.getCarta();
        this.showToast('Plato creado correctamente');
      }
    } catch (e) {
      this.showToast('No se ha podido crear el plato');
      console.log('Error al crear el plato: ', e);
    }
  }
}