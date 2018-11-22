import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractListView } from './abstract-listview';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyDb } from 'app/tourneyonline/domain/tourney.db';
 
export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    toggleable: boolean = false;
    tdbs : TourneyDb[] = [];

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
        this.tourneyService.loadAllTourneys().subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onComplete());
    }

    onError(e: any): any {
        console.log("Entering onComplete()" + e);
    }

    onComplete(): any {
        console.log("Entering onComplete()");
        this.tourneys = [];
        for(let tdb of this.tdbs) {
            let t = JSON.parse(tdb.json);
            this.tourneys.push(t);
        }
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
