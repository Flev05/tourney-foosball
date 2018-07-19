import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {MatchTourneyListView} from './tourney-listview';
import {MatchListView} from './match-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: MatchTourneyListView },
			{ path: 'lv', component: MatchListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class MatchRoutingModule {}
