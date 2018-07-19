import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayerTourneyListView} from './tourney-listview';
import {PlayerListView} from './player-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayerTourneyListView },
			{ path: 'lv', component: PlayerListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayerRoutingModule {}
