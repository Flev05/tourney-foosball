import {NgModule}     		from '@angular/core';
import {RouterModule} 		from '@angular/router'
import {TourneyListView}	from './tourney-listview';
import {CalendarDetailView}	from './calendar-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: TourneyListView },
			{ path: 'dv', component: CalendarDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
