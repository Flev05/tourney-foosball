import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundListView} from './round-listview';
import {RoundDetailView} from './round-detailview';
import { MeetingListView } from './meeting-listview';
import { MeetingDetailView } from './meeting-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'lv', component: RoundListView },
			{ path: 'lv/dv', component: RoundDetailView },
			{ path: 'lv/meetingLv', component: MeetingListView },
			{ path: 'lv/meetingLv/dv', component: MeetingDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
