import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { CursosListComponent } from './Components/cursos/cursos-list/cursos-list.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AuthGuard } from './Guards/auth.guard';
import { CursoFormComponent } from './Components/cursos/curso-form/curso-form.component';
import { TemaFormComponent } from './Components/tema-form/tema-form.component';
import { SubtemaFormComponent } from './Components/subtema-form/subtema-form.component';
import { CursoViewComponent } from './Components/cursos/curso-view/curso-view.component';

const routes: Routes = [

  {
    path: 'register',
    component: RegisterComponent
  },{
    path: 'home',
    component: HomeComponent
  },{
    path: '',
    component: HomeComponent
  },{
    path: 'login',
    component: LoginComponent
  },{
    path: 'cursos',
    component: CursosListComponent
  },{
    path: 'categorias/:id',
    component: CursosListComponent
  },{
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },{
    path: 'curso',
    component: CursoFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'cursos/:id',
    component: CursoFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'cursos/:id/tema',
    component: TemaFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'cursos/:id/:id2',
    component: TemaFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'cursos/:id/:id2/subtema',
    component: SubtemaFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'cursos/:id/:id2/:id3',
    component: SubtemaFormComponent,
    canActivate: [AuthGuard]
  },{
    path: 'curso/:id',
    component: CursoViewComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
