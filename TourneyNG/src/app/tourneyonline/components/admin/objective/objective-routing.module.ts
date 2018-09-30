import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ObjectiveTourneyListView} from './tourney-listview';
import {ObjectiveListView} from './objective-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ObjectiveTourneyListView },
			{ path: 'lv', component: ObjectiveListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ObjectiveRoutingModule {}
