import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';

@Component({
    templateUrl: './tourney-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class TourneyDetailView implements OnInit {

    selectedTourney: Tourney;

    constructor(
        private route: ActivatedRoute,
        private tourneyService: TourneyService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getTourney();
    }

    getTourney(): void {
        this.selectedTourney = this.tourneyService.selectedTourney;
    }

    save(): void {
        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(() => this.goBack());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.tourneyService.deleteTourney(this.selectedTourney)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
