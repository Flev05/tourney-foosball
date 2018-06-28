import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule }  from 'primeng/dialog';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './domain/in-memory-data.service';

import { LoginService } from './service/loginservice';
import { TourneyService } from './service/tourneyservice';
import { ClientService } from './service/clientservice';
import { UserngService } from './service/userngservice';
import { RoleService } from './service/roleservice';
import { CountryService } from './service/countryservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
     BrowserModule
    ,FormsModule
    ,TableModule
    ,OrderListModule
    ,ReactiveFormsModule
    ,AppRoutingModule
    ,HttpClientModule
    ,InputTextModule
    ,DialogModule
    ,ButtonModule
    ,BrowserAnimationsModule
    ,ConfirmDialogModule
    ,HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy }
      , ConfirmationService
      , TourneyService
      , ClientService
      , UserngService
      , RoleService
      , CountryService
      , LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }