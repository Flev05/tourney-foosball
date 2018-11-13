import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', component: HomeComponent},
            {path: 'demo',      loadChildren: './components/demo/demo.module#DemoModule'},
            {path: 'realtime',  loadChildren: './components/realtime/realtime.module#RealtimeModule'},

            // Admin Section
            {path: 'admintourney',      loadChildren: './components/admin/tourney/tourney.module#TourneyModule'},
            {path: 'clients',           loadChildren: './components/admin/client/client.module#ClientModule'},
            {path: 'users',             loadChildren: './components/admin/userng/user.module#UserModule'},
            {path: 'lease',             loadChildren: './components/admin/lease/lease.module#LeaseModule'},
            {path: 'adminplayer',       loadChildren: './components/admin/player/player.module#PlayerModule'},
            {path: 'adminteam',         loadChildren: './components/admin/team/team.module#TeamModule'},
            {path: 'adminround',        loadChildren: './components/admin/round/round.module#RoundModule'},
            {path: 'adminplayoff',      loadChildren: './components/admin/playoff/playoff.module#PlayoffModule'},
            {path: 'admineliminatory',  loadChildren: './components/admin/eliminatory/eliminatory.module#EliminatoryModule'},
            {path: 'adminobjective',    loadChildren: './components/admin/objective/objective.module#ObjectiveModule'},
            {path: 'adminmeeting',     loadChildren: './components/admin/meeting/meeting.module#AdminMeetingModule'},
            {path: 'adminresult',     loadChildren: './components/admin/result/result.module#AdminResultModule'},

            // Presentation Section
            {path: 'tourney',   loadChildren: './components/show/tourney/tourney.module#TourneyModule'},
            {path: 'round',     loadChildren: './components/show/round/round.module#RoundModule'},
            {path: 'calendar',  loadChildren: './components/show/calendar/calendar.module#CalendarModule'},
            {path: 'result',    loadChildren: './components/show/result/result.module#ResultModule'},
            {path: 'matrix',     loadChildren: './components/show/matrix/matrix.module#MatrixModule'},
            {path: 'classification',    loadChildren: './components/show/classification/classification.module#ClassificationModule'},
            {path: 'playoff',           loadChildren: './components/show/playoff/playoff.module#PlayoffModule'},
            {path: 'elimination',       loadChildren: './components/show/elimination/elimination.module#EliminationModule'},
            {path: 'team',      loadChildren: './components/show/team/team.module#TeamModule'},
            {path: 'match',     loadChildren: './components/show/match/match.module#MatchModule'},
            {path: 'player',    loadChildren: './components/show/player/player.module#PlayerModule'},

            // Login Section
            {path: 'login',     loadChildren: './components/login/login.module#LoginModule'},
        ])    
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
