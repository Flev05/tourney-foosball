import { Location } from '@angular/common';

import { TourneyService } from '../../service/tourneyservice';
import { AbstractDetailView } from './abstract-detailview';
import { CountryService } from '../../service/countryservice';

export abstract class AbstractTourneyDetailView extends AbstractDetailView {
    constructor(
        protected tourneyService: TourneyService,
        protected location: Location,
        protected countryService: CountryService
    ) {
        super(tourneyService, location, countryService);
    }
}
