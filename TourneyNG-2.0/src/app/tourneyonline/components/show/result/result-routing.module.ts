import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {ResultTourneyListView} from './tourney-listview';
import {RoundResultListView} from './round-result-listview';
import { EliminatoryListView } from './eliminatory-listview';
import { MeetingDetailView } from './meeting-detailview';
import { TabResultListView } from './tab-result-listview';
import { PlayoffResultListView } from './playoff-result-listview';
import { ProjectorViewComponent } from '../../projector/projector-view-component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: '', 					component: ResultTourneyListView },
			{ path: 'lv', 					component: TabResultListView },
			{ path: 'lv/round', 			component: RoundResultListView },
			{ path: 'lv/playoff', 			component: PlayoffResultListView },
			{ path: 'lv/eliminatoryLv/dv', 	component: EliminatoryListView },
			{ path: 'lv/meetingLv/dv',  	component: MeetingDetailView },		
			{ path: 'projector', 			component: ProjectorViewComponent }	
		])
	],
	exports: [
		RouterModule
	]
})
export class ResultRoutingModule {}
