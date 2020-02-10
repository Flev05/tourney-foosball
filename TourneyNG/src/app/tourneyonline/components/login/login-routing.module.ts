import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {LoginDetailView} from './login-detailview';
import { ClientLoginListView } from './client-listview';
import { ClientTourneyListView } from './client-tourney-listview';
import { FollowerDetailView } from './follower-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: LoginDetailView },
			{ path: 'lv', component: ClientLoginListView },
			{ path: 'tourneyLv', component: ClientTourneyListView },
			{ path: 'follower/:first', component: FollowerDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class LoginRoutingModule {}
