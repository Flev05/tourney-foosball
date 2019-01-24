import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import {PlayoffListView} from './playoff-listview';
import { RuleListView } from './rule-listview';
import { RuleDetailView } from './rule-detailview';
import { MeetingRuleDetailView } from './meeting-rule-detailview';
import { MeetingListView } from './meeting-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: 'lv', component: PlayoffListView },
			{ path: 'lv/playoffRuleLv', component: RuleListView },
			{ path: 'lv/playoffRuleLv/dv', component: RuleDetailView },
			{ path: 'lv/meetingLv', component: MeetingListView },
			{ path: 'lv/meetingLv/playoffRuledv', component: MeetingRuleDetailView },
		])
	],
	exports: [
		RouterModule
	]
})
export class PlayoffRoutingModule {}
