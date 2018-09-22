import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {CalendarTourneyListView} from './tourney-listview';
import {CalendarListView} from './calendar-listview';
import {CalendarDetailView} from './calendar-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CalendarTourneyListView },
			{ path: 'lv', component: CalendarListView },
			{ path: 'lv/dv', component: CalendarDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
