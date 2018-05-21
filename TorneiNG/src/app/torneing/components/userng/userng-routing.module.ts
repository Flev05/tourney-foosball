import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {UserngListView} from './userng-listview';
import {UserngDetailView} from './userng-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: UserngListView },
			{ path: 'dv', component: UserngDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class UserngRoutingModule {}
