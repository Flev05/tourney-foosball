import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { Round } from '../domain/round';
import { Playoff } from '../domain/playoff';
import { Team } from '../domain/team';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { PlayoffRule } from '../domain/playoff-rule';
import { Meeting } from '../domain/meeting';
import { LoginService } from './login-service';
import { TourneyVO } from '../domain/tourney.vo';
import { ClientService } from './client-service';
import { TableCols } from '../domain/table-cols';
import { Classification } from '../domain/classification';
import { MeetingStatus } from '../domain/enumerations';
import { MeetingService } from './meeting-service';
import { AbstractService } from '../components/common/abstract-service';
import { ClientVO } from '../domain/client-vo';
import { MeetingDb } from '../domain/meeting-db';
import { UserVO } from '../domain/user-vo';
import { OperatorsVO } from '../domain/operators-vo';
import { PlayoffVO } from '../domain/playoff-vo';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const tourneyUrl = 'api/tourneys';  
const loadTourneyByClientIdUrl  = tourneyUrl + '/loadByClientUserId';  
const loadTourneyBySessionIdUrl = tourneyUrl + '/loadBySessionId';  
const loadTourneyByIdUrl        = tourneyUrl + '/loadTourneyById';  
const loadTourneyByUsernameUrl  = tourneyUrl + '/loadTourneyByFollowerName';  

const insertTourneyUrl = tourneyUrl + '/insert';

const updateTourneyUrl = tourneyUrl + '/update';
const updateTourneyDeleteRoundMeetingsUrl = tourneyUrl + '/updateTourneyDeleteRoundMeetings';
const updateTourneyDeleteAllMeetingsUrl = tourneyUrl + "/updateTourneyDeleteAllMeetings";
const updateTourneyRoundsUrl = tourneyUrl + "/updateTourneyRounds";
const updateTourneyPlayoffsUrl = tourneyUrl + "/updateTourneyPlayoffs";
const updateTourneyPlayoutsUrl = tourneyUrl + "/updateTourneyPlayouts";
const updateTourneyEliminatoriesUrl = tourneyUrl + "/updateTourneyEliminatories";
const updateTourneyEliminatoriesBUrl = tourneyUrl + "/updateTourneyEliminatoriesB";

const deleteTourneyUrl = tourneyUrl + '/delete';

const classificationLabel = "°";

@Injectable()
export class TourneyService extends AbstractService {
    public FIRST_COMBO_ITEM: Combobox =  { label: "Seleziona", value: 0 };

    tourneys: Tourney[];

    positionsCombobox: Combobox[];
    roundsCombobox: Combobox[];
    playoffsCombobox: Combobox[];

    selectedTourney : Tourney;
    eliminatoryTabName: string;

    selectedRound : Round;
    selectedPlayoff : Playoff;
    selectedPlayout : Playoff;
    selectedEliminatory : Eliminatory;
    selectedEliminatoryLevel: EliminatoryLevel;

    newTourney : boolean = false;
    newRound : boolean = false;
    
    newPlayoffConfig : boolean = false;

    firstTime : boolean = true;
    selectedResultTabIndex: number = 0; 
    selectedTabIndex: number = 0; 
    private sequenceNumber: number = 1000;
    playoffsConfig: boolean;

    originalTeams: Team[];
    // operators: UserVO[];
    selectedOperator: UserVO;
    operatorVo : OperatorsVO;
    isOneway: boolean;
    selectedPlayoffConfig: PlayoffRule;
    newRule: boolean;
    selectedRoundTabIndex: number = 0;
    selectedPlayoffTabIndex: number = 0;
    selectedEliminatoryTabIndex: number = 0;
    selectedEliminatoryBTabIndex: number = 0;
    selectedEliminatoryLevelIndex: number = 0;
    selectedEliminatoryBLevelIndex: number = 0;
    selectedEliminatoryIndex: number = 0;
    selectedEliminatoryLevelBIndex: number = 0;
    selectedEliminatoryBIndex: number = 0;
    selectedClassificationRow: Classification;

    static roundCols: TableCols[] = [
        { field: 'name',        header: 'Gironi' },
        { field: 'teamNo',      header: 'N° Squadre' },
        { field: 'teamNames',   header: 'Squadre' },
    ];

    static playoffCols: TableCols[] = [
        { field: 'playoffName', header: 'Playoff' },
        { field: 'teamNo',      header: 'N° Squadre' },
        { field: 'teamNames',   header: 'Squadre' },
    ];
    redirect: string;

    classificationCols: TableCols[] = [
        { field: 'teamName',      header: 'Team', style: 'team'},
        { field: 'points',        header: 'Pt.',  style: 'points'},
        { field: 'played',        header: 'G',    style: 'points'},
        // { field: 'won',           header: 'V'},
        // { field: 'lost',          header: 'P'},
        // { field: 'balanced',      header: 'N'},
        // { field: 'goalsDone',     header: 'Gf'},
        // { field: 'goalsConceded', header: 'Gs'},
        // { field: 'goalsDiff',     header: 'D'},
    ];

    classificationReducedCols: TableCols[] = [
        { field: 'teamName',      header: 'Team', style: 'team'},
        { field: 'points',        header: 'Pt.',  style: 'points'},
        { field: 'played',        header: 'G',    style: 'points'},
    ];

    eliminatoryClassificationCols: TableCols[] = [
        { field: 'roundName',   header: 'E°',  style: 'position'}
    ];

    resultCols: TableCols[] = [
        { field: 'teamName1',   header: 'In casa' },
        { field: 'points1',     header: 'Pt.1' },
        { field: 'points2',     header: 'Pt.2' },
        { field: 'teamName2',   header: 'Trasferta' },
    ];
    operatorCols:  TableCols[] = [
        { field: 'username',  header: 'Username' },
        { field: 'firstname', header: 'Nome' },
        { field: 'lastname',  header: 'Cognome' },
    ];
    
    private tvo: TourneyVO;

    private onSaveTourneyError: boolean;
    private onewayPlayoffMap: Map<string, Meeting[]>;
    private roundtripPlayoffMap: Map<string, Meeting[]>;
    classificationName: string;
    // selectedRoundName: string;

    constructor(private http: HttpClient
        , private loginService: LoginService
        , private clientService: ClientService
        , private meetingService: MeetingService) 
    { 
        super();
        console.log("Constructor of TourneyService");
        this.sequenceNumber++;
    }
    
    prepareEliminatoriesComboBoxes(teamsNo : number): Combobox[] {
        if(this.selectedEliminatoryLevel==undefined) {
            this.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[0];
        }

        let min: number = 2;
    
        let eliminatoryTeamsCombobox: Combobox[] = [];

        eliminatoryTeamsCombobox.push(this.FIRST_COMBO_ITEM);
        
        for(let i=min; i<=teamsNo; i++) {
            eliminatoryTeamsCombobox.push({label: "" + i, value: i});
        }

        return eliminatoryTeamsCombobox;
    }

    prepareDefaultComboBoxes(): number {
        if(this.selectedTourney.roundVO.rounds.length==0 && this.selectedTourney.teams.length==0) {
            return;
        }

        if(this.selectedEliminatoryLevel==undefined) {
            this.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[0];
        }

        let min: number = 2;

        let teamsNo = this.selectedTourney.roundVO.rounds.length;
        if( this.selectedTourney.roundVO.rounds.length == 0 ) {
            teamsNo = this.selectedTourney.teams.length;
        } else {
            teamsNo = 0;
            for( let r of this.selectedTourney.roundVO.rounds ){
                teamsNo += r.teamNames.length;
            }
        }

        let max: number = this.selectedTourney.teams.length;
    
        let eliminatoryTeamsCombobox: Combobox[] = [];

        eliminatoryTeamsCombobox.push(this.FIRST_COMBO_ITEM);
        
        for(let i=min; i<=max; i++) {
            eliminatoryTeamsCombobox.push({label: "" + i, value: i});
        }
        
        this.roundsCombobox = [];
        this.roundsCombobox.push({label: "", value: 0});
            
        for(let i=0; i<this.selectedTourney.roundVO.rounds.length; i++) {
            let r=this.selectedTourney.roundVO.rounds[i];
            this.roundsCombobox.push({label: r.name, value: r.id});
        }

        if(this.selectedTourney.playoffVO.playoffs.length > 0) {
            this.playoffsCombobox = [];
            this.playoffsCombobox.push({label: "", value: 0});
            for(let i=0; i<this.selectedTourney.playoffVO.playoffs.length; i++) {
                let r=this.selectedTourney.playoffVO.playoffs[i];
                this.playoffsCombobox.push({label: r.round.name, value: r.round.id});
            }
        }

        this.positionsCombobox = [{label: "", value: 0}];
        if(this.selectedTourney.roundVO.rounds.length > 0) {
            let maxPosition = this.selectedTourney.teams.length / this.selectedTourney.roundVO.rounds.length;
            if(this.selectedTourney.teams.length % this.selectedTourney.roundVO.rounds.length > 0) {
                maxPosition++;
            }
            for(let p=1; p<=maxPosition; p++ ) {
                let vv: string = "" + p + classificationLabel;
                this.positionsCombobox.push({label: vv, value: p});
            }                    
        }

        if(this.selectedTourney.selectedEliminatoryTeamsCB == undefined) {
            this.selectedTourney.selectedEliminatoryTeamsCB = eliminatoryTeamsCombobox[0];
        }

        return teamsNo;
    }

    power2Padding(length: number): number {
        let levelNo = Math.ceil(Math.log2(length));
        let min = Math.pow(2, levelNo);

        return min;
    }

    public getSequenceNumber() {
        return this.sequenceNumber++;
    }

    sort( tourneys: Tourney[] ): Tourney[] {
        let sortedTourneys = tourneys.sort((r1,r2) => {
            if(r1.tourneyName < r2.tourneyName) {
                return -1;
            }
            if(r1.tourneyName > r2.tourneyName) {
                return 1;
            }
            return 0;
        });
         
        return sortedTourneys;
    }
    /**
     * Loads all tourneys published from the database belonging to the same client
     */
    loadAllTourneys(error: (em: any) => any): Observable<TourneyVO[]> {
        let url = loadTourneyBySessionIdUrl;

        if(this.loginService.isUserLogged) {
            url = loadTourneyByClientIdUrl + "/" + this.clientService.selectedClient.id + "/" + this.loginService.userLogged.id
        }
        
        return this.http.get<TourneyVO[]>(url).pipe(
            tap(_ => this.log('fetched all tourneys from DB, url=' + url)),
            catchError(error('loadTourneyDb'))
          );
    }

    /**
     * Loads the tourney selected by its id previously loaded from the list view
     */
    loadTourneyById(tourneyId : number, complete: () => void, error: (em: any) => any ): void {
        let url = loadTourneyByIdUrl + "/" + tourneyId
        console.log("loadTourneyById(): " + url);

        const obs = this.http.get<TourneyVO>(url).pipe(
            tap(_ => this.log('fetched tourney from DB by url=' + url)), 
            catchError(error('loadTourneyDb')
            )
        );
        obs.subscribe(tvo => this.onLoadTourneyByIdNext(tvo, complete), e => error(e) );
    }

    /**
     * Loads the tourney selected by a given username 
     */
    loadTourneyByUsername(username : string, complete: () => void, error: (em: any) => any ): void {
        let url = loadTourneyByUsernameUrl + "/" + username
        console.log("loadTourneyById(): " + url);

        const obs = this.http.get<TourneyVO>(url).pipe(
            tap(_ => this.log('fetched tourney from DB by url=' + url)), 
            catchError(error('loadTourneyDb')
            )
        );
        obs.subscribe(tvo => this.onLoadTourneyByIdNext(tvo, complete), e => error(e) );
    }

    private onLoadTourneyByIdNext(tvo: TourneyVO, complete: () => void) {
        console.log("TourneyService.onLoadTourneyByIdNext() ");

        this.tvo = tvo;
        this.selectedTourney = JSON.parse(this.tvo.json);

        this.selectedTourney.id = this.tvo.id;
        this.selectedTourney.tourneyName = this.tvo.tourneyName;
        this.selectedTourney.followerName = this.tvo.followerName;
        this.selectedTourney.country = this.tvo.country;
        this.selectedTourney.clientVO = this.tvo.clientVO;

        complete();
    }

    loadTourneys(fromDate: Date, toDate: Date, error: (em: any) => any): any {
        let url = loadTourneyBySessionIdUrl;

        if(this.loginService.isUserLogged) {
            url = loadTourneyByClientIdUrl + "/" + this.clientService.selectedClient.id;
        }
        url += + "?" + "fromDate=" + fromDate + "&" + "toDate="   + toDate;
        
        return this.http.get<TourneyVO[]>(url).pipe(
            tap(_ => this.log('fetched selected tourneys from DB, url=' + url)),
            catchError(error('loadTourneyDb'))
          );
    }

    loadTourneyPlayoff (error: (em: any) => any): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(loadTourneyByClientIdUrl)
        .pipe(
            tap(_ => this.log('fetched all Playoff tourneys')),
            catchError(error('loadTourneyPlayoff'))
          );
    }

    loadTourneyElimination (error: (em: any) => any): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(loadTourneyByClientIdUrl)
        .pipe(
            tap(_ => this.log('fetched all Elimination tourneys')),
            catchError(error('loadTourneyElimination'))
          );
    }

    /** POST: add a new tourney to the server */
    private addTourney (tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {

        let url = insertTourneyUrl;

        return this.http.post<TourneyVO>(url, tvo, httpOptions).pipe(
            tap((tvo: TourneyVO) => this.log('added Tourney url=' + url + " (id=" + tvo.id + ")")),
            catchError(selector)
        );
    }

    /** PUT: prepare the TourneyDb by stringify of received tourney to save on the server */
    private updateTourney (tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {

        return this.updateTourneyDb(tvo, selector);
    }

    saveTourney (tvo: TourneyVO , selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        if(tvo.id == null) {
            return this.addTourney(tvo, selector);
        }
        return this.updateTourney(tvo, selector);
    }

    public convertTourneyToVo( t : Tourney ): TourneyVO {
        return {
            id: t.id,
            tourneyName: t.tourneyName,
            country: t.country,
            clientVO: this.clientService.selectedClient,
            json: JSON.stringify(t)
        };
    }
     /**
     * Save the tourney after cleaning the internal list of meetings and calendars
     *  
     * @param t the tourney to save 
     * @param complete the callback method do invoke when the save will finish
     */
    public updateTourneyWithCleanAll(t : Tourney, complete: () => void ) : void
    {
        this.onSaveTourneyError = false;

        this.clearTourneyMeetings(t);
        let tvo : TourneyVO = this.prepareTourneyVO(t, this.clientService.selectedClient);

        let url = updateTourneyUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put(url, tvo, httpOptions).pipe(
            tap(x => this.log('updated TourneyDb url=' + url)),
            catchError(this.saveTourneyErrorHandler())
        );

        subscriber.subscribe( () => complete() );
    }

    /**
     * Save the tourney without saving its playoff meetings!
     * 
     * Before to update the received tourney, saves the roundtrip and oneway playoff meetings in the local variables, clean both
     * the oneway and roundtrip meetings, save the toruney and, when the method returns, restorea the saved meetings in 
     * the original tourney.
     * 
     * @param t the tourney to save 
     * @param complete the callback method do invoke when the save will finish
     */
    public updateTourneyCleanPalyoffMeetings(t: Tourney, complete: () => void ) : void
    {
        this.onewayPlayoffMap = new Map<string, Meeting[]>();
        this.roundtripPlayoffMap = new Map<string, Meeting[]>();
 
        let tvo : TourneyVO = this.preparePlayoffTourneyVO(t, t.playoffVO, true, this.clientService.selectedClient);

        this.onSaveTourneyError = false;

        let url = updateTourneyUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put(url, tvo, httpOptions).pipe(
            tap(x => this.log('updated TourneyDb url=' + url)),
            catchError(this.saveTourneyErrorHandler())
        );

        if(!this.onSaveTourneyError) {
            subscriber.subscribe(cs => t.id = cs.id, e => this.subscribeErrorHandler(e), () => this.restoreOnComplete( t.playoffVO, complete ) );
        }
    }

    /**
     * Save the meetings and the tourney in one transaction!
     * 
     * Before to update the received tourney, saves the roundtrip and oneway playoff meetings in the local variables, clean both
     * the oneway and roundtrip meetings, save the toruney and meetings on the DB and, when the method returns, restores the saved meetings in 
     * the original tourney.
     * 
     * @param t the tourney to save 
     * @param complete the callback method do invoke when the save will finish
     */
    public updateTourneyAndPlayoffs(t: Tourney, complete: () => void ) : void {
        this.onewayPlayoffMap = new Map<string, Meeting[]>();
        this.roundtripPlayoffMap = new Map<string, Meeting[]>();
        let tvo : TourneyVO = this.preparePlayoffTourneyVO(t, t.playoffVO, true, this.clientService.selectedClient);
        this.onSaveTourneyError = false;
        let url = updateTourneyPlayoffsUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put(url, tvo, httpOptions).pipe(
            tap(x => this.log('updated TourneyDb url=' + url)),
            catchError(this.saveTourneyErrorHandler())
        );
        if(!this.onSaveTourneyError) {
            subscriber.subscribe(cs => t.id = cs.id, e => this.subscribeErrorHandler(e), () => this.restoreOnComplete( t.playoffVO, complete ) );
        }
    }

    public updateTourneyAndPlayouts(t: Tourney, complete: () => void ) : void {
        this.onewayPlayoffMap = new Map<string, Meeting[]>();
        this.roundtripPlayoffMap = new Map<string, Meeting[]>();
        let tvo : TourneyVO = this.preparePlayoffTourneyVO(t, t.playoutVO, false, this.clientService.selectedClient);
        this.onSaveTourneyError = false;
        let url = updateTourneyPlayoutsUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put(url, tvo, httpOptions).pipe(
            tap(x => this.log('updated TourneyDb url=' + url)),
            catchError(this.saveTourneyErrorHandler())
        );
        if(!this.onSaveTourneyError) {
            subscriber.subscribe(cs => t.id = cs.id, e => this.subscribeErrorHandler(e), () => this.restoreOnComplete( t.playoutVO, complete ) );
        }
    }

    private  preparePlayoffTourneyVO(t: Tourney, po: PlayoffVO, isPlayoff: boolean, c: ClientVO): TourneyVO {
        let playoffsMeetings : MeetingDb [] = [];
        for (let p of po.playoffs) {
            for (let m of p.round.onewayMeetings) {
                let mdb = null;
                if(isPlayoff) {
                    mdb = this.meetingService.preparePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                } else {
                    mdb = this.meetingService.preparePlayoutMeetingDb(m, this.selectedTourney.id, p.id);
                }
                playoffsMeetings.push(mdb);
            }
            for (let m of p.round.roundtripMeetings) {
                let mdb = null;
                if(isPlayoff) {
                    mdb = this.meetingService.preparePlayoffMeetingDb(m, this.selectedTourney.id, p.id);
                } else {
                    mdb = this.meetingService.preparePlayoutMeetingDb(m, this.selectedTourney.id, p.id);
                }
                playoffsMeetings.push(mdb);
            }
        }
        for (let p of po.playoffs) {
            this.onewayPlayoffMap.set(p.playoffName, p.round.onewayMeetings);
            p.round.onewayMeetings = [];            
            this.roundtripPlayoffMap.set(p.playoffName, p.round.roundtripMeetings);
            p.round.roundtripMeetings = [];
        }
        let tvo: TourneyVO = {
            id:  t.id,
            tourneyName: t.tourneyName,
            country: t.country,
            clientVO: c,
            json: JSON.stringify(t)
        };
        tvo.mdbs = playoffsMeetings;

        return tvo;
    }

    /**
     * Restores in the tourney the previous saved meetings
     * 
     * @param t the tourney the meetings to restore 
     * @param complete the callback to call whene the restore will finish
     */
    private restoreOnComplete(po: PlayoffVO, complete: () => void): void {

        for (let p of po.playoffs) {
            p.round.onewayMeetings = this.onewayPlayoffMap.get(p.playoffName);            
            p.round.roundtripMeetings = this.roundtripPlayoffMap.get(p.playoffName);
        }

        complete();
    }
    
    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T): any {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onSaveTourneyError = true;
 
            return of(result as T);
        };
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");

            this.onSaveTourneyError = true;

            console.error(error); // log to console instead
      
            console.log(`${operation} failed: ${error.message}`);
      
            return of(result as T);
        };
    }
    
    updateTourneyRoundTeams(tvo: TourneyVO, complete?: () => void )  {
        let url = updateTourneyRoundsUrl;
        const subscriber = this.http.put(url, tvo, httpOptions).pipe(
                tap(_ => this.log('updated TourneyDb url=' + url)),
                catchError(this.handleError('update TourneyDb', []))
        );
        subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () =>  complete());
    }

    updateTourneyAndRounds(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyRoundsUrl;
        return this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    updateTourneyAndEliminatories(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyEliminatoriesUrl;
        return this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    updateTourneyAndEliminatoriesB(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyEliminatoriesBUrl;
        return this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    /** PUT: update the tourney on the server */
    private updateTourneyDb (tvo: TourneyVO , selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyUrl;

        return this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    /** PUT: update the tourney and the round meetings on the server */
    public updateTourneyDeleteAllMeetings(tvo: TourneyVO): void {
        let url = updateTourneyDeleteAllMeetingsUrl;

        let obs = this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(this.handleError('loadTourneyVO', []))
        );

        obs.subscribe();
    }

    /** PUT: update the tourney and the round meetings on the server */
    public updateTourneyDeleteRoundMeetings (tvo: TourneyVO): void {
        let url = updateTourneyDeleteRoundMeetingsUrl;

        let obs = this.http.put(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(this.handleError('loadTourneyDb', []))
        );

        obs.subscribe();
    }
  
    doRoundDelete(round: Round, selector: (err: any, caught: Observable<Round> ) => Observable<Round> ): void {
        console.log("doRoundDelete(): " + round.name);
        let popup = 'Sicuro di voler rimuovere il girone: ' + round.name + "?";

        if(confirm(popup)) {
            let index: number = this.selectedTourney.roundVO.rounds.indexOf(round);
            if(index > -1) {
                let rounds: Round[] = this.selectedTourney.roundVO.rounds.splice(index, 1);
                for(let r of rounds) {
                    this.removeRound(r);
                }
                this.updateTourney(this.selectedTourney, selector).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
    }

    doPlayoffDelete(playoff: Playoff, selector: (err: any, caught: Observable<Playoff> ) => Observable<Playoff> ): void {
        console.log(playoff);
        let popup = 'Sicuro di voler rimuovere la regola di playoff: '+ playoff.playoffName + "?";

        if(confirm(popup)) {

            for( let m of playoff.round.onewayMeetings) {
                this.meetingService.deleteMeeting(m);
            }

            let index = this.selectedTourney.playoffVO.playoffs.indexOf(playoff);
            if(index > -1) {
                this.selectedTourney.playoffVO.playoffs.splice(index, 1);
                this.updateTourney(this.selectedTourney, selector).subscribe(n => this.next(n), e => this.onError(e) );
            }
        }
    }
   
    private next(n:any) {
    }

    private removeRound(r: Round): any {
        for(let m of r.onewayMeetings) {
            this.meetingService.deleteMeeting(m);
        }
        r.onewayMeetings = [];
    }

    /** DELETE: delete the tourney from the server */
    deleteTourney (tourney: Tourney, selector: (err: any, caught: Observable<Tourney> ) => Observable<Tourney> ) : Observable<Tourney> {
        const id = tourney.id;        
        const url = deleteTourneyUrl + "/" + id;

        return this.http.delete<Tourney>(url, httpOptions).pipe(
            tap(_ => this.log('deleted Tourney id=' + id)),
            catchError(selector)
        );
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
      
          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);
      
          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
      }
      
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        console.log('TourneyService: ' + message);
    }

    containsPhase(value: string) : boolean{
        for(let i=0; i<this.selectedTourney.phases.length; i++ ) {
            if(this.selectedTourney.phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Prepares the teams classification in function of the list of all of the meetings for each team 
     * @param meetings the list of the meetings
     */
    public createClassification(round: Round, meetings: Meeting[]) {
        const teamNames : string[] = round.teamNames;

        let classificationList: Classification[] = this.prepareClassificationList(teamNames, meetings, null);
        
        classificationList = this.correctClassification(classificationList, meetings);
        round.classification = classificationList;
    }

    /**
     * Prepares the classification relatid to the selected eliminaory 
     */
    public updateClassification(el: EliminatoryLevel): void {
        console.log("Entering updateClassification(" + el.level +")");
        for( let e of el.eliminatories ) {
            let allMeetings = e.round.onewayMeetings.concat(e.round.roundtripMeetings);
            this.createClassification(e.round, allMeetings);
        }
    }
    
    public updateEliminatoryLevelsAndGui(eliminatoryLevels : Array<EliminatoryLevel>) {
        for (let l = 0; l < eliminatoryLevels.length; l++) {
            let el = eliminatoryLevels[l];
            this.updateClassification(el);
        }
    }

    /**
     * Correctes the classification list when there are 2 or more teams having the same number of points.
     * In that case, it computes the saparate(avulsa) classification only on the teams having the same points. 
     * After that, updates the original classification.
     * 
     * @param classificationList the origina classification list
     * @param meetings the list of meetings of all teams in the same round
     * @returns the new corrected classification
     */
    private correctClassification(classificationList:  Classification[], meetings: Meeting[]): Array<Classification>  {
         
        const classificationGroupByMap : Map<number, Classification[]> = this.groupBy(classificationList);

        let pointsMap : Map<number,  Meeting[]> = new Map();
        
        for(let c of classificationList) {
            const points = c.points;
            let cmList : Classification[] = classificationGroupByMap.get(points);
            for (let m of meetings) {
                let f1 = cmList.findIndex( t => t.teamName === m.teamName1 );
                let f2 = cmList.findIndex( t => t.teamName === m.teamName2 );
                if(f1!=-1 && f2!=-1) {
                    if( !pointsMap.has(points) ) {
                        pointsMap.set(points, new Array<Meeting>())
                    }
                    let meetingList = pointsMap.get(points);
                    meetingList.push(m);                        
                }
            }
        }

        let sortedClassification: Classification[] = [];
        let step : number = 1;
        for(let i=0; i < classificationList.length; i+=step) {
            let c : Classification = classificationList[i];
            let key = c.points;
   
            if(!pointsMap.has(key)) {
                sortedClassification.push(c);
                step=1;
                continue;
            }

            let meetingSubList:  Meeting[] = pointsMap.get(key);
             
            const teamNamesSet: Set<string> = new Set();
            for(let m of meetingSubList) {
                teamNamesSet.add(m.teamName1);
                teamNamesSet.add(m.teamName2);
            }

            let teamNames: string[] = Array.from(teamNamesSet);
            let sortedSubList: Classification[] = this.prepareClassificationList(teamNames, meetingSubList, classificationList);
             
            let j=i;
            for( let j=0; j<sortedSubList.length; j++ ) {
                let sc = sortedSubList[j];
                let fi = classificationList.findIndex(e => e.teamName === sc.teamName);
                let originalClassification = classificationList[fi];
                sortedClassification.push(originalClassification);
            }
            step = sortedSubList.length;
        }

        return sortedClassification;
    }

    private groupBy(classificationList: Array<Classification>) : Map<number, Classification[]>  {
        const groupByMap: Map<number, Classification[]> = new Map();

        for (let c of classificationList) {
            if (!groupByMap.has(c.points)) {
                groupByMap.set(c.points, [])
            }
            let cList = groupByMap.get(c.points);
            cList.push(c);
          }

          return groupByMap;
    }

    private prepareClassificationList(teamNames: string[], meetings: Meeting[], ocList:  Classification[]): Classification[] {
        let classificationMap: Map<string, Classification> = new Map<string, Classification>();
        for (let t of teamNames) {
            let c = this.meetingService.newClassification(t, 0);
            classificationMap.set(t, c);
        }

        for (let m of meetings) {
            let t1 = m.teamName1;
            let t2 = m.teamName2;
            console.log("M.id="+ m.id + ": " + t1 + " Vs " + t2);
            if ( t1=="" || t2=="" || m.isSkiping ) {
                continue;
            }

            let c1: Classification = classificationMap.get(t1);
            let c2: Classification = classificationMap.get(t2);

            c1.points += m.points1;
            c2.points += m.points2;

            if (c1.points > 0 || c2.points > 0) {
                for (let ma of m.matches) {
                    if (ma.score1 > 0 || ma.score2 > 0 || m.status == MeetingStatus.Terminated) {
                        c1.played++;
                        c2.played++;
                    }
                }
            }

            if (m.points1 > m.points2) {
                c1.won++;
                c2.lost++;
            }
            if (m.points2 > m.points1) {
                c2.won++;
                c1.lost++;
            }
            if (m.points1 == m.points2 && m.status == MeetingStatus.Terminated) {
                c1.balanced++;
                c2.balanced++;
            }

            for (let ma of m.matches) {
                c1.goalsDone += ma.score1;
                c1.goalsConceded += ma.score2;

                c2.goalsDone += ma.score2;
                c2.goalsConceded += ma.score1;
            }
            c1.goalsDiff = c1.goalsDone - c1.goalsConceded;
            c2.goalsDiff = c2.goalsDone - c2.goalsConceded;
        }

        let cl: Classification[] = [...classificationMap.values()];
    
        cl = this.meetingService.sortDesc(cl, ocList);
        return cl;
    }

    /**
     *   Prepares the classification rows for Round, Playoff  and Eliminatoryformat  
     */
     prepareRoundsGui(maxMatchesPerMeeting : number, rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            let r = 0;
            for (let c of round.classification) {

                rows.push(c);

                let played = c.played / maxMatchesPerMeeting;
                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName = c.teamName;    
                if( c.notResolveble ) {
                    rows[row].teamName += " *";  
                }
                rows[row].points = c.points < 0 ? 0 : c.points;    
                rows[row].played = c.played + " (" + played + "x" + maxMatchesPerMeeting + ")";    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDiff = c.goalsDone - c.goalsConceded;    
                rows[row].goalsConceded = c.goalsConceded;    

                let len = round.onewayMeetings.length;

                let currentKey = round.name;  
                if(!classificationMap.has(currentKey)) {
                    classificationMap.set(currentKey, c);
                    rows[row].rowspanSize = len;
                } else {
                    rows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }

        return rows;
    }
    
    /**
     *  Prepares the classification rows for Eliminatory format  
     */
    prepareEliminatoryRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            let r = 0;
            for (let c of round.classification) {

                rows.push(c);

                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName = c.teamName;    
                rows[row].points = c.points < 0 ? 0 : c.points;   
                rows[row].played = c.played;    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDiff = c.goalsDone - c.goalsConceded;    
                rows[row].goalsConceded = c.goalsConceded;    

                let len = round.onewayMeetings.length;

                let currentKey = round.name;  
                if(!classificationMap.has(currentKey)) {
                    classificationMap.set(currentKey, c);
                    rows[row].rowspanSize = len;
                } else {
                    rows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }

        return rows;
    }

    public prepareTourneyVO( t: Tourney, c: ClientVO): TourneyVO {
        let followerName : string = t.tourneyName.replace(/[\s\/\\%]/g,"");
        let tvo: TourneyVO = {
            id:  t.id,
            tourneyName: t.tourneyName,
            followerName: followerName,
            country: t.country,
            clientVO: c,
            json: JSON.stringify(t)
        };
        return tvo;
    }

    /**
     * Clears tourney local meetings array before create che JSON string to save on the Back End
     */
    public clearTourneyMeetings(tourney: Tourney) {

        for (let r of tourney.roundVO.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        for (let p of tourney.playoffVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        for (let el of tourney.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
    }

    public cleanRoundMeeting(t: Tourney): Tourney  {
        for(let r of t.roundVO.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        return t;
    }

    public cleanPlayoffMeeting(t:  Tourney): Tourney {
        for(let p of t.playoffVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        return t;
    }

    public cleanPlayoutMeeting(t:  Tourney): Tourney {
        for(let p of t.playoutVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        return t;
    }
    
    public cleanEliminatoryMeeting(t: Tourney): Tourney{
        // let copy = this.cloneObject(t);
        for(let el of t.eliminatoryLevels) {
            for( let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        return t;
    }

    public cleanEliminatoryBMeeting(t: Tourney): Tourney{
        // let copy = this.cloneObject(t);
        for(let el of t.eliminatoryBLevels) {
            for( let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        return t;
    }

    public getClassificationName(): string {
        return this.classificationName;
    }

    public makeClassificationName(sc: Classification, roundName: string): void {
        this.selectedClassificationRow =  sc;
        this.classificationName = roundName ;
    }
}
