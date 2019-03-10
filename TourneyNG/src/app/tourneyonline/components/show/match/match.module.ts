import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {MatchRoutingModule} from './match-routing.module';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { SliderModule } from 'app/components/slider/slider';
import {OrderListModule} from 'primeng/orderlist';

import {MatchTourneyListView} from './tourney-listview';
import {MatchListView} from './match-listview';
import {MeetingListView} from './meeting-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

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
