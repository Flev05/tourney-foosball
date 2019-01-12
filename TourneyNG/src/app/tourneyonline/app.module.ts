import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule }  from 'primeng/dialog';

import { LoginService } from './service/loginservice';
import { TourneyService } from './service/tourneyservice';
import { ClientService } from './service/clientservice';
import { UserngService } from './service/userngservice';
import { RoleService } from './service/roleservice';
import { CountryService } from './service/countryservice';
import { InMemoryDataService } from 'app/tourneyonline/in-memory-data-service/in-memory-data.service';
import { PlayerService } from './service/playerService';
import { TeamService } from './service/teamService';

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
    
    ,  HttpClientInMemoryWebApiModule.forRoot(
        InMemoryDataService, { dataEncapsulation: false, apiBase: 'api/' }
      )
  ],
  providers: [
       { provide: LocationStrategy, useClass: HashLocationStrategy }
      , TourneyService
      , ClientService
      , UserngService
      , RoleService
      , CountryService
      , LoginService
      , PlayerService
      , TeamService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }