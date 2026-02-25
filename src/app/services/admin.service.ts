import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AdminService {
//  Al ser public, se puede cambiar el valor de isAdmin desde cualquier componente.
// Lo que hace el checkAdminStatus es comprobar si ya eramos admins antes de cargar la pantalla
  public isAdmin = signal<boolean>(this.checkAdminStatus());

//  Esta funcion solo se puede usar dentro de este archivo gracias al private
  private checkAdminStatus(): boolean {
    const token = localStorage.getItem('token');
    // Si no hay token en el localStorage, retornas el valor de false ya que no esta logueado el usuario
    if (!token) {
      return false;
    }
    try {
    // Usameos jwtDecode para convertir el token en un objeto legible
      const decoded: any = jwtDecode(token);
      // Compruebas que la decodificacion haya sacado el rol de admin si es asi le das el valor a isAdmin de true
      if(decoded.role === 'admin'){
        return true
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
