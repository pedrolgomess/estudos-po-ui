import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';
import { PoPageDynamicSearchModule } from '@po-ui/ng-templates';
import { PoTableModule } from '@po-ui/ng-components';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SamplePoPageDynamicSearchBasicComponent } from './sample-po-page-dynamic-search-basic/sample-po-page-dynamic-search-basic.component';

@NgModule({
  declarations: [
    AppComponent,
    SamplePoPageDynamicSearchBasicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    PoTableModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    PoPageDynamicSearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
