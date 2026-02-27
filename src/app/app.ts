import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, CommonModule],
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
}
