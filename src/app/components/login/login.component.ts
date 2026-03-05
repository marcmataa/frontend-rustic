import { Component, inject, OnInit, signal } from '@angular/core';
import api from '../../interceptors/axios';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], //FormsModule se necesita para poder usar el ngModel en el HTML y asi poder leer lo que escribes
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
 
private authService = inject(AuthService);
  private router = inject(Router);
 private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  sessionExpired = signal(false);

  ngOnInit() {
    // 6. Escuchamos los parámetros de la URL cuando el componente carga
    this.route.queryParams.subscribe(params => {
      if (params['expired'] === 'true') {
        this.sessionExpired.set(true);
      }
    });
  }
  // El onSubmit sirve para cuando se le da la accion de entrar con el boton
  onLogin() {
    let data = JSON.stringify({
      email: this.email(),
      password: this.password(),
    });
    
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
        const token = response.data.data.token;
        const role = response.data.data.user.role;

        if (token) {
          this.authService.loginSuccess(token, role);
          this.email.set('');
          this.password.set('');

          // Redirige al returnUrl si existe, si no a la home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }
      })
      .catch((error) => {
        console.error('Error en el login:', error);
        alert('Fallo al iniciar sesión');
      });
  }
}
