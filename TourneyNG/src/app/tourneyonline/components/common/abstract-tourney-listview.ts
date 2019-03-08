import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from './abstract-listview';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyDb } from 'app/tourneyonline/domain/tourney.db';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from './date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';

const homePage: string = "/";

export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    toggleable: boolean = false;
    tdbs : TourneyDb[] = [];

    cols: TableCols[] ;
    rows: any[];
    selectedRow: any;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , protected location: Location
        , private dateFormatPipe: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AbstractTourneyListView.ngOnInit()");
        super.ngOnInit();

        this.cols = [
            { field: 'tourneyName', header: 'Nome' },
            { field: 'datetime',    header: 'Data' }
        ];

        this.tourneyService.loadAllTourneys().subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onComplete());

        this.playerService.loadAllPlayers().subscribe(p => this.playerService.playerPool = p);

        this.teamService.loadAllTeams().subscribe(t => this.teamService.teamPool = t);
    }

    onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    protected onComplete(): any {
        console.log("Entering onComplete()");

        this.tourneys = [];

        for(let tdb of this.tdbs) {
            let t = JSON.parse(tdb.json);
            t.id = tdb.id;
            this.tourneys.push(t);
        }

        this.tourneys = this.filter(this.tourneys);
        if( this.tourneys.length > 0 ) {
            this.selectedTourney = this.tourneys[0];
            this.selectedTourney.meetingsForDelete = [];
        }

        this.rows = [];
        for(let i=0;i<this.tourneys.length; i++) {
            let t = this.tourneys[i];
            let dt = this.dateFormatPipe.transform(t.datetime);
            this.rows.push({t:t, tourneyName: t.tourneyName, datetime: dt});
        }

        // if( this.tourneys.length == 0 ) {
        //     this.router.navigate([homePage]);
        //     return;
        // }
    }

    protected abstract filter(tourneys: Tourney[]): Tourney[];

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedTourney = this.selectedRow.t;
        this.tourneyService.newTourney = false;

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
