import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TourneyListView} from './tourney-listview';
import {TourneyDetailView} from './tourney-detailview';
import { TeamDetailView } from './team-detailview';
import { AddTeamListView } from './add-team-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   			component: TourneyListView },
			{ path: 'dv',   		component: TourneyDetailView },
			{ path: 'dv/team',		component: TeamDetailView },
			{ path: 'dv/addteam',	component: AddTeamListView },	
		])
	],
	exports: [
		RouterModule
	]
})
export class TourneyRoutingModule {}
