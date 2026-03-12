import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import {AccordionModule} from 'primeng/accordion';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SliderModule } from 'primeng/slider';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import {PlayerListView} from './player-listview';
import {PlayerDetailView} from './player-detailview';
import { DateFormatPipe } from '../../../../components/common/date-format-pipe';
import {PlayerRoutingModule} from './player-routing.module';
import { PlayerTableModule } from '../../player/player-table/player-table.module';
import { PlayerChooserModule } from '../../player/player-chooser/player-chooser.module';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
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
        ,DatePickerModule
        ,MessagesModule
        ,MessageModule
        ,PlayerRoutingModule
        ,AccordionModule
        ,PlayerTableModule
        ,PlayerChooserModule
    ],
	declarations: [
        PlayerListView,
        PlayerDetailView
    ]
    ,providers: [DateFormatPipe]
})
export class PlayerModule {}
