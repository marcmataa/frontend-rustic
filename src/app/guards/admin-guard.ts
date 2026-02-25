import { inject } from '@angular/core'; // Para poder usar servicios aquí dentro
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../services/admin.service'; // <--- Ojo que la ruta sea la tuya

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService); // Inyectamos tu servicio
  const router = inject(Router); // Inyectamos el router por si hay que echar al usuario

  // Comprobamos el Signal que creamos antes
  if (adminService.isAdmin()) {
    return true; // Es admin, adelante
  } else {
    // Si no es admin, lo mandamos al login
    router.navigate(['']); 
    return false; // Bloqueamos el acceso
  }
};