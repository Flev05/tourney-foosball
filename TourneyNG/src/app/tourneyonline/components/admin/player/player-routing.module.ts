import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayerTourneyListView} from './tourney-listview';
import {PlayerListView} from './player-listview';
import {PlayerDetailView} from './player-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayerTourneyListView },
			{ path: 'lv', component: PlayerListView },
			{ path: 'dv', component: PlayerDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayerRoutingModule {}
