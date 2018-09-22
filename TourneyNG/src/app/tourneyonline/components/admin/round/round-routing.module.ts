import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundTourneyListView} from './tourney-listview';
import {RoundListView} from './round-listview';
import {RoundDetailView} from './round-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: RoundTourneyListView },
			{ path: 'lv', component: RoundListView },
			{ path: 'lv/dv', component: RoundDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
