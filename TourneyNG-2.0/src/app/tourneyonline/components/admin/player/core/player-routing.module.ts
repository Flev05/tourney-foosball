import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayerListView} from './player-listview';
import {PlayerDetailView} from './player-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   component: PlayerListView },
			{ path: 'dv', component: PlayerDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayerRoutingModule {}
