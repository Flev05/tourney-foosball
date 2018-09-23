import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffTourneyListView} from './tourney-listview';
import {PlayoffListView} from './playoff-listview';
import {PlayoffDetailView} from './playoff-detailview';
import {PlayoffConfigDetailView} from './playoff-config-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayoffTourneyListView },
			{ path: 'lv', component: PlayoffListView },
			{ path: 'lv/dv', component: PlayoffDetailView },
			{ path: 'lv/dv/config', component: PlayoffConfigDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
