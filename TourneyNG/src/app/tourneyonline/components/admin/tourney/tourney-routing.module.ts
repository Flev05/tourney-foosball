import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';
import { TeamPlayerListView } from './team-player-listview';
import { TeamPickList } from './team-picklist';
import { RoundListView } from 'app/tourneyonline/components/admin/round/round-listview';
import { RuleListView } from '../playoff/rule-listview';
import { PlayerDetailView } from 'app/tourneyonline/components/admin/player/core/player-detailview';
import { PlayerPickList } from './player-picklist';
import { TeamDetailView } from 'app/tourneyonline/components/admin/team/team-detailview';
import { NewTourneyDetailView } from './new-tourney-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   			component: TourneyListView },
			{ path: 'dv',   		component: TourneyDetailView },
			{ path: 'newdv',   		component: NewTourneyDetailView },
			{ path: 'dv/team',		component: TeamPlayerListView },
			{ path: 'dv/addteam',	component: TeamPickList },	
			{ path: 'dv/updateteam',component: TeamDetailView },
			{ path: 'dv/round',		component: RoundListView },	
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
