import {NgModule}     		from '@angular/core';
import {RouterModule} 		from '@angular/router'
import {CalTourneyListView}	from './tourney-listview';
import {CalendarDetailView}	from './calendar-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CalTourneyListView },
			{ path: 'dv', component: CalendarDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
