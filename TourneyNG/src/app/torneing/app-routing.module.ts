import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'demo',     loadChildren: './components/demo/demo.module#DemoModule'},
            {path: 'lease',    loadChildren: './components/lease/lease.module#LeaseModule'},
            {path: 'realtime', loadChildren: './components/realtime/realtime.module#RealtimeModule'},
            {path: 'clients',   loadChildren: './components/client/client.module#ClientModule'},
            {path: 'users',   loadChildren: './components/userng/userng.module#UserngModule'},
            {path: 'tourney',  loadChildren: './components/tourney/tourney.module#TourneyModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
