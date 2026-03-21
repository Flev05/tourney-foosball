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
import {PaginatorModule} from 'primeng/paginator';
import {MessageModule} from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { DateFormatPipe } from '../../../components/common/date-format-pipe';

import { MeetingDetailView } from './meeting-detailview';
import {RoundRoutingModule} from './round-routing.module';
import {RoundListView} from './round-listview';
import { MeetingListView } from './meeting-page-listview';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';

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
        ,AccordionModule
        ,PickListModule
        ,ToastModule
        ,MessageModule
        ,RoundRoutingModule 
        ,PaginatorModule
    ]
	,declarations: [RoundListView
        ,MeetingListView
        ,MeetingDetailView
	]
    ,providers: [DateFormatPipe]
})
export class RoundModule {}
