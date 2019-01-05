import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ClassificationTourneyListView} from './tourney-listview';
import { ClassificationTabListView } from './tab-listview';
import { ClassificationEliminatoryListView } from './eliminatory-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ClassificationTourneyListView },
			{ path: 'lv', component: ClassificationTabListView },
			{ path: 'lv/eliminatories', component: ClassificationEliminatoryListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ClassificationRoutingModule {}
