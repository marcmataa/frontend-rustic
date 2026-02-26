import { Component, signal } from '@angular/core';
import api from '../../interceptors/axios';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule], //FormsModule se necesita para poder usar el ngModel en el HTML y asi poder leer lo que escribes
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // Con el contructor podemos traer la variable AdminService que hemos creado en los services para asi poder usar el isAdmin en la aplicación.
  constructor(
    private admin: AdminService,
    private router: Router,
  ) {}
  email = signal('');
  password = signal('');
  // El onSubmit sirve para cuando se le da la accion de entrar con el boton
  onSubmit() {
    let data = JSON.stringify({
      //Sirve para convertir el objeto en un a cadena de texto en formato JSON
      email: this.email(),
      password: this.password(),
    });
    console.log(data);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'user/login',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    //Se crea la conexion con el back, llevando la config que le hemos dado arriba
    api
      .request(config)
      .then((response) => {
        console.log('Usuario logueado con exito');
        const UserData = response.data;

        console.log('Datos recibidos del Back:', UserData);

        const token = UserData.data.token;
        const userRole = UserData.data.user.role;
        // Si el usuario tiene token decimos que isAdmin es true y almacenamos el token en el localStorage
        if (token) {
          this.admin.isAdmin.set(userRole === 'admin');
          localStorage.setItem('token', token);
          localStorage.setItem('role', userRole);
          console.log('Token guardado: ', token);

          this.email.set('');
          this.password.set('');

          console.log(UserData.data.user.role);
          // El window location lo que hace es que cuando inicies sesion recargue la pagina y la envie a la ruta que le damos, porque si no iciera esa recarga, al entrar con el token false y al loguearte siendo admin, te saltaria un error porque no daria tiempo a cargar
          window.location.href = '/';
        }
      })
      .catch((error) => {
        console.error('Error en el login:', error);
        alert('Fallo al iniciar sesión');
      });
  }
}
