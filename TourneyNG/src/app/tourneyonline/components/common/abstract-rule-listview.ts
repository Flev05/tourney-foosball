import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractListView } from './abstract-listview';
import { Router } from '@angular/router';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

export abstract class AbstractRuleListView extends AbstractListView {

    constructor(protected redirect: string,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location
    ) {
        super(redirect, tourneyService, router, location);
    }

    protected isEquals(m: Meeting, pr1: PlayoffRule, pr2: PlayoffRule): boolean {
        let rule1: string = this.makeRule(pr1);
        let rule2: string = this.makeRule(pr2);

        let b: boolean = m.rule1.fromRound.position.label == rule2;
        b = b && m.rule2.fromRound.position.label == rule1;

        return b;
    }

    protected makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
        if( pr1 == null && pr1 == null) {
            return "";
        }
    
        return this.makeRule(pr1) + " " + this.makeRule(pr2);
    }
    
    protected makeRule(rule: PlayoffRule): string {
        return rule.fromRound.position.label + "." + rule.fromRound.round.label;
    }
}
