import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {TorneiListView} from './tornei-listview';
import {TorneiDetailView} from './tornei-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TorneiListView },
			{ path: 'dv', component: TorneiDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ConfigurationRoutingModule {}
