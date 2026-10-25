import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { Round } from '../domain/round';
import { Playoff } from '../domain/playoff';
import { Team } from '../domain/team';
import { Combobox } from '../domain/tourney-combobox';
import { Eliminatory } from '../domain/eliminatory';

import { EliminatoryLevel } from '../domain/eliminatory-level';
import { PlayoffRule } from '../domain/playoff-rule';
import { Meeting } from '../domain/meeting';
import { LoginService } from './login-service';
import { TourneyVO } from '../domain/tourney.vo';
import { ClientService } from './client-service';
import { TableCols } from '../domain/table-cols';
import { Classification } from '../domain/classification';
import { Direction, MeetingStatus } from '../domain/enumerations';
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

@Injectable({
  providedIn: 'root'
})
export class TourneyService extends AbstractService {
    public FIRST_COMBO_ITEM: Combobox =  { label: "Seleziona", value: 0 };

    tourneys: Tourney[] = []; 

    positionsCombobox: Combobox[] = [];
    roundsCombobox: Combobox[] = [];
    playoffsCombobox: Combobox[] = [];

    selectedTourney : Tourney = new Tourney();
    eliminatoryTabName: string = "";

    selectedRound : Round = new Round();
    selectedPlayoff : Playoff | null = new Playoff();
    selectedPlayout : Playoff | null = new Playoff();
    selectedEliminatory : Eliminatory = new Eliminatory();
    selectedEliminatoryLevel: EliminatoryLevel = new EliminatoryLevel();

    newTourney : boolean = false;
    newRound : boolean = false;
    
    newPlayoffConfig : boolean = false;

    firstTime : boolean = true;
    selectedResultTabIndex: number = 0; 
    selectedTabIndex: number; 
    private sequenceNumber: number = 1000;
    playoffsConfig: boolean = false;

    originalTeams: Team[] = [];
    selectedOperator: UserVO = new UserVO();
    operatorVo : OperatorsVO = new OperatorsVO();
    isOneway: boolean = true;
    selectedPlayoffConfig: PlayoffRule = new PlayoffRule();
    newRule: boolean = false;
    selectedRoundTabIndex: number = 0;
    selectedPlayoffTabIndex: number = 0;
    selectedEliminatoryTabIndex: number = 0;
    selectedEliminatoryBTabIndex: number = 0;
    selectedEliminatoryLevelIndex: number = 0;
    selectedEliminatoryBLevelIndex: number = 0;
    selectedEliminatoryIndex: number = 0;
    selectedEliminatoryLevelBIndex: number = 0;
    selectedEliminatoryBIndex: number = 0;
    selectedClassificationRow: Classification = new Classification();

    createChaosDisabled: boolean = false;
    addFixedCoupleEnabled : boolean = false;
    addFixedCoupleCounter : number = 0;

    detachedClassificationRows: any[] = [];

    static roundCols: TableCols[] = [
        { field: 'name',       header: 'GIRONI' },
        { field: 'teamNo',     header: 'S/G' },
        { field: 'teamNames',  header: 'Squadre/Girone' },
    ];

    static playoffCols: TableCols[] = [
        { field: 'playoffName', header: 'Playoff' },
        { field: 'teamNo',      header: 'N° Squadre' },
        { field: 'teamNames',   header: 'Squadre' },
    ];
    redirect: string = "";

    classificationCols: TableCols[] = [
        { field: 'teamName',      header: 'Team'},
        { field: 'points',        header: 'Pt.'},
        { field: 'played',        header: 'G'},
        { field: 'won',           header: 'V'},
        { field: 'lost',          header: 'P'},
        // { field: 'balanced',      header: 'N'},
        { field: 'goalsDone',     header: 'Gf'},
        { field: 'goalsConceded', header: 'Gs'},
        { field: 'goalsDiff',     header: 'D'},
    ];

    detachedClassificationCols: TableCols[] = [
        { field: 'teamName',      header: 'Team'},
        { field: 'dpoints',       header: 'C.A.'},
        { field: 'points',        header: 'Pt.'},
        { field: 'played',        header: 'G'},
        { field: 'won',           header: 'V'},
        { field: 'lost',          header: 'P'},
        // { field: 'balanced',      header: 'N'},
        { field: 'goalsDone',     header: 'Gf'},
        { field: 'goalsConceded', header: 'Gs'},
        { field: 'goalsDiff',     header: 'D'},
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
        { field: 'asd',       header: 'ASD' },
    ];
    
    private tvo: TourneyVO = new TourneyVO();

    private onSaveTourneyError: boolean = false;
    private onewayPlayoffMap: Map<string, Meeting[]> = new Map<string, Meeting[]>();
    private roundtripPlayoffMap: Map<string, Meeting[]> = new Map<string, Meeting[]>();
    private classificationName: string = "";
    public detachedRoundMap: Map<number, Round> = new Map<number, Round>();

    constructor(private http: HttpClient
        , protected loginService: LoginService
        , private clientService: ClientService
        , private meetingService: MeetingService) 
    { 
        super();
        console.log("Constructor of TourneyService");
        this.sequenceNumber++;
        this.selectedTabIndex = 0;
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
            return 0;
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

    public setRoundStatus(sr: Round): MeetingStatus {
        let zeroCounter : number = 0;
        let winCounter : number = 0;
        let len : number = sr.onewayMeetings.length;
        if( sr.teamNames.length % 2 != 0 ) {
            len -= sr.teamNames.length;
        }
        for( let m of sr.onewayMeetings ) {
            if( m.status == MeetingStatus.ToPlay ) {
                zeroCounter++;
            }
            if( m.status == MeetingStatus.Terminated ) {
                winCounter++;
            }
        }
        if( zeroCounter >= len ) {
            return MeetingStatus.ToPlay;
        }
        if( winCounter >= sr.onewayMeetings.length ) {
            return MeetingStatus.Terminated;
        }
        if( zeroCounter > 0 ) {
            return MeetingStatus.InProgress;
        }
        return MeetingStatus.ToPlay;
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
        let sortedTourneys = tourneys.sort((t1,t2) => {
            if(t1.datetime < t2.datetime) {
                return 1;
            }
            if(t1.datetime > t2.datetime) {
                return -1;
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

        if(this.loginService.isUserLogged && this.clientService.selectedClient) {
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
    loadTourneyById(tourneyId : number| null, complete: () => void, error: (em: any) => any ): void {
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

        if(this.loginService.isUserLogged && this.clientService.selectedClient) {
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
        const tvo = new TourneyVO();
        tvo.id = t.id;
        tvo.tourneyName = t.tourneyName == null ? "" : t.tourneyName;
        tvo.country = t.country;
        tvo.clientVO = this.clientService.selectedClient;
        tvo.json = JSON.stringify(t);
        return tvo;
    }
     /**
     * Save the tourney after cleaning the internal list of meetings and calendars
     *  
     * @param t the tourney to save 
     * @param complete the callback method do invoke when the save will finish
     */
    public updateTourneyWithCleanAll(t : Tourney, complete: () => void ) : void  {
        this.onSaveTourneyError = false;
        // this.clearTourneyMeetings(t, 0);
        let tvo : TourneyVO = this.prepareTourneyVO(t, this.clientService.selectedClient, true);
        let url = updateTourneyUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put<TourneyVO>(url, tvo, httpOptions).pipe(
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
    public updateTourneyCleanPalyoffMeetings(t: Tourney, complete: () => void ) : void    {
        this.onewayPlayoffMap = new Map<string, Meeting[]>();
        this.roundtripPlayoffMap = new Map<string, Meeting[]>();
        let tvo : TourneyVO = this.preparePlayoffTourneyVO(t, t.playoffVO, true, this.clientService.selectedClient);
        this.onSaveTourneyError = false;
        let url = updateTourneyUrl;
        console.log("Invoking put method on URL: [" + url + "]");
        let subscriber: Observable<TourneyVO> = this.http.put<Tourney>(url, tvo, httpOptions).pipe(
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
        let subscriber: Observable<TourneyVO> = this.http.put<Tourney>(url, tvo, httpOptions).pipe(
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
        let subscriber: Observable<TourneyVO> = this.http.put<Tourney>(url, tvo, httpOptions).pipe(
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

        let tvo = new TourneyVO();
        tvo.id = t.id;
        tvo.tourneyName = t.tourneyName == null ? "" : t.tourneyName;
        tvo.country = t.country;
        tvo.clientVO = c;
        tvo.json = JSON.stringify(t);
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
            let rom = this.onewayPlayoffMap.get(p.playoffName);
            if( rom == undefined ) continue;
            p.round.onewayMeetings = rom;  
            let rrm = this.roundtripPlayoffMap.get(p.playoffName);
            if( rrm == undefined ) continue;
            p.round.roundtripMeetings = rrm;
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
        if( complete ) {
            subscriber.subscribe(cs => this.next(cs), e => this.subscribeErrorHandler(e), () =>  complete());
        }
    }

    updateTourneyAndRounds(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyRoundsUrl;
        return this.http.put<TourneyVO>(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    updateTourneyAndEliminatories(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyEliminatoriesUrl;
        return this.http.put<TourneyVO>(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    updateTourneyAndEliminatoriesB(tvo: TourneyVO, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyEliminatoriesBUrl;
        return this.http.put<TourneyVO>(url, tvo, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(selector)
        );
    }

    /** PUT: update the tourney on the server */
    private updateTourneyDb (tvo: TourneyVO , selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): Observable<TourneyVO> {
        let url = updateTourneyUrl;
        // const json = JSON.stringify(tvo);
        // console.log(json);
        const ob : Observable<TourneyVO> = this.http.put<TourneyVO>(url, tvo, httpOptions);
        return ob.pipe(
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
  
    doRoundDelete(round: Round, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): void {
        console.log("doRoundDelete(): " + round.name);
        let popup = 'Sicuro di voler rimuovere il girone: ' + round.name + "?";
        if(confirm(popup)) {
            let index: number = this.selectedTourney.roundVO.rounds.indexOf(round);
            if(index > -1) {
                let rounds: Round[] = this.selectedTourney.roundVO.rounds.splice(index, 1);
                for(let r of rounds) {
                    this.removeRound(r);
                }
                const tvo = this.convertTourneyToVo(this.selectedTourney);
                this.updateTourney(tvo, selector).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
    }

    doPlayoffDelete(playoff: Playoff, selector: (err: any, caught: Observable<TourneyVO> ) => Observable<TourneyVO> ): void {
        console.log(playoff);
        let popup = 'Sicuro di voler rimuovere la regola di playoff: '+ playoff.playoffName + "?";
        if(confirm(popup)) {
            for( let m of playoff.round.onewayMeetings) {
                this.meetingService.deleteMeeting(m);
            }
            let index = this.selectedTourney.playoffVO.playoffs.indexOf(playoff);
            if(index > -1) {
                this.selectedTourney.playoffVO.playoffs.splice(index, 1);
                const tvo = this.convertTourneyToVo(this.selectedTourney);
                this.updateTourney(tvo, selector).subscribe(n => this.next(n), e => this.onError(e) );
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
     * Rotates the original MxN matrix of the rounds and teams defined in the tournament.
     * 
     * Creates a NxM matrix as a rotation of 90° of the original Tournament matrix,
     * where the N rows are the positions in classificatin: 1°, 2°, 3°,... and the M columns are
     * the teams of each round of the tourney. 
     * 
     * In the first row, we have the list of the teams qualified as first in its round, 
     * in the second row we have the list of teams qualified as second in its round and so on.
     * 
     * It also normalizes the classification if we have some round with lesser teams than others
     * 
     * The matrix has to be accessed by 2 indexes:
     * - the row index to select the band position of a team: 1°, 2°,...
     * - tne column index to select the team with its points
     * 
     * @param rounds the rounds containing the teams to make the matrix
     * @param sortTheBand true to sort the teams in the band, false otherwise
     * @param fromPosition the position index from which normalize the team classification
     * @returns the global classification matrix of the teams
     */
    public createPositionRoundMatrix(rounds: Array<Round>, sortTheBand : boolean, fromPosition : number): Array<Array<Classification>>  {
        let maxTeamsPerRound : number = rounds[0].teamNames.length;
        let thereAreSpare : boolean = false;
        let i : number = -1;
        for( let r of rounds ) {
            if( r.teamNames.length < maxTeamsPerRound ) {
                thereAreSpare = true;
            }
        }
 
        // if( thereAreSpare ) {
        //     for(let r of rounds) {
        //         if(r.teamNames.length == maxTeamsPerRound) {
        //             this.normalizeClassificationList(r);
        //         }
        //     }
        // }

        let roundMatrix: Array<Array<Classification>> = new Array<Array<Classification>>();
        // t=0, the first team in its round. t=1 the second team in its round and so on... 
        for( let t=0; t<maxTeamsPerRound; t++ ) { 
            let bandClassificationList: Classification[] = [] ;
            for(let r of rounds) {
                let c = r.classification[t];
                if( thereAreSpare && r.classification.length == maxTeamsPerRound &&  t > fromPosition ) {
                    c = r.normalizedClassification[t];
                }
                bandClassificationList.push(c);    
            }
            if( sortTheBand )  {
                bandClassificationList = this.sortTeamsDesc(bandClassificationList);
            }            
            let row: Classification[] = [] ;
            roundMatrix.push(row);
            for(let c of bandClassificationList) {
                row.push(c);
            }
        }
        return roundMatrix;
    }

    public shiftLevelBMatrix(roundMatrix: Classification[][], levelATeams: number): Classification[][] {
        let newMatrix :  Classification[][] = [];
        let counter : number = 0;
        for(let r=0; r<roundMatrix.length; r++) {
            let classificationCols:  Classification[] = [];
            for(let c=0; c<roundMatrix[r].length; c++) {
                if( counter++ < levelATeams ) {
                    continue;
                }
                classificationCols.push(roundMatrix[r][c]);
            }
            if( counter < levelATeams ) {
                continue;
            }
            let row: Classification[] = [] ;
            newMatrix.push(row);
            for(let c of classificationCols) {
                row.push(c);
            }
        }
        return newMatrix;
    }

    public sortTeamsDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        return this.sortDesc(unsortedClassification, null);
    }

    public sortDesc(unsortedClassification: Array<Classification>, originalClassificationList: Array<Classification> | null ): Array<Classification>  {
        let sortedClassification: Array<Classification>  = unsortedClassification.sort((c1, c2) => {
            if( c1.teamName == "" && c2.teamName != "") {
                return 1;
            }
            if( c1.teamName != "" && c2.teamName == "") {
                return -1;
            }

            if (c1.points > c2.points) {
                return -1;
            }
            if (c1.points < c2.points) {
                return 1;
            }
            if (c1.played > c2.played) {
                return 1;
            }
            if (c1.played < c2.played) {
                return -1;
            }
            if( c1.goalsDiff > c2.goalsDiff ) {
                return -1;
            }
            if( c1.goalsDiff < c2.goalsDiff ) {
                return 1;
            }

            if( c1.goalsDone > c2.goalsDone ) {
                return -1;
            }
            if( c1.goalsDone < c2.goalsDone ) {
                return 1;
            }

            if( c1.goalsConceded < c2.goalsConceded ) {
                return -1;
            }
            if( c1.goalsConceded > c2.goalsConceded ) {
                return 1;
            }

            if( originalClassificationList == null ) {
                c1.notResolveble=true;
                c2.notResolveble=true;
                return c1.teamName > c2.teamName ? 1 : -1;
            }

            let fi1 = originalClassificationList.findIndex(e => e.teamName === c1.teamName);
            let originalC1 = originalClassificationList[fi1];

            let fi2 = originalClassificationList.findIndex(e => e.teamName === c2.teamName);
            let originalC2 = originalClassificationList[fi2];

            if( originalC1.played > originalC2.played ) {
                return 1;
            }
            if( originalC1.played < originalC2.played ) {
                return -1;
            }

            if( originalC1.goalsDiff > originalC2.goalsDiff ) {
                return -1;
            }
            if( originalC1.goalsDiff < originalC2.goalsDiff ) {
                return 1;
            }

            if( originalC1.goalsDone > originalC2.goalsDone ) {
                return -1;
            }
            if( originalC1.goalsDone < originalC2.goalsDone ) {
                return 1;
            }

            if( originalC1.goalsConceded < originalC2.goalsConceded ) {
                return -1;
            }
            if( originalC1.goalsConceded > originalC2.goalsConceded ) {
                return 1;
            }
            if (originalC1.played > originalC2.played) {
                return 1;
            }
            if (originalC1.played < originalC2.played) {
                return -1;
            }

            originalC1.notResolveble=true;
            originalC2.notResolveble=true;
            return c1.teamName > c2.teamName ? 1 : -1;
        });

        return sortedClassification;
    }

    /**
     * Converts in a sorted list the received classification matrix.
     * The powerOf2TopLevelLen parameter is to manage the NO power of 2 use case when all 
     * teams in any round are qualified, the number of teams in the matrix is 
     * not a power of 2. If the matrix is not a pwer of 2, the returned list will filled
     * with a dummy team having progressive negative points
     * 
     * @param roundMatrix the classification matrix to convert in the list
     * @param powerOf2TopLevelLen the length of top elimiatory level, always a power of 2
     * @returns the sorted classification list of the teams, always a power of 2
     */
    public sortedGlobalClassification( roundMatrix: Array<Array<Classification>>, powerOf2TopLevelLen: number):  Array<Classification>  {
        let sortedGlobalClassification :  Array<Classification> = [];       
        for(let r=0; r<roundMatrix.length; r++) {
            for(let c=0; c<roundMatrix[r].length; c++) {
                const cell = roundMatrix[r][c];
                if( cell == undefined ) {
                    continue;
                }
                sortedGlobalClassification.push(cell);
                if( --powerOf2TopLevelLen === 0 ) {
                    return sortedGlobalClassification;
                }
            }
        }
        let f : number = 1;
        while( powerOf2TopLevelLen-- > 0 ) {
            let fake = "Fittizio-" + f;
            let c : Classification = this.newClassification(fake, -(f++));
            sortedGlobalClassification.push(c);
        }
        for( let c of sortedGlobalClassification) {
            console.log(c.teamName + "(" + c.points +")");
        }
        return sortedGlobalClassification;
    }

    /**
     * Returns a simple team classification on all the received rounds as packing the 1° positions, the 2° posistion,
     * the 3° positions, and so on. 
     * 
     * Prepares the list of Classification by appending each list from the position matrix, the 1° row positions,
     * the second row positions, ... , until the last one. If the last row to append is a spare row, sort that row
     * before to append it.
     * 
     * @param rounds the round list to sort its classification teams
     * @param selectedTeamNo the number of teams to pack in the return list
     */
    public getPackedBandPositions( rounds: Array<Round>, topLevelTeamNo: number, fromPosition : number  ): Array<Classification> {
        let positionRoundMatrix : Array<Array<Classification>> = this.createPositionRoundMatrix(rounds, false, fromPosition);
        let sortedGlobalClassification :  Array<Classification> = [];       
        const roundNo : number = rounds.length; 
        for(let r=0; r<positionRoundMatrix.length; r++) {
            let row : Array<Classification> = positionRoundMatrix[r];
            topLevelTeamNo -= roundNo;
            if( topLevelTeamNo < roundNo ) {
                // sort this last spare row on the classification points
                row = this.sortTeamsDesc(row);
            }
            sortedGlobalClassification = sortedGlobalClassification.concat(row);
        }
        return sortedGlobalClassification;
    }

    /**
     * Normalizes the classification in the received round by reducing the points aquired by each 
     * team vs the last team in the round, paying attention if the final difference is 
     * not less or equals to the points of the last team in the round
     * 
     * @param round the round to verify if it has one more team
     */
    public normalizeClassificationList( round: Round, normalizedPosition : number) {
        let meetings: Meeting[] = round.onewayMeetings.concat(round.roundtripMeetings);
        if( meetings.length == 0 ) {
            return;
        }
        const roundLen = round.classification.length;
        let lastTeam: string = round.classification[roundLen-1].teamName;
        let lastTeamClassification: Classification | undefined = round.classification.find( c => c.teamName === lastTeam );
        if( lastTeamClassification == undefined ) {
            return;
        } 

        round.normalizedClassification = this.cloneClassification(round.classification);

        this.reset(round.normalizedClassification[roundLen-1]);

        for( let i=normalizedPosition; i<round.normalizedClassification.length; i++ ) {
            let c = round.normalizedClassification[i];
            let t = c.teamName;
            // let rc: Classification = round.classification.find( c => c.teamName === t );
            if( t === lastTeam ) {
                continue;
            }
            let m1: Meeting | undefined = meetings.find( m => m.teamName1 === t && m.teamName2 === lastTeam );
            if( m1 == undefined ) {
                continue;
            }
 
            // at home
            if( m1.points1 > 0 ) {
                if( m1.points1 >= 2 ) { // if win with diff > 1
                    c.won -= 1;
                }
                if( m1.points1 === 1 ) { // if lost with diff=1
                    c.lost -= 1;
                }
                c.points -= m1.points1;
                c.played -= 1;
                for( let i=0; i<m1.matches.length; i++ ) {
                    c.goalsDone -= m1.matches[i].score1;
                    c.goalsConceded -= m1.matches[i].score2;
                }
                c.goalsDiff = c.goalsDone - c.goalsConceded;
            }

            // away
            let m2: Meeting | undefined = meetings.find( m => m.teamName1 === lastTeam && m.teamName2 === t );
            if( m2 != undefined ) {
                if( m2.points2 > 0 ) {
                    if( m2.points2 >= 2 ) { // if win with diff > 1
                        c.won -= 1;
                    }
                    if( m2.points2 === 1 ) { // if lost with diff=1
                        c.lost -= 1;
                    }
                    c.points -= m2.points2;
                    c.played -= 1;
                    for( let i=0; i<m2.matches.length; i++ ) {
                        c.goalsDone -= m2.matches[i].score2;
                        c.goalsConceded -= m2.matches[i].score1;
                    }
                    c.goalsDiff = c.goalsDone - c.goalsConceded;
                }
            }
        }
    }

    private reset(c: Classification) {
        c.points = -1;
        c.dpoints = 0;
        c.balanced = 0;
        c.goalsDiff = 0;
        c.goalsDone = 0;
        c.goalsConceded = 0;
        c.played = 0;
        c.won = 0;
        c.lost = 0;
    }

    private cloneClassification(classification: Classification[]): Classification[] {
        return classification.map(item => {
            const clone = new Classification();
            clone.id = item.id;
            clone.teamName = item.teamName;
            clone.points = item.points;
            clone.dpoints = item.dpoints;
            clone.played = item.played;
            clone.won = item.won;
            clone.lost = item.lost;
            clone.balanced = item.balanced;
            clone.penalty = item.penalty;
            clone.goalsDone = item.goalsDone;
            clone.goalsDiff = item.goalsDiff;
            clone.goalsConceded = item.goalsConceded;
            clone.notResolveble = item.notResolveble;
            clone.roundIndex = item.roundIndex;
            return clone;
        });
    }

    /**
     * Creates a new Classification in function of the received parameters
     */
    public newClassification(teamName: string, initialPoints: number): Classification {
        const c = new Classification();
        c.teamName = teamName
        c.points = initialPoints;
        return c;
    }

    /**
     * Creates the teams classification, of the received round, in function of the list of all of the meetings for each team 
     * @param meetings the list of the meetings
     * @param toDetach true to create the detached (avulsa) classification
     */
    public createClassification(round: Round, toDetach : boolean) : Classification[] {
        const teamNames : string[] = round.teamNames;
        let meetings: Meeting[] = round.onewayMeetings.concat(round.roundtripMeetings);
        let classificationList: Classification[] = this.prepareClassificationList(teamNames, meetings, null);
        round.classification = classificationList;
        if( toDetach ) {
            round.detachedClassification = this.createDetachedClassification(round, meetings, true);
        }
        return classificationList;
    }

    /**
     * Prepares the classification related to the selected eliminaory 
     */
    public updateClassification(el: EliminatoryLevel): void {
        console.log("Entering updateClassification(" + el.level +")");
        for( let e of el.eliminatories ) {
            this.createClassification(e.round, false);
        }
    }
    
    public updateEliminatoryLevelsAndGui(eliminatoryLevels : Array<EliminatoryLevel>) {
        for (let l = 0; l < eliminatoryLevels.length; l++) {
            let el = eliminatoryLevels[l];
            this.updateClassification(el);
        }
    }
 
    /**
     * Creates a detached classification for teams having the same number
     * of points. When merge is true, it also updates the original
     * classification with the detached ordering.
     *
     * @param originalClassificationList the original classification list
     * @param meetings the meetings of all teams in the same round
     * @param merge whether to merge the detached ordering into the original classification
     * @returns the detached classification list
     */
    private createDetachedClassification(
        round: Round,
        meetings: Meeting[],
        merge: boolean
    ): Classification[] {
        let originalClassificationList: Classification[] = round.classification;
        const pointsMap = this.preparePointMap(
            originalClassificationList,
            meetings
        );
        const sortedDetachedClassification: Classification[] = [];
        let i = 0;
        while (i < originalClassificationList.length) {
            const current = originalClassificationList[i];
            const points = current.points;

            // Find the complete group of consecutive teams with the same points.
            let j = i + 1;
            while (
                j < originalClassificationList.length &&
                originalClassificationList[j].points === points
            ) {
                j++;
            }
            const originalGroup = originalClassificationList.slice(i, j);
            const meetingSubList = pointsMap.get(points);
            if (!meetingSubList || meetingSubList.length === 0) {
                i = j;
                continue;
            }
            const teamNamesSet = new Set<string>();
            for (const meeting of meetingSubList) {
                if (
                    meeting.teamName1 == null ||
                    meeting.teamName2 == null
                ) {
                    continue;
                }
                teamNamesSet.add(meeting.teamName1);
                teamNamesSet.add(meeting.teamName2);
            }
            const sortedSubList = this.prepareClassificationList(
                Array.from(teamNamesSet),
                meetingSubList,
                originalClassificationList
            );
            if (merge) {
                const originalByTeam = new Map(
                    originalGroup.map(c => [c.teamName, c])
                );
                const mergedGroup: Classification[] = [];
                const addedTeams = new Set<string>();
                for (const detached of sortedSubList) {
                    const original = originalByTeam.get(detached.teamName);

                    if (original && !addedTeams.has(original.teamName)) {
                        mergedGroup.push(original);
                        addedTeams.add(original.teamName);
                    }
                }
                // Update the original classification only.
                // Do not add non-detached teams to the returned list.
                originalClassificationList.splice(
                    i,
                    originalGroup.length,
                    ...mergedGroup,
                    ...originalGroup.filter(c => !addedTeams.has(c.teamName))
                );
                // Return only teams in the detached group.
                sortedDetachedClassification.push(...sortedSubList);
                round.classification = originalClassificationList;
            } else {
                sortedDetachedClassification.push(...sortedSubList);
            }
            i = j;
        }
        return sortedDetachedClassification;
    }    

    // Group classifications by points
    // Both teams must be in the same points group
    private preparePointMap(classificationList: Classification[], meetings: Meeting[]): Map<number, Meeting[]> {
        this.detachedRoundMap = new Map<number, Round>();
        const byPoints = classificationList.reduce((map, c) => {
            const list = map.get(c.points) ?? [];
            list.push(c);
            map.set(c.points, list);
            return map;
        }, new Map<number, Classification[]>());
        const result = new Map<number, Meeting[]>();
        for (const [points, classifications] of byPoints) {
            if (classifications.length < 2) continue;
            const teamNames = new Set(classifications.map(c => c.teamName));
            const teamMeetings = meetings.filter(m => {
                const team1InGroup = m.teamName1 && teamNames.has(m.teamName1);
                const team2InGroup = m.teamName2 && teamNames.has(m.teamName2);
                return team1InGroup && team2InGroup;
            });
            result.set(points, teamMeetings);
            let r : Round = new Round();
            r.daysNo = 1;
            r.name = "Avulsa." + points;
            r.teamNames = classifications.map(c => c.teamName);
            r.classification = classifications;
            let mm : Meeting[] | undefined = result.get(points);
            if( mm != undefined ) {
                r.onewayMeetings = mm.filter(e => e.direction === Direction.OneWay)
                    .map(e => ({ ...e, day: 1 }));  // spread creates a new object + sets day
                r.roundtripMeetings = mm.filter(e => e.direction === Direction.RoundTrip)
                    .map(e => ({ ...e, day: 1 }));
            }
            this.detachedRoundMap.set(points, r);
        }
        return result;
    }

    /**
     * Creates the classification list of each team in teamNames in function of the corresponding meetings in the
     * meetings list. The ocList, if any, is used in the detached (avulsa) classification when all the sort criteria are
     * the same we need to get the original classification list for global results
     * 
     * @param teamNames the teams to create the classification to
     * @param meetings the meetings containing the results of each meeting
     * @param originalClassificationList if != null, the original classification list used in the detached classification 
     * @returns the list of team classidication, one for each team
     */
    private prepareClassificationList(teamNames: string[], meetings: Meeting[], originalClassificationList:  Classification[] | null): Classification[] {
        let classificationMap: Map<string, Classification> = new Map<string, Classification>();
        for (let t of teamNames) {
            let c = this.newClassification(t, 0);
            if( originalClassificationList != null ) {
                let index = originalClassificationList.findIndex( e => e.teamName === t );
                if( index != -1 ) {
                    c.dpoints = originalClassificationList[index].points;
                }
            }
            classificationMap.set(t, c);
        }
        for (let m of meetings) {
            let t1 = m.teamName1;
            let t2 = m.teamName2;
            if ( t1=="" || t2=="" || m.isSkiping ) {
                continue;
            }
            if( t1 == null || t2 == null ) continue;
            let c1: Classification | undefined = classificationMap.get(t1);
            let c2: Classification | undefined = classificationMap.get(t2);
            if( !c1 || !c2 ) {
                console.log("c1=classificationMap.get("+ t1 +")");
                console.log("c2=classificationMap.get("+ t2 +")");
                continue;
            }
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
        cl = this.sortDesc(cl, originalClassificationList);
        return cl;
    }

    /**
     * Prepares the classification rows for Round, Playoff and Eliminatory format  
     */
     public prepareRoundsGui(maxMatchesPerMeeting : number, rounds: Round[]): any[] {
         let classificationMap: Map<string, Classification> = new Map<string, Classification>();
         let row : number = 0;
         let rows: any[] = [];
         for (let round of rounds) {
            const clist : Classification[] = round.classification;
            row = this.prepareClassificationRows(clist, rows, maxMatchesPerMeeting, row, round, classificationMap);
        }
        return rows;
    }

    /**
     * Prepares the normalized if any classification rows for Round, Playoff and Eliminatory format  
     */
     public prepareNormalizedRoundsGui(maxMatchesPerMeeting : number, rounds: Round[]): any[] {
         let classificationMap: Map<string, Classification> = new Map<string, Classification>();
         let row : number = 0;
         let rows: any[] = [];
         for (let round of rounds) {
            const clist : Classification[] = round.normalizedClassification;
            row = this.prepareClassificationRows(clist, rows, maxMatchesPerMeeting, row, round, classificationMap);
        }
        return rows;
    }

    public prepareDetachedRoundsGui(round: Round, maxMatchesPerMeeting : number): any[] {
        const detachedClassList : Classification[] = this.extractDetachedClassification(round);
        round.detachedClassification = detachedClassList;
        let rows: any[] = [];
        let row : number = 0;
        let classificationMap: Map<string, Classification> = new Map<string, Classification>();
        row = this.prepareClassificationRows(detachedClassList, rows, maxMatchesPerMeeting, row, round, classificationMap);
        return rows;
    }
    
    public extractDetachedClassification( round: Round ): Classification[] {
        let meetings: Meeting[] = round.onewayMeetings.concat(round.roundtripMeetings);
        const detachedClassification : Classification[] = this.createDetachedClassification(round, meetings, false);
        round.detachedClassification = detachedClassification;
        return detachedClassification;
    }
    
    private prepareClassificationRows(clist: Classification[]
            , rows: any[]
            , maxMatchesPerMeeting: number
            , row: number
            , round: Round
            , classificationMap: Map<string, Classification>) : number 
    {
        let r: number = 0;
        for (let oc of clist) {
            let c = { ...oc };
            rows.push(c);
            let played = c.played / maxMatchesPerMeeting;
            rows[row].rowNumber = ++r;
            rows[row].dpoints = c.dpoints;
            rows[row].roundName = round.name;
            rows[row].teamName = c.teamName;
            if (c.notResolveble) {
                rows[row].teamName = c.teamName + " *";
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
            if (!classificationMap.has(currentKey)) {
                classificationMap.set(currentKey, c);
                rows[row].rowspanSize = len;
            } else {
                rows[row].rowspanSize = undefined;
            }
            row++;
        }
        return row;
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

    public prepareTourneyVO( t: Tourney, c: ClientVO, cleanMeetings : boolean): TourneyVO {
        if( t.tourneyName )  {
            if( cleanMeetings ) {
                this.cleanMeetings(t);
            }
            let followerName : string = t.tourneyName.replace(/[\s\/\\%]/g,"");
            let tvo = new TourneyVO();
            tvo.id = t.id;
            tvo.tourneyName = t.tourneyName;
            tvo.followerName = followerName;
            tvo.country = t.country;
            tvo.clientVO = c;
            tvo.json = JSON.stringify(t);
            return tvo;
        }
        return new TourneyVO();
    }

    private cleanMeetings( t: Tourney) : void {
        this.cleanRoundMeeting(t);
        this.cleanPlayoffMeeting(t);
        this.cleanPlayoutMeeting(t);
        this.cleanEliminatoryMeeting(t);
        this.cleanEliminatoryBMeeting(t);
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
        for(let el of t.eliminatoryLevels) {
            for( let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        return t;
    }

    public cleanEliminatoryBMeeting(t: Tourney): Tourney{
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

    /**
     * Change the team name in every tourney structure received as parameter
     *     roundVO                    : RoundVO = new RoundVO();
         playoffVO                  : PlayoffVO = new PlayoffVO();
         playoutVO                  : PlayoffVO = new PlayoffVO();
     
         eliminatoryLevels          : Array<EliminatoryLevel> = [];
         eliminatoryBLevels         : Array<EliminatoryLevel>  = [];

     * @param selectedTourney 
     */
    public updateEveryThinkOnTeamChange(selectedTourney: Tourney, previousTeamName : string, newTeamName : string) {
        const ttIndex = selectedTourney.teams.findIndex(t => t.teamName === previousTeamName);
        if (ttIndex !== -1) {
            selectedTourney.teams[ttIndex].teamName = newTeamName;
        }  
        if( selectedTourney.roundVO ) {
            let rounds = selectedTourney.roundVO.rounds;
            for( let r of rounds ) {
                const ttIndex = r.teamNames.findIndex(t => t === previousTeamName);
                if (ttIndex !== -1) {
                    r.teamNames[ttIndex] = newTeamName;
                } 
                if( r.classification ) {
                    for( let c of r.classification ) {
                        if( c.teamName === previousTeamName ) {
                            c.teamName = newTeamName;
                        }
                    }
                }
                if( r.onewayMeetings ) {
                    for( let m of r.onewayMeetings) {
                        if( m.teamName1 === previousTeamName ) {
                            m.teamName1 = newTeamName;
                        }        
                        if( m.teamName2 === previousTeamName ) {
                            m.teamName2 = newTeamName;
                        }        
                        let observer = this.meetingService.saveRoundMeetingDb(m, selectedTourney.id, r.id, e => {});
                        observer.subscribe(m => {}, e => {});
                    }
                }
                if( r.roundtripMeetings ){
                    for( let m of r.roundtripMeetings) {
                        if( m.teamName1 === previousTeamName ) {
                            m.teamName1 = newTeamName;
                        }        
                        if( m.teamName2 === previousTeamName ) {
                            m.teamName2 = newTeamName;
                        }        
                        let observer = this.meetingService.saveRoundMeetingDb(m, selectedTourney.id, r.id, e => {});
                        observer.subscribe(m => {}, e => {});
                    }        
                }
            }        
        }
        if( selectedTourney.playoffVO ) {
            let playoffs = selectedTourney.playoffVO.playoffs;
            if( playoffs ) {
                for( let po of playoffs ) {
                    if( po.round ) {
                        const ttIndex = po.round.teamNames.findIndex(t => t === previousTeamName);
                        if (ttIndex !== -1) {
                            po.round.teamNames[ttIndex] = newTeamName;
                        } 
                        if( po.round.classification ) {
                            for( let c of po.round.classification ) {
                                if( c.teamName === previousTeamName ) {
                                    c.teamName = newTeamName;
                                }
                            }
                        }
                        if( po.round.onewayMeetings ){
                            for( let m of po.round.onewayMeetings) {
                                if( m.teamName1 === previousTeamName ) {
                                    m.teamName1 = newTeamName;
                                }        
                                if( m.teamName2 === previousTeamName ) {
                                    m.teamName2 = newTeamName;
                                }        
                                let observer = this.meetingService.savePlayoffMeetingDb(m, selectedTourney.id, po.round.id, e => {});
                                observer.subscribe(m => {}, e => {});
                            }        
                        }
                        if( po.round.roundtripMeetings ){
                            for( let m of po.round.roundtripMeetings) {
                                if( m.teamName1 === previousTeamName ) {
                                    m.teamName1 = newTeamName;
                                }        
                                if( m.teamName2 === previousTeamName ) {
                                    m.teamName2 = newTeamName;
                                }
                                let observer = this.meetingService.savePlayoffMeetingDb(m, selectedTourney.id, po.round.id, e => {});
                                observer.subscribe(m => {}, e => {});     
                            }        
                        }
                    }
                }                    
            }
        }
        if( selectedTourney.playoutVO ) {
            let playouts = selectedTourney.playoutVO.playoffs;
            if( playouts ) {
                for( let po of playouts ) {
                    if( po.round ) {
                        const ttIndex = po.round.teamNames.findIndex(t => t === previousTeamName);
                        if (ttIndex !== -1) {
                            po.round.teamNames[ttIndex] = newTeamName;
                        } 
                        if( po.round.classification ) {
                            for( let c of po.round.classification ) {
                                if( c.teamName === previousTeamName ) {
                                    c.teamName = newTeamName;
                                }
                            }
                        }
                        if( po.round.onewayMeetings ){
                            for( let m of po.round.onewayMeetings) {
                                if( m.teamName1 === previousTeamName ) {
                                    m.teamName1 = newTeamName;
                                }        
                                if( m.teamName2 === previousTeamName ) {
                                    m.teamName2 = newTeamName;
                                }        
                                let observer = this.meetingService.savePlayoutMeetingDb(m, selectedTourney.id, po.round.id, e => {});
                                observer.subscribe(m => {}, e => {});     
                            }        
                        }
                        if( po.round.roundtripMeetings ){
                            for( let m of po.round.roundtripMeetings) {
                                if( m.teamName1 === previousTeamName ) {
                                    m.teamName1 = newTeamName;
                                }        
                                if( m.teamName2 === previousTeamName ) {
                                    m.teamName2 = newTeamName;
                                }        
                                let observer = this.meetingService.savePlayoutMeetingDb(m, selectedTourney.id, po.round.id, e => {});
                                observer.subscribe(m => {}, e => {});     
                            }        
                        }
                    }
                }        
            }
        }
        if( selectedTourney.eliminatoryLevels ) {
            let elList : EliminatoryLevel[] = selectedTourney.eliminatoryLevels;   
            if( elList ) {
                for( let el of elList ) {
                    let eList = el.eliminatories;
                    if( elList ) {
                        for( let e of eList ) {
                            if( e.round ) {
                                const ttIndex = e.round.teamNames.findIndex(t => t === previousTeamName);
                                if (ttIndex !== -1) {
                                    e.round.teamNames[ttIndex] = newTeamName;
                                } 
                                if( e.round.classification ) {
                                    for( let c of e.round.classification ) {
                                        if( c.teamName === previousTeamName ) {
                                            c.teamName = newTeamName;
                                        }
                                    }
                                }
                                if( e.round.onewayMeetings ) {
                                    for( let m of e.round.onewayMeetings) {
                                        if( m.teamName1 === previousTeamName ) {
                                            m.teamName1 = newTeamName;
                                        }        
                                        if( m.teamName2 === previousTeamName ) {
                                            m.teamName2 = newTeamName;
                                        }
                                        let observer = this.meetingService.saveEliminatoryMeetingDb(m, selectedTourney.id, e.round.id, e => {});
                                        observer.subscribe(m => {}, e => {});     
                                    }
                                } 
                                if( e.round.roundtripMeetings ) {
                                    for( let m of e.round.roundtripMeetings) {
                                        if( m.teamName1 === previousTeamName ) {
                                            m.teamName1 = newTeamName;
                                        }        
                                        if( m.teamName2 === previousTeamName ) {
                                            m.teamName2 = newTeamName;
                                        }        
                                        let observer = this.meetingService.saveEliminatoryMeetingDb(m, selectedTourney.id, e.round.id, e => {});
                                        observer.subscribe(m => {}, e => {});     
                                    }
                                } 
                            }
                        }
                    }
                }
            }
        }
        if( selectedTourney.eliminatoryBLevels ) {
            let elList : EliminatoryLevel[] = selectedTourney.eliminatoryBLevels;   
            if( elList ) {
                for( let el of elList ) {
                    let eList = el.eliminatories;
                    if( elList ) {
                        for( let e of eList ) {
                            if( e.round ) {
                                const ttIndex = e.round.teamNames.findIndex(t => t === previousTeamName);
                                if (ttIndex !== -1) {
                                    e.round.teamNames[ttIndex] = newTeamName;
                                } 
                                if( e.round.classification ) {
                                    for( let c of e.round.classification ) {
                                        if( c.teamName === previousTeamName ) {
                                            c.teamName = newTeamName;
                                        }
                                    }
                                }
                                if( e.round.onewayMeetings ) {
                                    for( let m of e.round.onewayMeetings) {
                                        if( m.teamName1 === previousTeamName ) {
                                            m.teamName1 = newTeamName;
                                        }        
                                        if( m.teamName2 === previousTeamName ) {
                                            m.teamName2 = newTeamName;
                                        }        
                                        let observer = this.meetingService.saveEliminatoryBMeetingDb(m, selectedTourney.id, e.round.id, e => {});
                                        observer.subscribe(m => {}, e => {});     
                                    }
                                } 
                                if( e.round.roundtripMeetings ) {
                                    for( let m of e.round.roundtripMeetings) {
                                        if( m.teamName1 === previousTeamName ) {
                                            m.teamName1 = newTeamName;
                                        }        
                                        if( m.teamName2 === previousTeamName ) {
                                            m.teamName2 = newTeamName;
                                        }        
                                        let observer = this.meetingService.saveEliminatoryBMeetingDb(m, selectedTourney.id, e.round.id, e => {});
                                        observer.subscribe(m => {}, e => {});     
                                    }
                                } 
                            }
                        } 
                    }
                }
            }            
        }
    }
}
