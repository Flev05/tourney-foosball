import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router'
import { RuleListView } from './rule-listview';
import { RuleDetailView } from './rule-detailview';
import { MeetingRuleDetailView } from './meeting-rule-detailview';
import { MeetingListView } from './meeting-page-listview';

@NgModule({
	imports: [
		RouterModule.forChild([
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
