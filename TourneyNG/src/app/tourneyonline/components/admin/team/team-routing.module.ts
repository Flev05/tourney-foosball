import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TeamListView} from './team-listview';
import {TeamDetailView} from './team-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '',   component: TeamListView },
			{ path: 'dv', component: TeamDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class TeamRoutingModule {}
