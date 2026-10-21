import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule}  from 'primeng/table';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';

import {EliminatoryRoutingModule} from './eliminatory-routing.module';
import {StandaloneEliminatoryListView} from './eliminatory-standalone-listview';
import {EliminatoryListView} from './eliminatory-listview';
import {StandaloneEliminatoryDetailView} from './eliminatory-standalone-detailview';
import { EliminatoryDetailView } from './eliminatory-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { LevelService } from './level-service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { MessageService } from 'primeng/api';

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
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,InputNumberModule
        ,FieldsetModule
        ,TooltipModule
        ,DatePickerModule
        ,EliminatoryRoutingModule
        ,AccordionModule
        ,PickListModule
        ,DialogModule
        ,ToastModule
        ,MessageModule
    ],
	declarations: [StandaloneEliminatoryListView
        ,EliminatoryListView
        ,StandaloneEliminatoryDetailView        
        ,EliminatoryDetailView        
    ]
    ,providers: [DateFormatPipe
        , LevelService
        , MessageService
    ]
})
export class EliminatoryModule {}
