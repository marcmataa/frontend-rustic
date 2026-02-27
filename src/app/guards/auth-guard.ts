import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
 const authService = inject (AuthService);
 const router = inject(Router);

//  Lo que hace es que si recibe de auth.service que tiene token le da el valor boolean al router y le deja pasar, sino lo que hace es enviarlo al /login
 if(authService.isLogged()){
  return true;
 } else {
    router.navigate(['/login']); 
  return false;
 }
};
