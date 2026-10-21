import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { MessageModule } from 'primeng/message';

import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';

import {ClientRoutingModule} from './client-routing.module';
import {ClientListView} from './client-listview';
import {ClientDetailView} from './client-detailview';
import { SelectModule } from 'primeng/select';
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
        ,FieldsetModule
        ,AccordionModule
        ,ToastModule
        ,MessageModule
        ,ClientRoutingModule
	],
	declarations: [
          ClientListView
        , ClientDetailView
	]
})
export class ClientModule {}
