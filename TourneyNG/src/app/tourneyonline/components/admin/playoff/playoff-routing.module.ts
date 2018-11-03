import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffTourneyListView} from './tourney-listview';
import {PlayoffListView} from './playoff-listview';
import { PlayoffConfigListView } from './playoff-config-listview';
import { PlayoffConfigDetailView } from './playoff-config-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayoffTourneyListView },
			{ path: 'lv', component: PlayoffListView },
			{ path: 'lv/playoffRoundLv', component: PlayoffConfigListView },
			{ path: 'lv/playoffRoundLv/dv', component: PlayoffConfigDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
