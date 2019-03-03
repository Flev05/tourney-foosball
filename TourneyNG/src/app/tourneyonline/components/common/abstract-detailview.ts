import { Location } from '@angular/common';

import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

export abstract class AbstractDetailView extends AbstractView {

    constructor(
        protected tourneyService: TourneyService,
        protected location: Location,
        protected countryService: CountryService,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.selectedTourney = this.tourneyService.selectedTourney;

        this.countryService.loadCountries().subscribe(c => {
            this.countries = c;
        });
    }

    protected initClassification(r : Round) {
        r.classification = [];
        for(let t of r.teams) {
            let c : Classification = {id:this.tourneyService.getSequenceNumber()
                , team: t
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

}
