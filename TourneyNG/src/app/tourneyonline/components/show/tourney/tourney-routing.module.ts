import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import { TourneyResultListView } from './tourney-listview';
import { TourneyDetailView } from './tourney-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', 	component: TourneyResultListView },
			{ path: 'dv',  	component: TourneyDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class TourneyRoutingModule {}
