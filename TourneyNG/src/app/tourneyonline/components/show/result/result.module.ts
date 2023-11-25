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
import { CalendarModule } from 'primeng/calendar';

import {ResultRoutingModule} from './result-routing.module';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { SliderModule } from 'primeng/slider';
import { BlockUIModule } from 'primeng/blockui';
import { ResultTourneyListView } from './tourney-listview';
import { RoundResultListView } from './round-result-listview';
import { EliminatoryListView } from './eliminatory-listview';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TabResultListView } from './tab-result-listview';
import { PlayoffResultListView } from './playoff-result-listview';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { TeamTableModule } from 'app/tourneyonline/components/admin/team-table/team-table.module';

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
        ,BlockUIModule
        ,ResultRoutingModule
        ,AccordionModule
        ,PickListModule
        ,MessagesModule
        ,MessageModule
        ,TeamTableModule
    ],
	declarations: [
		 ResultTourneyListView
        ,RoundResultListView
        ,EliminatoryListView
        ,MeetingDetailView
        ,TabResultListView
        ,PlayoffResultListView
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class ResultModule {}
