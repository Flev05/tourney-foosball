import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule }  from 'primeng/dialog';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AppComponent } from './app.component';
import { HomeComponent } from './tourneyonline/components/home/home.component';
 
import { DateFormatModule } from './tourneyonline/components/common/date-format.module';
import { LOCALE_ID } from '@angular/core';
import { TeamModule } from './tourneyonline/components/admin/team/team.module';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { SelectModule } from 'primeng/select';
import { DrawerModule } from 'primeng/drawer';
import { provideAnimations } from '@angular/platform-browser/animations'; 

const forDevelopEnvOnly: any[] = [];

@NgModule({ declarations: [
        AppComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent]
    , imports: [BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        TableModule,
        OrderListModule,
        InputTextModule,
        DialogModule,
        ButtonModule,
        PanelMenuModule,
        DateFormatModule,
        DrawerModule,
        TeamModule,
        SelectModule,
        ...forDevelopEnvOnly
    ]
    , providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'it' },
        provideHttpClient(withInterceptorsFromDi()),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: Aura
            }
        }),
        provideAnimations()
    ] })
export class AppModule { 
}