import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {CalendarListView} from './calendar-listview';
import {CalendarDetailView} from './calendar-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CalendarListView },
			{ path: 'dv', component: CalendarDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
