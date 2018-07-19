import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TeamTourneyListView} from './tourney-listview';
import {TeamListView} from './team-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TeamTourneyListView },
			{ path: 'lv', component: TeamListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class TeamRoutingModule {}
