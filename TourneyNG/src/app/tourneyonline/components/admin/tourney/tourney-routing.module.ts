import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';
import { PlayerListView } from './player-listview';
import { TeamPickList } from './team-picklist';
import { RoundDetailView } from '../round/round-pickview';
import { RuleListView } from '../playoff/rule-listview';
import { PlayerDetailView } from '../player/player-detailview';
import { PlayerPickList } from './player-picklist';
import { TeamDetailView } from '../team/team-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   			component: TourneyListView },
			{ path: 'dv',   		component: TourneyDetailView },
			{ path: 'dv/team',		component: PlayerListView },
			{ path: 'dv/addteam',	component: TeamPickList },	
			{ path: 'dv/updateteam',component: TeamDetailView },
			{ path: 'dv/round',		component: RoundDetailView },	
			{ path: 'dv/playoff',	component: RuleListView },	
			{ path: 'dv/playerdv',  component: PlayerDetailView },
			{ path: 'dv/playerpl',  component: PlayerPickList },
		])
	],
	exports: [
		RouterModule
	]
})
export class TourneyRoutingModule {}
