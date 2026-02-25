// Importaciones
import { FormsModule } from '@angular/forms';
import api from '../../interceptors/axios';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

// COnfiguracion del componente
@Component({
  selector: 'app-register', // Nombre etiquetea html
  imports: [FormsModule], // Importacion de 'FormsModule' para poder capturar cuando el user escribre en el input
  templateUrl: './register.component.html', // Indica donde esta el archivo html
  styleUrl: './register.component.css', // Indica donde esta el archivo css
})
export class RegisterComponent {
  constructor(
    private admin: AdminService,
    private router: Router,
  ) {}

  //Creamos con signals los valores que en el registro el usuario tendra que poner, y gracias a signal ya que son variables reactivas, guardaran el valor siempre que se cambie
  name = signal('');
  surname = signal('');
  email = signal('');
  password = signal('');
  onRegister() {
    // Creamos un json con los valores del signal y despues del .name, usamos los () para obtener el valor actual del signal
    let data = JSON.stringify({
      name: this.name(),
      surname: this.surname(),
      email: this.email(),
      password: this.password(),
    });
    // Configuracion de la peticion
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/user/register',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data, //Aqui adjuntamos el JSON que hemos creado arriba con los datos del usuario
    };
    // Ejecutamos la instancia api, que tenemos en nuestro axios.ts, para que todo pase por el middleware que hemos creado
    api
      .request(config)
      .then((response) => {
        const UserData = response.data;
        const token = UserData.token;
        console.log('Usuario registrado y logueado directamente:', UserData);
        const userRole = UserData.token ? UserData.role : UserData.data.user.role;
        
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token guardado: ', token);
          this.admin.isAdmin.set(userRole==='admin');

          this.name.set('');
          this.surname.set('');
          this.email.set('');
          this.password.set('');
          this.router.navigate(['']);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
