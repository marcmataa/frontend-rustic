import { Component, inject, OnInit } from '@angular/core';
import { EditCartaService } from '../../services/edit-carta.service';

@Component({
  selector: 'app-carta',
  imports: [],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css',
})
// El implements OnInit, lo que permite es que este componente tenga una funcion llamada ngOnInit
export class CartaComponent implements OnInit {
  // Traemos el editCartaService y con el private lo que hacemos es que solo se pueda utilizar dentro de esta clase.
  private editCartaService = inject(EditCartaService);
// Esta variable lo que hace es que cualquier cambio que le hagamos al signal, se guarde automaticamente aqui
  cartaSignal = this.editCartaService.editCartaSignal;

  getCategoryDishes(category: string){
    const categoryDishes = this.cartaSignal().filter(dish => dish.category=== category)
    return categoryDishes
  }
  // El ngOnInit es un hook que lo que hace es pedir la informacion y ejecutarla
  ngOnInit() {
    this.editCartaService.getCarta();
  }
}
