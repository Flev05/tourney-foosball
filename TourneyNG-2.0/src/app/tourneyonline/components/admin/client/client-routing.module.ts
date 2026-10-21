import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ClientListView} from './client-listview';
import {ClientDetailView} from './client-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ClientListView },
			{ path: 'dv', component: ClientDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ClientRoutingModule {}
