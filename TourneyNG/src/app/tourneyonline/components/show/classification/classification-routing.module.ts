import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ClassificationTourneyListView} from './tourney-listview';
import { TabListView } from './tab-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ClassificationTourneyListView },
			{ path: 'lv', component: TabListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ClassificationRoutingModule {}
