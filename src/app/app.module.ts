import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { MantenimientocustodiosComponent } from './components/mantenimientocustodios/mantenimientocustodios.component';
import { CustodiosComponent } from './components/custodios/custodios.component';
import { LoginComponent } from './components/login/login.component';
import { StringDateToDateFormat } from './pipe/stringdatetodateformat.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentosComponent } from './components/documento/documentos/documentos.component';
import { TitularesComponent } from './components/titulares/titulares.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { ComunidadComponent } from './components/comunidad/comunidad.component';

@NgModule({
  declarations: [
    AppComponent,
    MantenimientocustodiosComponent,
    CustodiosComponent,
    LoginComponent,
    StringDateToDateFormat,
    DocumentosComponent,
    TitularesComponent,
    ContratoComponent,
    ComunidadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
