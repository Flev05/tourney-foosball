import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundListView} from './round-listview';
import { MeetingListView } from './meeting-page-listview';
import { MeetingDetailView } from './meeting-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'lv/dv', component: RoundListView },
			{ path: 'lv/meetingLv', component: MeetingListView },
			{ path: 'lv/meetingLv/dv', component: MeetingDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
