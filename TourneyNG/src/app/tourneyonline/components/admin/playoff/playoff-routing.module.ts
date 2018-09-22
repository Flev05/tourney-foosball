import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffTourneyListView} from './tourney-listview';
import {PlayoffListView} from './playoff-listview';
import {PlayoffDetailView} from './playoff-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayoffTourneyListView },
			{ path: 'lv', component: PlayoffListView },
			{ path: 'lv/dv', component: PlayoffDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
