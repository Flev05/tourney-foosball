import { Location } from '@angular/common';

import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';

export abstract class AbstractDetailView extends AbstractView {

    blockedDocument: boolean = false;

    constructor(
        protected tourneyService: TourneyService,
        protected location: Location,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected initClassification(r : Round) {
        r.classification = [];
        for(let t of r.teamNames) {
            let c : Classification = {id: this.tourneyService.getSequenceNumber()
                , teamName: t
                , points: 0
                , played: 0
                , won: 0
                , lost: 0
                , penalty: 0
                , goalsDone: 0
                , goalsConceded: 0
                , goalsDiff: 0
            };
            r.classification.push(c);
        }
    }

    onError(e:any) {
        console.log("onError()");
        console.log(e);
    }

    protected unBlockDocument(): void {
        this.blockedDocument = false;
    }
}
