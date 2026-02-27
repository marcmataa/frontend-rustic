import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private checkLogginStatus(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    } else {
      return true;
    }
  }
  // Le da el valor que retorne el checkLogginStatus yal tener un signal se cambiara automaticamente donde se este usando.
  private isLoggedSignal = signal<boolean>(this.checkLogginStatus());

  // Al ser publico se puede leer el valor desde cualquier sitio, y con el asReadonly, lo que se hace es que se pueda ver, pero no modificar el valor.
  public isLogged = this.isLoggedSignal.asReadonly();

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedSignal.set(false);
    this.router.navigate(['/']);
  }
}
