import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import { TourneyListView } from './tourney-listview';
import { TourneyDetailView } from './tourney-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TourneyRoutingModule },
			{ path: 'lv',     component: TourneyListView },
			{ path: 'lv/dv',  component: TourneyDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class TourneyRoutingModule {}
