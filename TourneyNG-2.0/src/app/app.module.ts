import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { InputTextModule }  from 'primeng/inputtext';
import { ButtonModule }  from 'primeng/button';
import { TableModule }  from 'primeng/table';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule }  from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SidebarModule} from 'primeng/sidebar';
import { AppComponent } from './app.component';
import { HomeComponent } from './tourneyonline/components/home/home.component';

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data-service/in-memory-data.service';
 
import { DateFormatModule } from './tourneyonline/components/common/date-format.module';
import { LOCALE_ID } from '@angular/core';
import { TeamModule } from './tourneyonline/components/admin/team/team.module';

const forDevelopEnvOnly: any[] = [];
// if (environment.inMemoryDataService) {
//   forDevelopEnvOnly.push(HttpClientInMemoryWebApiModule.forRoot(
//     InMemoryDataService, { dataEncapsulation: false, apiBase: 'api/' }));
// }

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TableModule,
    OrderListModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SlideMenuModule,
    DateFormatModule,
    DropdownModule,
    SidebarModule,
    TeamModule,
    ...forDevelopEnvOnly
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'it' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }