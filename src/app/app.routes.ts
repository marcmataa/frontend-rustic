import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EditCartaComponent } from './components/edit-carta/edit-carta.component';
import { adminGuard } from './guards/admin-guard';
import { CartaComponent } from './components/carta/carta.component';
import {LogoutComponent} from './components/logout/logout.component'

export const routes: Routes = [
    {
        path: '',
        children: [
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
                canActivate: [adminGuard] // esto lo que hace es que gracias al AdminService, poder hacer que solo tengas acceso si tienes el rol de admin.
            },
            {
                path: 'carta',
                component: CartaComponent
            }
        ]
    }
];
