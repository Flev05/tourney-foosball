import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ClassificationListView} from './classification-listview';
import {ClassificationDetailView} from './classification-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ClassificationListView },
			{ path: 'dv', component: ClassificationDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ClassificationRoutingModule {}
