import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import api from '../../interceptors/axios';
// Importamos AuthService e
import { AuthService } from '../../services/auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // Inyectamos el servicio de auth (que es quien gestiona la sesión)
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  surname = signal('');
  email = signal('');
  password = signal('');

  onRegister() {
    let data = JSON.stringify({
      name: this.name(),
      surname: this.surname(),
      email: this.email(),
      password: this.password(),
    });

    let config = {
      method: 'post',
      url: '/user/register',
      headers: { 'Content-Type': 'application/json' },
      data: data,
    };

    api.request(config)
      .then((response) => {
        const token = response.data.token;
        const role = response.data.role; 

        if (token) {
         
          this.authService.loginSuccess(token, role);
          this.name.set('');
          this.surname.set('');
          this.email.set('');
          this.password.set('');

          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Error en registro:', error);
      });
  }
}