import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundTourneyListView} from './tourney-listview';
import {RoundListView} from './round-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: RoundTourneyListView },
			{ path: 'dv', component: RoundListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
