import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { TorneoService } from './service/torneoservice';
import { CompanyService } from './service/companyservice';
import { UserngService } from './service/userngservice';
import { RoleService } from './service/roleservice';

import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './domain/in-memory-data.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    BrowserAnimationsModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
      , TorneoService
      , CompanyService
      , UserngService
      , RoleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }