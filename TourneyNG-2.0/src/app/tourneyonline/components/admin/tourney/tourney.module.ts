import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import {AccordionModule} from 'primeng/accordion';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { PickListModule } from 'primeng/picklist';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { TourneyRoutingModule} from './tourney-routing.module';
import { TourneyListView} from './tourney-listview';
import { TourneyDetailView} from './tourney-detailview';
import { TeamPlayerListView } from './team-player-listview';
import { TeamPickList } from './team-picklist';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { RoundModule } from 'app/tourneyonline/components/admin/round/round.module';
import { PlayoffModule } from 'app/tourneyonline/components/admin/playoff/playoff.module';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { PlayerModule } from 'app/tourneyonline/components/admin/player/core/player.module';
import { PlayerPickList } from './player-picklist';
import { TeamModule } from 'app/tourneyonline/components/admin/team/team.module';
import { NewTourneyDetailView } from './new-tourney-detailview';
import { TeamTableModule } from 'app/tourneyonline/components/admin/team-table/team-table.module';
import { PlayerChooserModule } from '../player/player-chooser/player-chooser.module';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';


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
        ,PickListModule
        ,ScrollPanelModule
        ,AccordionModule
        ,ToastModule 
        ,MessageModule
        ,BlockUIModule
		,TourneyRoutingModule
		,RoundModule
        ,PlayoffModule
        ,PlayerModule
        ,TeamModule
        ,TeamTableModule
        ,PlayerChooserModule
	],
	declarations: [
        TourneyListView
        ,NewTourneyDetailView
        ,TourneyDetailView
        ,TeamPlayerListView
        ,TeamPickList
        ,PlayerPickList
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class TourneyModule {
}
