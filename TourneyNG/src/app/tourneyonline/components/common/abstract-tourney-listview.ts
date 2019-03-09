import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from './abstract-listview';
import { PhaseType } from 'app/tourneyonline/domain/enumerations';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { DateFormatPipe } from './date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { TeamVO } from 'app/tourneyonline/domain/team-vo';
import { Player } from 'app/tourneyonline/domain/player';

export abstract class AbstractTourneyListView extends AbstractListView {

    protected tourneys: Tourney[];
    toggleable: boolean = false;
    tdbs : TourneyVO[] = [];

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

        this.playerService.loadAllPlayers( () => this.onLoadPlayersComplete() );

        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete() );
    }

    private onLoadPlayersComplete(): any {
        console.log("Entering onLoadPlayersComplete()");
        this.playerService.playerPool = [];

        for( let pvo of this.playerService.playerPoolVO ) {
            let ppo: Player = JSON.parse(pvo.json);
            ppo.country = pvo.country;
            ppo.clientVO = pvo.clientVO;
            ppo.playerName = pvo.playerName;

            this.playerService.playerPool.push(ppo);
        }
    }
    private onLoadTeamsComplete(): any {
        console.log("Entering onLoadTeamsComplete()");
        this.teamService.teamPool = [];

        for( let pvo of this.teamService.teamPoolVO ) {
            let ppo: TeamVO = JSON.parse(pvo.json);
            ppo.country = pvo.country;
            ppo.clientVO = pvo.clientVO;
            ppo.teamName = pvo.teamName;

            this.teamService.teamPool.push(ppo);
        }
    }

    onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    protected onComplete(): any {
        console.log("Entering onComplete()");

        this.tourneys = [];

        for(let tvo of this.tdbs) {
            let t: Tourney = JSON.parse(tvo.json);
            t.id = tvo.id;
            t.tourneyName = tvo.tourneyName;
            t.country = tvo.country;
            t.clientVO = tvo.clientVO;
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
