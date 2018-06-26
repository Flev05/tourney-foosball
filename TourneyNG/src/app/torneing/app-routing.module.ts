import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'demo',      loadChildren: './components/demo/demo.module#DemoModule'},
            {path: 'lease',     loadChildren: './components/lease/lease.module#LeaseModule'},
            {path: 'realtime',  loadChildren: './components/realtime/realtime.module#RealtimeModule'},
            {path: 'clients',   loadChildren: './components/client/client.module#ClientModule'},
            {path: 'users',     loadChildren: './components/userng/user.module#UserModule'},
            {path: 'tourney',   loadChildren: './components/tourney/tourney.module#TourneyModule'},
            {path: 'login',     loadChildren: './components/login/login.module#LoginModule'},
            {path: 'calendar',  loadChildren: './components/calendar/calendar.module#CalendarModule'},
            {path: 'result',    loadChildren: './components/result/result.module#ResultModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
