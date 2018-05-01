import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Torneo } from '../../domain/torneo';
import { TorneoService } from '../../service/torneoservice';

@Component({
    templateUrl: './tornei-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
  `]
})
export class TorneiDetailView implements OnInit {

    selectedTorneo: Torneo;

    constructor(
        private route: ActivatedRoute,
        private torneoService: TorneoService,
        private location: Location
    ) {}

    ngOnInit() {

        this.getTorneo();
    }

    getTorneo(): void {
        this.selectedTorneo = this.torneoService.selectedTorneo;
    }

    save(): void {
        if(this.torneoService.newTorneo) {
            this.torneoService.addTorneo(this.selectedTorneo).subscribe(() => this.goBack());  
        } else  {
            this.torneoService.updateTorneo(this.selectedTorneo).subscribe(() => this.goBack());
        }
    }

    delete() {
        this.torneoService.deleteTorneo(this.selectedTorneo)
          .subscribe(() => this.goBack());
    }

    goBack(): void {
        this.location.back();
    }
}
