import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ResultListView} from './result-listview';
import {ResultDetailView} from './result-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ResultListView },
			{ path: 'dv', component: ResultDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ResultRoutingModule {}
