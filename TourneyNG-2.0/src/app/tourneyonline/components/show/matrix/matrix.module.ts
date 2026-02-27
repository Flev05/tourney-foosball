import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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

import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import {MatrixRoutingModule} from './matrix-routing.module';
import {MatrixTourneyListView } from './tourney-listview';
import { MatrixDetailView } from './eliminatory-matrix-view';
import { TabMatrixListView } from './tab-matrix-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { EliminatoryListView } from './eliminatory-listview';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { RoundMatrixListView } from './round-matrix-listview';
import { PlayoffMatrixListView } from './playoff-matrix-listview';
import { MatrixService } from './matrix-service';

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
        ,AccordionModule
        ,PickListModule
        ,MessagesModule
        ,MessageModule
        ,MatrixRoutingModule
    ],
	declarations: [
		MatrixTourneyListView
        ,TabMatrixListView
        ,MatrixDetailView
        ,RoundMatrixListView
        ,PlayoffMatrixListView
        ,EliminatoryListView
    ]
    ,providers: [DateFormatPipe, LevelService, MatrixService] 
})
export class MatrixModule {}
