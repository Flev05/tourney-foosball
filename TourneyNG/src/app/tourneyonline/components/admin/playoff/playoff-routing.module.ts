import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffTourneyListView} from './tourney-listview';
import {PlayoffListView} from './playoff-listview';
import { PlayoffConfigListView } from './playoff-config-listview';
import { PlayoffConfigDetailView } from './playoff-config-detailview';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingListView } from './meeting-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: PlayoffTourneyListView },
			{ path: 'lv', component: PlayoffListView },
			{ path: 'lv/playoffRoundLv', component: PlayoffConfigListView },
			{ path: 'lv/playoffRoundLv/dv', component: PlayoffConfigDetailView },
			{ path: 'lv/meetingLv', component: MeetingListView },
			{ path: 'lv/meetingLv/dv', component: MeetingDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
