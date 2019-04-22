import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {RoundPickList} from './round-pickview';
import { MeetingListView } from './meeting-listview';
import { MeetingDetailView } from './meeting-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'lv/dv', component: RoundPickList },
			{ path: 'lv/meetingLv', component: MeetingListView },
			{ path: 'lv/meetingLv/dv', component: MeetingDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class RoundRoutingModule {}
