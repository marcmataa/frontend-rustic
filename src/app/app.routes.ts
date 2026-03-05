import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EditCartaComponent } from './components/edit-carta/edit-carta.component';
import { adminGuard } from './guards/admin-guard';
import { CartaComponent } from './components/carta/carta.component';
import {LogoutComponent} from './components/logout/logout.component'
import { ReservaComponent } from './components/reserva/reserva.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { authGuard } from './guards/auth-guard';
import { AllReservasComponent } from './components/all-reservas/all-reservas.component';
import { InicioComponent } from './components/inicio/inicio.component';

export const routes: Routes = [
    {
        path: '',
        component: InicioComponent  // 👈 la home en la raíz
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'edit-carta',
        component: EditCartaComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'carta',
        component: CartaComponent
    },
    {
        path: 'reserva',
        component: ReservaComponent
    },
    {
        path: 'my-reservation',
        component: MyReservationComponent,
        canActivate: [authGuard]
    },
    {
        path: 'all-reservas',
        component: AllReservasComponent,
        canActivate: [adminGuard]
    },
];
