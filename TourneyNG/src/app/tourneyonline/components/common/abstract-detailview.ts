import { OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';

export abstract class AbstractDetailView implements OnInit {

    protected selectedTourney: Tourney;

    constructor(
        protected tourneyService: TourneyService,
        protected location: Location
    ) {}

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;
    }

    goBack(): void {
        this.location.back();
    }
}
