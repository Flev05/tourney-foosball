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

import { DateFormatPipe } from '../../common/date-format-pipe';
import { TourneyRoutingModule } from './tourney-routing.module';
import { TourneyResultListView } from './tourney-listview';
import { TourneyDetailView } from './tourney-detailview';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

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
        ,TourneyRoutingModule
        ,AccordionModule
        ,PickListModule
    ],
	declarations: [
		TourneyResultListView
        ,TourneyDetailView
    ]
    ,providers: [DateFormatPipe] 
})
export class TourneyModule {}
