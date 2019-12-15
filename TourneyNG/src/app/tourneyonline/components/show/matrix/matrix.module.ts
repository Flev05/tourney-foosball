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

import {MatrixRoutingModule} from './matrix-routing.module';
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

import {MatrixTourneyListView } from './tourney-listview';
import { MatrixDetailView } from './matrix-detailview';
import { TabMatrixListView } from './tab-matrix-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { EliminatoryListView } from './eliminatory-listview';
import { LevelService } from '../../admin/eliminatory/level-service';
import { RoundMatrixListView } from './round-matrix-listview';
import { PlayoffMatrixListView } from './playoff-matrix-listview';
import { MessagesModule } from 'app/components/messages/messages';
import { MessageModule } from 'app/components/message/message';

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
    ,providers: [DateFormatPipe, LevelService] 
})
export class MatrixModule {}
