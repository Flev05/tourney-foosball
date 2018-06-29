import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundListView} from './round-listview';
import {RoundDetailView} from './round-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: RoundListView },
			{ path: 'dv', component: RoundDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
