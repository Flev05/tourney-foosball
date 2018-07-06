import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {EliminationTourneyListView} from './tourney-listview';
import {EliminationListView} from './elimination-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: EliminationTourneyListView },
			{ path: 'lv', component: EliminationListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminationRoutingModule {}
