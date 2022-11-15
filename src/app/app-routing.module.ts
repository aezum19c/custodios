import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaPublicaComponent } from './components/consulta-publica/consulta-publica.component';
import { CustodiosComponent } from './components/custodios/custodios.component';
import { LoginComponent } from './components/login/login.component';
import { MantenimientocustodiosComponent } from './components/mantenimientocustodios/mantenimientocustodios.component';
import { TitularesComponent } from './components/titulares/titulares.component';

const routes: Routes = [
  { path:'login', component:LoginComponent},
  { path:'custodios', component:CustodiosComponent},
  { path:'titulares/:id', component:TitularesComponent},
  { path:'mantenimientocustodios/:id', component:MantenimientocustodiosComponent},
  { path:'consulta-publica', component:ConsultaPublicaComponent},
  { path:'**', redirectTo:'login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
