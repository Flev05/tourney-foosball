import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffTourneyListView} from './tourney-listview';
import {PlayoffListView} from './playoff-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayoffTourneyListView },
			{ path: 'lv', component: PlayoffListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
