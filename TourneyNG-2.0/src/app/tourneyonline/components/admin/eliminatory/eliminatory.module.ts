import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule}  from 'primeng/table';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';

import {EliminatoryRoutingModule} from './eliminatory-routing.module';
import {StandaloneEliminatoryListView} from './eliminatory-standalone-listview';
import {EliminatoryListView} from './eliminatory-listview';
import {StandaloneEliminatoryDetailView} from './eliminatory-standalone-detailview';
import { EliminatoryDetailView } from './eliminatory-detailview';
import { DateFormatPipe } from '../../../components/common/date-format-pipe';
import { LevelService } from './level-service';

@NgModule({
	imports: [
		CommonModule
        ,FormsModule
        ,ReactiveFormsModule
        ,PanelModule
        ,DropdownModule
        ,InputTextModule
        ,InputTextareaModule
        ,ButtonModule
        ,TabViewModule
        ,TableModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,EliminatoryRoutingModule
        ,AccordionModule
        ,PickListModule
        ,DialogModule
        ,MessagesModule
        ,MessageModule
    ],
	declarations: [StandaloneEliminatoryListView
        ,EliminatoryListView
        ,StandaloneEliminatoryDetailView        
        ,EliminatoryDetailView        
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class EliminatoryModule {}
