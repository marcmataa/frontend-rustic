import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import api from '../../interceptors/axios'

@Component({
  selector: 'app-edit-carta',
  imports: [FormsModule],
  templateUrl: './edit-carta.component.html',
  styleUrl: './edit-carta.component.css',
})
export class EditCartaComponent {
  private cartaService = inject(CartaService)
}
