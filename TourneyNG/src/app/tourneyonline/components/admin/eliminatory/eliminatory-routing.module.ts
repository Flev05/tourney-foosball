import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {EliminatoryTourneyListView} from './tourney-listview';
import {EliminatoryListView} from './eliminatory-listview';
import {AutoEliminatoryDetailView} from './eliminatory-autodetailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: EliminatoryTourneyListView },
			{ path: 'lv', component: EliminatoryListView },
			{ path: 'lv/dv', component: AutoEliminatoryDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
