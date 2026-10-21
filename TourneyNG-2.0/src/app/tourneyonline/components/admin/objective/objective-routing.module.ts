import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ObjectiveListView} from './objective-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'lv', component: ObjectiveListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ObjectiveRoutingModule {}
