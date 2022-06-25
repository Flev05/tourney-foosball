import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import {AccordionModule} from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import {TourneyRoutingModule} from './tourney-routing.module';
import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';
import { TeamPlayerListView } from './team-player-listview';
import { TeamPickList } from './team-picklist';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { RoundModule } from 'app/tourneyonline/components/admin/round/round.module';
import { PlayoffModule } from 'app/tourneyonline/components/admin/playoff/playoff.module';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { PlayerModule } from 'app/tourneyonline/components/admin/player/player.module';
import { PlayerPickList } from './player-picklist';
import { TeamModule } from 'app/tourneyonline/components/admin/team/team.module';
import { NewTourneyDetailView } from './new-tourney-detailview';

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
        ,CheckboxModule
        ,SpinnerModule
        ,FieldsetModule
        ,TooltipModule
        ,CalendarModule
        ,PickListModule
        ,ScrollPanelModule
        ,AccordionModule
        ,MessagesModule
        ,MessageModule
        ,BlockUIModule
		,TourneyRoutingModule
		,RoundModule
        ,PlayoffModule
        ,PlayerModule
        ,TeamModule
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
