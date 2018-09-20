import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TeamTourneyListView} from './tourney-listview';
import {TeamListView} from './team-listview';
import {TeamDetailView} from './team-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TeamTourneyListView },
			{ path: 'lv', component: TeamListView },
			{ path: 'lv/dv', component: TeamDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class TeamRoutingModule {}
