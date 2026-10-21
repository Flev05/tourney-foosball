import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import {MessageModule} from 'primeng/message';

import {ResultRoutingModule} from './result-routing.module';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
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
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { ProjectorViewComponent } from 'app/tourneyonline/components/projector/projector-view-component';
import { BracketModule } from 'app/tourneyonline/components/show/bracket/bracket.module';

@NgModule({
	imports: [
		 CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,PanelModule
        ,SelectModule
        ,InputTextModule
        ,ButtonModule
        ,TabsModule 
        ,TableModule
        ,DialogModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,InputNumberModule
        ,FieldsetModule
        ,TooltipModule
        ,DatePickerModule
        ,BlockUIModule
        ,ResultRoutingModule
        ,AccordionModule
        ,PickListModule
        ,ToastModule 
        ,MessageModule
        ,TeamTableModule
        ,BracketModule
    ],
	declarations: [
		 ResultTourneyListView
        ,RoundResultListView
        ,EliminatoryListView
        ,MeetingDetailView
        ,TabResultListView
        ,PlayoffResultListView
        ,ProjectorViewComponent
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class ResultModule {}
