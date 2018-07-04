import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'demo',      loadChildren: './components/demo/demo.module#DemoModule'},
            {path: 'realtime',  loadChildren: './components/realtime/realtime.module#RealtimeModule'},

            // Admin Section
            {path: 'admintourney',   loadChildren: './components/admin/tourney/tourney.module#TourneyModule'},
            {path: 'clients',   loadChildren: './components/admin/client/client.module#ClientModule'},
            {path: 'users',     loadChildren: './components/admin/userng/user.module#UserModule'},
            {path: 'lease',     loadChildren: './components/admin/lease/lease.module#LeaseModule'},

            // Presentation Section
            {path: 'tourney',   loadChildren: './components/tourney/tourney.module#TourneyModule'},
            {path: 'round',     loadChildren: './components/round/round.module#RoundModule'},
            {path: 'login',     loadChildren: './components/login/login.module#LoginModule'},
            {path: 'calendar',  loadChildren: './components/calendar/calendar.module#CalendarModule'},
            {path: 'result',    loadChildren: './components/result/result.module#ResultModule'},
            {path: 'classification', loadChildren: './components/classification/classification.module#ClassificationModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
