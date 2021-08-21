import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AsistenciaComponent } from './asistencia/asistencia.component';

const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'asistencia', component: AsistenciaComponent },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
