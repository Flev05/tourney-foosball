import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
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
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@NgModule({
	imports: [

		CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,PanelModule
        ,SelectModule
        ,InputTextModule
        ,ButtonModule
        ,TabViewModule
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
