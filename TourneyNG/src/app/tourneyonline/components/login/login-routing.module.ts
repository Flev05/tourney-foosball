import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {LoginDetailView} from './login-detailview';
import { ClientLoginListView } from './client-listview';
import { ClientTourneyListView } from './client-tourney-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: LoginDetailView },
			{ path: 'lv', component: ClientLoginListView },
			{ path: 'tourneyLv', component: ClientTourneyListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class LoginRoutingModule {}
