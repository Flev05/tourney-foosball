import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {MatchRoutingModule} from './match-routing.module';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { SliderModule } from 'primeng/slider';
import {OrderListModule} from 'primeng/orderlist';

import {MatchTourneyListView} from './tourney-listview';
import {MatchListView} from './match-listview';
import {MeetingListView} from './meeting-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';

@NgModule({
	imports: [
		CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GrowlModule,
        PanelModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule,
        TableModule,
        OrderListModule,
        DialogModule,
        SliderModule,
		MatchRoutingModule,
	],
	declarations: [
		MatchTourneyListView,
		MeetingListView,
		MatchListView
    ]
    ,providers: [DateFormatPipe] 
})
export class MatchModule {}
