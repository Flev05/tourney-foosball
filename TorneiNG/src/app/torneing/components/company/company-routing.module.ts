import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {CompanyListView} from './company-listview';
import {CompanyDetailView} from './company-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CompanyListView },
			{ path: 'dv', component: CompanyDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CompanyRoutingModule {}
