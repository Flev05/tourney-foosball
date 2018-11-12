import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractListView } from './abstract-listview';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
 
export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    toggleable: boolean = false;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location) { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AbstractTourneyListView.ngOnInit()");

        this.loadTourney();
    }

    protected loadTourney() {
        console.log("Entering AbstractTourneyListView.loadTourney()");
        this.tourneyService.loadTourneySmall().subscribe(t => this.tourneys = t, e => this.onError(e), () => this.onComplete());
    }

    onError(e: any): any {
        console.log("Entering onComplete()" + e);
    }

    onComplete(): any {
        console.log("Entering onComplete()");
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.selectedTourney;

        this.gotoDetailView();
    }

    selectPhaseType(pt : PhaseType) {
        let tempTourneys = new Array<Tourney>();
        
        for(let t of this.tourneys) {
            
            if(this.containsPhase(pt, t.phases)) {
                tempTourneys.push(t);
            }
        }

        this.tourneys = tempTourneys;
    }

    purgeEliminatory() {
        let tempTourneys = new Array<Tourney>();
        
        for(let t of this.tourneys) {
            
            if(this.containsPhase(PhaseType.R, t.phases) || this.containsPhase(PhaseType.P, t.phases)) {
                tempTourneys.push(t);
            }
        }

        this.tourneys = tempTourneys;
 
    }
}
