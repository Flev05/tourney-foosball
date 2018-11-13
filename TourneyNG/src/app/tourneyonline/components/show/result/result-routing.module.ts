import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ResultTourneyListView} from './tourney-listview';
import {ResultListView} from './result-listview';
import {MeetingListView} from './meeting-listview';
import { EliminatoryListView } from './eliminatory-listview';
import { MeetingDetailView } from './meeting-detailview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ResultTourneyListView },
			{ path: 'lv', component: ResultListView },
			{ path: 'lv/eliminatoryLv/dv', component: EliminatoryListView },
			{ path: 'lv/meetingLv',     component: MeetingListView },
			{ path: 'lv/meetingLv/dv',  component: MeetingDetailView },			
		])
	],
	exports: [
		RouterModule
	]
})
export class ResultRoutingModule {}
