import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {EliminatoryTourneyListView} from './tourney-listview';
import {EliminatoryListView} from './eliminatory-listview';
import {AutoEliminatoryDetailView} from './eliminatory-autodetailview';
import { LevelListView } from './level-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: EliminatoryTourneyListView },
			{ path: 'levelLv', component: LevelListView },
			{ path: 'levelLv/eliminatoryLv', component: EliminatoryListView },
			{ path: 'levelLv/eliminatoryLv/dv', component: AutoEliminatoryDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
