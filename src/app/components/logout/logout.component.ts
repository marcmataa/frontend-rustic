import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit{
  public authservice = inject(AuthService)
  ngOnInit(){
    console.log("Sesion cerrada correctamente")
    this.authservice.logout()
  }

}
