import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, CommonModule, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('frontend-rustic');
  isAdminIn(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }
  public authService = inject(AuthService);
  private router = inject(Router);

  // Detecta en que ruta estas en cada momento, si la url tiene all-reservas o edit-carta, cosas que todo son admin devuelve true, sino false
  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.includes('all-reservas') || this.router.url.includes('edit-carta')),
    ),
    { initialValue: false },
  );

  // Funcion click para el gestion de admin
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  menuOpen = false;
// Menu hamburguesa para movil
toggleMenu() {
  this.menuOpen = !this.menuOpen;
}
}
