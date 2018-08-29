import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {MatchTourneyListView} from './tourney-listview';
import {MatchListView} from './match-listview';
import {MeetingListView} from './meeting-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', component: MatchTourneyListView },
			{ path: 'meetinglv', component: MeetingListView },
			{ path: 'matchlv', component: MatchListView },
		])
	],
	exports: [
		RouterModule
	]
})
export class MatchRoutingModule {}
