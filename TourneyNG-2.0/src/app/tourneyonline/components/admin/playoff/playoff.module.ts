import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';
import {PickListModule} from 'primeng/picklist';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';

import {PlayoffRoutingModule} from './playoff-routing.module';
import { RuleListView } from './rule-listview';
import { RuleDetailView } from './rule-detailview';
import { MeetingPageListView } from './meeting-page-listview';
import { MeetingRuleDetailView } from './meeting-rule-detailview';
import { DateFormatPipe } from '../../../components/common/date-format-pipe';
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
        ,PlayoffRoutingModule
        ,AccordionModule
        ,PickListModule
        ,MessagesModule
        ,MessageModule
    ],
	declarations: [
        RuleListView
        ,RuleDetailView
        ,MeetingPageListView
        ,MeetingRuleDetailView
    ]
    ,providers: [DateFormatPipe]
})
export class PlayoffModule {}
