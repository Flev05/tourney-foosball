import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import {ResultRoutingModule} from './result-routing.module';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { SliderModule } from 'app/components/slider/slider';
import { CalendarModule } from 'app/components/calendar/calendar';
 
import {ResultTourneyListView } from './tourney-listview';
import { ResultListView } from './result-listview';
import { EliminatoryListView } from './eliminatory-listview';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from '../../common/date-format-pipe';

@NgModule({
	imports: [
		 CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,GrowlModule
        ,PanelModule
        ,DropdownModule
        ,InputTextModule
        ,InputTextareaModule
        ,ButtonModule
        ,TabViewModule
        ,CodeHighlighterModule
        ,TableModule
        ,DialogModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,ResultRoutingModule
        ,AccordionModule
        ,PickListModule
        ,MessagesModule
        ,MessageModule
    ],
	declarations: [
		 ResultTourneyListView
        ,ResultListView
        ,EliminatoryListView
        ,MeetingDetailView
    ]
    ,providers: [DateFormatPipe]
})
export class ResultModule {}
