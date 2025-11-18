import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoButtonModule, PoListViewModule, PoLoadingModule, PoModalModule, PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule } from '@po-ui/ng-templates';
import { PoTableModule } from '@po-ui/ng-components';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BuscarColaboradoresDinamicamenteComponent } from './buscar-colaboradores-dinamicamente/buscar-colaboradores-dinamicamente.component';
import {ColaboradoresListComponent} from './colaboradores-list/colaboradores-list.component'
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core'; // Importing ProtheusLibCoreModule for Protheus integration
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    BuscarColaboradoresDinamicamenteComponent,
    ColaboradoresListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    PoModule,
    PoModalModule,
    PoButtonModule,
    PoListViewModule,
    PoTableModule,
    PoTableModule,
    PoLoadingModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    PoPageDynamicSearchModule,
    ProtheusLibCoreModule // Importing ProtheusLibCoreModule for Protheus integration
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
