import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ResultTourneyListView} from './tourney-listview';
import {ResultListView} from './result-listview';
import {MeetingListView} from './meeting-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: ResultTourneyListView },
			{ path: 'lv', component: ResultListView },
			{ path: 'lv/meetingLv',     component: MeetingListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class ResultRoutingModule {}
