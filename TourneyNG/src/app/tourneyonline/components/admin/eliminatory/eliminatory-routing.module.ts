import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {StandaloneEliminatoryListView} from './eliminatory-standalone-listview';
import {FullEliminatoryListView} from './eliminatory-full-listview';
import {StandaloneEliminatoryDetailView} from './eliminatory-standalone-detailview';
import { FullEliminatoryDetailView } from './eliminatory-full-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'levelLv/eliminatoryAutoLv', component: StandaloneEliminatoryListView },
			{ path: 'levelLv/eliminatoryManualLv', component: FullEliminatoryListView },
			{ path: 'levelLv/eliminatoryLv/autodv', component: StandaloneEliminatoryDetailView },
			{ path: 'levelLv/eliminatoryLv/manualdv', component: FullEliminatoryDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class EliminatoryRoutingModule {}
