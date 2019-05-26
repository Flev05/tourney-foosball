import {NgModule}     from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule}    from '@angular/forms';

import {AutoCompleteModule} from 'primeng/autocomplete';
import {TableModule}  from 'primeng/table';
import {DialogModule}  from 'primeng/dialog';
import {SpinnerModule} from 'primeng/spinner';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {RadioButtonModule} from 'primeng/radiobutton';

import { GrowlModule } from 'app/components/growl/growl';
import { PanelModule } from 'app/components/panel/panel';
import { DropdownModule } from 'app/components/dropdown/dropdown';
import { InputTextModule } from 'app/components/inputtext/inputtext';
import { InputTextareaModule } from 'app/components/inputtextarea/inputtextarea';
import { ButtonModule } from 'app/components/button/button';
import { TabViewModule } from 'app/components/tabview/tabview';
import { CodeHighlighterModule } from 'app/components/codehighlighter/codehighlighter';
import { SliderModule } from 'app/components/slider/slider';
import {AccordionModule} from 'primeng/accordion';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

import {TourneyRoutingModule} from './tourney-routing.module';
import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';
import { CalendarModule } from 'app/components/calendar/calendar';
import { PlayerListView } from './player-listview';
import { PickListModule } from 'app/components/picklist/picklist';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { TeamPickList } from './team-picklist';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { RoundModule } from '../round/round.module';
import { PlayoffModule } from '../playoff/playoff.module';
import { LevelService } from '../eliminatory/level-service';
import { PlayerModule } from '../player/player.module';
import { PlayerPickList } from './player-picklist';
import { TeamModule } from '../team/team.module';
import { NewTourneyDetailView } from './new-tourney-detailview';
import {BlockUIModule} from 'primeng/blockui';

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
        ,PlayerListView
        ,TeamPickList
        ,PlayerPickList
    ]
    ,providers: [DateFormatPipe, LevelService]
})
export class TourneyModule {
}
