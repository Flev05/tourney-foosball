import {NgModule}     		from '@angular/core';
import {RouterModule} 		from '@angular/router'
import {CalendarTourneyListView}	from './tourney-listview';
import { CalendarTabListView } from './tab-listview';
import { CalendarEliminatoryListView } from './eliminatory-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CalendarTourneyListView },
			{ path: 'lv', component: CalendarTabListView },
			{ path: 'lv/eliminatories', component: CalendarEliminatoryListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
