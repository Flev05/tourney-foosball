import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {StandaloneEliminatoryListView} from './eliminatory-standalone-listview';
import {EliminatoryListView} from './eliminatory-listview';
import {StandaloneEliminatoryDetailView} from './eliminatory-standalone-detailview';
import { EliminatoryDetailView } from './eliminatory-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'levelLv/eliminatoryAutoLv', component: StandaloneEliminatoryListView },
			{ path: 'levelLv/eliminatoryManualLv', component: EliminatoryListView },
			{ path: 'levelLv/eliminatoryLv/autodv', component: StandaloneEliminatoryDetailView },
			{ path: 'levelLv/eliminatoryLv/manualdv', component: EliminatoryDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
