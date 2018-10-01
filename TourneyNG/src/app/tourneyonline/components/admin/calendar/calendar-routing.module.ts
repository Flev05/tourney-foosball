import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {CalendarTourneyListView} from './tourney-listview';
import {CalendarListView} from './calendar-listview';
import {MeetingDetailView} from './meeting-detailview';
import { MeetingListView } from './meeting-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: CalendarTourneyListView },
			{ path: 'lv', component: CalendarListView },
			{ path: 'lv/meetingLv',     component: MeetingListView },
			{ path: 'lv/meetingLv/dv',  component: MeetingDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class CalendarRoutingModule {}
