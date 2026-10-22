import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { MessageModule } from 'primeng/message';

import {OperatorListView} from './operator-listview';
import {OperatorDetailView} from './operator-detailview';
import { DateFormatPipe } from '../../../components/common/date-format-pipe';
import { OperatorRoutingModule } from './operator-routing.module';
import { OperatorPickList } from './operator-picklist';
import { PickListModule } from 'primeng/picklist';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';
import { OperatorDetailComponent } from './operator-detail.component';

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
        ,OperatorRoutingModule
        ,ToastModule
        ,MessageModule
        ,AccordionModule
        ,PickListModule
    ],
	declarations: [
        OperatorListView,
        OperatorDetailComponent,
        OperatorDetailView,
        OperatorPickList
    ]
    ,providers: [DateFormatPipe]
})
export class OperatorModule {}
