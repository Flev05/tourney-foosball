import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import { TableModule }  from 'primeng/table';
import { DialogModule }  from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import { SliderModule } from 'app/components/slider/slider';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { TabViewModule } from 'app/components/tabview/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import {AutoCompleteModule} from 'primeng/autocomplete';

import {ClientRoutingModule} from './client-routing.module';
import {ClientListView} from './client-listview';
import {ClientDetailView} from './client-detailview';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';

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
        ,FieldsetModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
		,ClientRoutingModule
	],
	declarations: [
          ClientListView
        , ClientDetailView
	]
})
export class ClientModule {}
