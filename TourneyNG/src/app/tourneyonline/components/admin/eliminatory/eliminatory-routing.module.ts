import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {EliminatoryTourneyListView} from './tourney-listview';
import {EliminatoryAutoListView} from './eliminatory-autolistview';
import {EliminatoryManualListView} from './eliminatory-manuallistview';
import {AutoEliminatoryDetailView} from './eliminatory-autodetailview';
import { LevelListView } from './level-listview';
import { ManualEliminatoryDetailView } from './eliminatory-manualdetailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: EliminatoryTourneyListView },
			{ path: 'levelLv', component: LevelListView },
			{ path: 'levelLv/eliminatoryAutoLv', component: EliminatoryAutoListView },
			{ path: 'levelLv/eliminatoryManualLv', component: EliminatoryManualListView },
			{ path: 'levelLv/eliminatoryLv/autodv', component: AutoEliminatoryDetailView },
			{ path: 'levelLv/eliminatoryLv/manualdv', component: ManualEliminatoryDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
