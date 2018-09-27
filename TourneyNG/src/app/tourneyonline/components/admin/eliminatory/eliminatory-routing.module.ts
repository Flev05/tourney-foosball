import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {EliminatoryTourneyListView} from './tourney-listview';
import {EliminatoryListView} from './eliminatory-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: EliminatoryTourneyListView },
			{ path: 'lv', component: EliminatoryListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
