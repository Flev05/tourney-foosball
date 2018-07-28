import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ClassificationTourneyListView} from './tourney-listview';
import {ClassificationListView} from './classification-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ClassificationTourneyListView },
			{ path: 'lv', component: ClassificationListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ClassificationRoutingModule {}
