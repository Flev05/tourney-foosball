import { Location } from '@angular/common';

import { TourneyService } from '../../service/tourneyservice';
import { AbstractDetailView } from './abstract-detailview';

export abstract class AbstractTourneyDetailView extends AbstractDetailView {
    constructor(
        protected tourneyService: TourneyService,
        protected location: Location
    ) {
        super(tourneyService, location);
    }
}
