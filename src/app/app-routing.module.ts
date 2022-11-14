import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Modulos
import { AuthRoutingModule } from './auth/auth.routing';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [

  {
    path: '',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    component: LayoutComponent,
    /* canActivateChild: [AuthGuard], */
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  },

];



@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    BrowserModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
