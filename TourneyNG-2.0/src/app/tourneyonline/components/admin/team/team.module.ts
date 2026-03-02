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

import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {TeamDetailView} from './team-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { TeamRoutingModule } from './team-routing.module';
import { TeamTableModule } from '../team-table/team-table.module';
import { PlayerTableModule } from '../player/player-table/player-table.module';
import { TeamListView } from './team-listview';

@NgModule({
    declarations: [
        TeamDetailView
        ,TeamListView
    ],
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
        ,DialogModule
        ,SliderModule
        ,AutoCompleteModule
        ,RadioButtonModule
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,MessagesModule
        ,MessageModule
        ,AccordionModule
        ,PickListModule      
        ,TeamRoutingModule
        ,TeamTableModule
        ,PlayerTableModule
    ],
    providers: [DateFormatPipe]
})
export class TeamModule {}
