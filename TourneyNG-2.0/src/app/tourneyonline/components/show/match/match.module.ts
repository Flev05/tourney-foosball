import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {MatchRoutingModule} from './match-routing.module';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import {OrderListModule} from 'primeng/orderlist';

import {MatchTourneyListView} from './tourney-listview';
import {MatchListView} from './match-listview';
import {MeetingListView} from './meeting-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { SelectModule } from 'primeng/select';
import { TeamMatchesModule } from './team-matches/team-matches.module';
import { TabsModule } from 'primeng/tabs';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PanelModule,
        SelectModule,
        InputTextModule,
        ButtonModule,
        TabsModule,
        TableModule,
        OrderListModule,
        DialogModule,
        SliderModule,
		MatchRoutingModule,
        TeamMatchesModule
	],
	declarations: [
		MatchTourneyListView,
		MeetingListView,
		MatchListView
    ]
    ,providers: [DateFormatPipe] 
})
export class MatchModule {}
