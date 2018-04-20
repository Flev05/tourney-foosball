import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './login/in-memory-data.service';

import { MenubarDemoModule }  from './menubar/menubardemo.module';

import { AppComponent } from './app.component';

import { LoginComponent }          from './login/login.component';
import { PageNotFoundComponent }   from './not-found.component';

import { AuthGuard }              from './login/auth-guard.service';
import { AuthService }            from './login/auth.service';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        InputTextModule,
        DialogModule,
        ButtonModule,
        BrowserAnimationsModule,
        HttpClientInMemoryWebApiModule.forRoot(
          InMemoryDataService, { dataEncapsulation: false }
        ),
        AppRoutingModule,
        MenubarDemoModule,
        LoginComponent,
        PageNotFoundComponent
    ],
    providers: [
        AuthGuard,
        AuthService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
