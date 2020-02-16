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
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';

export abstract class AbstractTourneyListView extends AbstractListView {

    tourneys: Tourney[];
    toggleable: boolean = false;
    tdbs : TourneyVO[] = [];

    cols: TableCols[] ;
    rows: any[];
    selectedRow: any;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , protected countryService: CountryService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , protected disciplineService: DisciplineService
        , public router: Router
        , protected location: Location
        , protected dateFormatPipe: DateFormatPipe) 
    { 
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        console.log("AbstractTourneyListView.ngOnInit()");
        super.ngOnInit();

        this.cols = [
            { field: 'tourneyName', header: 'Nome' },
            { field: 'location',    header: 'Locazione' }
        ];

        this.tourneyService.loadAllTourneys().subscribe(t => this.onLoadAllTourneysComplete(t), e => this.onError(e) );

        this.playerService.loadAllPlayers(null);
        this.teamService.loadAllTeams(null);
        this.disciplineService.loadAllDisciplines();            
        this.countryService.loadAllCountries();
    }

    onError(e: any): any {
        console.log("Entering onError()" + e);
    }

    protected onLoadAllTourneysComplete(tdbs : TourneyVO[]): any {
        console.log("Entering onLoadAllTourneysComplete()");

        this.tdbs = tdbs;
        this.tourneys = [];

        for(let tvo of this.tdbs) {
            let t: Tourney = {};
            t.id = tvo.id;
            t.tourneyName = tvo.tourneyName;
            t.country = tvo.country;
            t.clientVO = tvo.clientVO;
            this.tourneys.push(t);
        }

        this.tourneys = this.tourneyService.sort(this.tourneys);

        this.tourneys = this.filter(this.tourneys);

        let emptyCountry = {
            id : 0,
            city : "",
            cityCode     : "",
            provinceCode : 0,
            zipCode      : "",
            countryCode  : ""
        };

        this.rows = [];
        for(let i=0;i<this.tourneys.length; i++) {
            let t = this.tourneys[i];
            this.rows.push({id: t.id, tourneyName: t.tourneyName, location: t.country==null ? emptyCountry : t.country.city});
        }
    }

    protected abstract filter(tourneys: Tourney[]): Tourney[];

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
