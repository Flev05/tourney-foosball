import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from './abstract-listview';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyDb } from 'app/tourneyonline/domain/tourney.db';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { DateFormatPipe } from './date-format-pipe';
 
export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    toggleable: boolean = false;
    tdbs : TourneyDb[] = [];

    cols: any[];
    rows: any[];
    selectedRow: any;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , public router: Router
        , protected location: Location
        , private dateFormatPipe: DateFormatPipe) { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AbstractTourneyListView.ngOnInit()");
        
        this.cols = [
            { field: 'rowNumber',   header: 'N°' },
            { field: 'tourneyName', header: 'Nome' },
            { field: 'datetime',    header: 'Data' }
        ];

        this.loadTourney();
    }

    protected loadTourney() {
        console.log("Entering AbstractTourneyListView.loadTourney()");
        this.tourneyService.loadAllTourneys().subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onComplete());
    }

    onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    onComplete(): any {
        console.log("Entering onComplete()");
        this.tourneys = [];
        for(let tdb of this.tdbs) {
            let t = JSON.parse(tdb.json);
            this.tourneys.push(t);
        }

        this.tourneys = this.filter(this.tourneys);

        this.rows = [];
        for(let i=0;i<this.tourneys.length; i++) {
            let t = this.tourneys[i];
            let dt = this.dateFormatPipe.transform(t.datetime);
            this.rows.push({t:t, rowNumber: i+1, tourneyName: t.tourneyName, datetime: dt});
        }
    }

    protected abstract filter(tourneys: Tourney[]): Tourney[];

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.selectedRow.t;

        this.gotoDetailView();
    }

    protected selectPhaseType(tourneys: Array<Tourney>, pt : PhaseType): Array<Tourney> {
        let tempTourneys = new Array<Tourney>();
        
        for(let t of tourneys) {
            if(this.containsPhase(pt, t.phases)) {
                tempTourneys.push(t);
            }
        }

        return tempTourneys;
    }

    protected purgeEliminatory(tourneys: Array<Tourney>): Array<Tourney> {
        let tempTourneys = new Array<Tourney>();
        
        for(let t of tourneys) {
            if(this.containsPhase(PhaseType.R, t.phases) || this.containsPhase(PhaseType.P, t.phases)) {
                tempTourneys.push(t);
            }
        }

        return tempTourneys;
    }
}
