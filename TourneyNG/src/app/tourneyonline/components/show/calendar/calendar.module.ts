import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';

import {CalendarRoutingModule} from './calendar-routing.module';
import { SliderModule } from 'app/components/slider/slider';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';

import {CalendarTourneyListView} from './tourney-listview';
import { CalendarTabListView } from './tab-listview';
import {OrderListModule} from 'primeng/orderlist';
import { CalendarEliminatoryListView } from './eliminatory-listview';
import { AccordionModule } from 'app/components/accordion/accordion';
import { MessagesModule } from 'app/components/messages/messages';
import { MessageModule } from 'app/components/message/message';
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
        SliderModule
        ,CalendarRoutingModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
	],
	declarations: [
         CalendarTourneyListView
        ,CalendarEliminatoryListView
        ,CalendarTabListView
    ]
    ,providers: [DateFormatPipe]        
})
export class CalendarModule {}
