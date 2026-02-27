import { Component, inject, signal } from '@angular/core';
import api from '../../interceptors/axios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], //FormsModule se necesita para poder usar el ngModel en el HTML y asi poder leer lo que escribes
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
 
private authService = inject(AuthService);
  private router = inject(Router);
 
  email = signal('');
  password = signal('');
  // El onSubmit sirve para cuando se le da la accion de entrar con el boton
  onLogin() {
    let data = JSON.stringify({
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
      

        console.log('Datos recibidos del Back:', response.data);

        const token = response.data.data.token;
        const role = response.data.data.user.role;
        // Si el usuario tiene token decimos que isAdmin es true y almacenamos el token en el localStorage
        if (token) {
     this.authService.loginSuccess(token, role);
          console.log('Token guardado: ', token);
          console.log('Rol: ', role)

          this.email.set('');
          this.password.set('')
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Error en el login:', error);
        alert('Fallo al iniciar sesión');
      });
  }
}
