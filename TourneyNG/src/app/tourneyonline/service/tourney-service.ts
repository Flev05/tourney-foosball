

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { Round } from '../domain/round';
import { Playoff } from '../domain/playoff';
import { Team } from '../domain/team';
import { Discipline } from '../domain/discipline';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { PlayoffRule } from '../domain/playoff-rule';
import { Meeting } from '../domain/meeting';
import { LoginService } from './login-service';
import { TourneyDb } from '../domain/tourney.db';
import { ClientService } from './client-service';
import { TableCols } from '../domain/table-cols';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { environment } from 'environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const tourneyUrl = 'api/tourneys';  // URL to web api
const typologiesUrl = 'api/typologies';  // URL to web api
const meetingUrl = 'api/meetings';  // URL to web api

const classificationLabel = "°";

@Injectable()
export class TourneyService {
    tourneys: Tourney[];

    positionsCombobox: Combobox[];
    roundsCombobox: Combobox[];
    teamsCombobox: Combobox[];
    playoffsCombobox: Combobox[];

    selectedTourney : Tourney;
    selectedRound : Round;
    selectedPlayoff : Playoff;
    selectedEliminatory : Eliminatory;
    selectedEliminatoryLevel: EliminatoryLevel;

    selectedMeetingDb: MeetingDb;
    selectedMeeting: Meeting;

    selectedTeams:  Team[];

    newTourney : boolean = false;
    newRound : boolean = false;
    
    newPlayoffConfig : boolean = false;

    firstTime : boolean = true;
    regenerateStandaloneTopLevel: boolean = true;
    
    private sequenceNumber: number = 1000;
    playoffsConfig: boolean;

    originalTeams: Team[];
    meetings: Meeting[];
    mdbs: Meeting[];
    isOneway: boolean;
    selectedPlayoffConfig: PlayoffRule;
    selectedIndex: number;
    newRule: boolean;
    selectedTabIndex: number = 0;
    isStandalone: boolean;
    selectedEliminatoryLevelIndex: number;
    selectedEliminatoryIndex: number;
 
    static roundCols: TableCols[] = [
        { field: 'name',   header: 'Girone' },
    ];

    static playoffCols: TableCols[] = [
        { field: 'playoffName',   header: 'Playoff' },
    ];
    redirect: string;

    selectedTeams4PlayoffsCB: Combobox;
    selectedPlayoffsCB: Combobox;
    // selectedTeams4RoundsCB: Combobox;
    selectedRoundsNumCB: Combobox;

    constructor(private http: HttpClient
        , protected router: Router
        , private loginService: LoginService
        , private clientService: ClientService) 
    { 
        console.log("Constructor of TourneyService");
        this.sequenceNumber++;
    }

    prepareEliminatoriesComboBoxes(): number {
        if(this.selectedTourney.rounds.length==0 && this.selectedTourney.teams.length==0) {
            return;
        }

        if(this.selectedEliminatoryLevel==undefined) {
            this.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[0];
        }

        let min: number = 2;

        let teamsNo = this.selectedTourney.rounds.length;
        if( this.selectedTourney.rounds.length == 0 ) {
            teamsNo = this.selectedTourney.teams.length;
        } else {
            teamsNo = 0;
            for( let r of this.selectedTourney.rounds ){
                teamsNo += r.teams.length;
            }
            if(this.selectedTourney.rounds.length > min) {
                min = this.selectedTourney.rounds.length;
            } 
        }

        let max: number = this.selectedTourney.teams.length;
    
        let all = {label: "Tutte", value: max};
        this.teamsCombobox = [];
        this.teamsCombobox.push(all);
        for(let i=min; i<=max; i++) {
            this.teamsCombobox.push({label: "" + i, value: i});
        }
        
        this.roundsCombobox = [];
        this.roundsCombobox.push({label: "", value: 0});
            
        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r=this.selectedTourney.rounds[i];
            this.roundsCombobox.push({label: r.name, value: r.id});
        }

        if(this.selectedTourney.playoffs.length > 0) {
            this.playoffsCombobox = [];
            this.playoffsCombobox.push({label: "", value: 0});
            for(let i=0; i<this.selectedTourney.playoffs.length; i++) {
                let r=this.selectedTourney.playoffs[i];
                this.playoffsCombobox.push({label: r.round.name, value: r.id});
            }
        }

        this.positionsCombobox = [{label: "", value: 0}];
        if(this.selectedTourney.rounds.length > 0) {
            let maxPosition = this.selectedTourney.teams.length / this.selectedTourney.rounds.length;
            if(this.selectedTourney.teams.length % this.selectedTourney.rounds.length > 0) {
                maxPosition++;
            }
            for(let p=1; p<=maxPosition; p++ ) {
                let vv: string = "" + p + classificationLabel;
                this.positionsCombobox.push({label: vv, value: p});
            }                    
        }

        if(this.selectedTourney.selectedTeamsNumCombobox == undefined) {
            this.selectedTourney.selectedTeamsNumCombobox = this.teamsCombobox[0];
        }

        return teamsNo;
    }

    public prepareLevelCombobox(teamsNo: number) : Array<Combobox> {

        this.selectedTeams = [];
        for(let i=0; i<teamsNo; i++) {
            let t = this.selectedTourney.teams[i];
            this.selectedTeams.push(t);
        }

        let levelNo = Math.ceil(Math.log2(teamsNo));
        let levelsCombobox = new Array<Combobox>();
        for (let l = levelNo; l > 0 ; l--) {
            let lev = "";
            if (l >= 5) {
                lev = Math.pow(2, l-1) + "-esimi di finale";
            }
            if (l == 4) {
                lev = "Ottavi di finale";
            }
            if (l == 3) {
                lev = "Quarti di finale";
            }
            if (l == 2) {
                lev = "Semi finale";
            }
            if (l == 1) {
                lev = "Finalissima 1° e 2° posto";
            }
            let si: Combobox = { label: lev, value: l };
            levelsCombobox.push(si);
        }
        return levelsCombobox;
    }

    power2Padding(length: number): number {
        let levelNo = Math.ceil(Math.log2(length));
        let min = Math.pow(2, levelNo);

        return min;
    }

    getSequenceNumber() {
        return this.sequenceNumber++;
    }

    /**
     * Loads all tourneys published from the database
     */
    loadAllTourneys (): Observable<TourneyDb[]> {
        let url = tourneyUrl;

        if(this.loginService.userLogged) {
            url = tourneyUrl + "?" + "clientId=" + this.clientService.selectedClientOption.value;
        }
        
        return this.http.get<TourneyDb[]>(url).pipe(
            tap(_ => this.log('fetched all tourneys from DB, url=' + url)),
            catchError(this.handleError('loadTourneyDb', []))
          );
    }

    loadTourneys(fromDate: Date, toDate: Date): any {
        let url = tourneyUrl;

        if(this.loginService.userLogged) {
            url = tourneyUrl 
            + "?" + "clientId=" + this.clientService.selectedClientOption.value
            + "&" + "fromDate=" + fromDate 
            + "&" + "toDate="   + toDate;
        }
        
        return this.http.get<TourneyDb[]>(url).pipe(
            tap(_ => this.log('fetched all tourneys from DB, url=' + url)),
            catchError(this.handleError('loadTourneyDb', []))
          );
    }

    /** 
     * Loads all the meetings of the receìved tourney and round
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadRoundMeeting(tourneyId: number, roundId: number) :  Observable<MeetingDb[]> {
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "roundId=" + roundId + "&" + "playoffId=0";
        let url = meetingUrl + queryString;
        
        if(this.loginService.userLogged) {
            url = tourneyUrl + queryString;
        }
        
        const obs :Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadRoundMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney and playoff ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadPlayoffMeeting(tourneyId: number, playoffId: number) : Observable<MeetingDb[]> {
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "playoffId=" + playoffId + "&" + "roundId=1";
        let url = meetingUrl + queryString;

        if(this.loginService.userLogged) {
            url = tourneyUrl + queryString;
        }
        
        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadPlayoffMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney and eliminatory ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeeting(tourneyId: number, eliminatoryId: number) : Observable<MeetingDb[]> {
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "eliminatoryId=" + eliminatoryId;
        let url = meetingUrl + queryString;

        if(this.loginService.userLogged) {
            url = tourneyUrl + queryString;
        }
        
        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }
    
    loadDisciplines (): Observable<Discipline[]> {
        return this.http.get<Discipline[]>(typologiesUrl)
        .pipe(
            tap(_ => this.log('fetched all typologies of the tourney')),
            catchError(this.handleError('loadTypologies', []))
          );
    }

    loadTourneyPlayoff (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyUrl)
        .pipe(
            tap(_ => this.log('fetched all Playoff tourneys')),
            catchError(this.handleError('loadTourneyPlayoff', []))
          );
    }

    loadTourneyElimination (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyUrl)
        .pipe(
            tap(_ => this.log('fetched all Elimination tourneys')),
            catchError(this.handleError('loadTourneyElimination', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTourney(id: number): Observable<Tourney> {
        const url = `${tourneyUrl}/${id}`;
        return this.http.get<Tourney>(url).pipe(
            tap(_ => this.log('fetched Tourney id='+id)),
            catchError(this.handleError<Tourney>('getTourney id='+id))
        );
    }

    /** POST: add a new tourney to the server */
    private addTourney (tourney: Tourney): Observable<Tourney> {
        let json: string = JSON.stringify(tourney);
        let tourneyDb: TourneyDb = {id: tourney.id, json: json};

        return this.http.post<TourneyDb>(tourneyUrl, tourneyDb, httpOptions).pipe(
            tap((tourney: TourneyDb) => this.log('added Tourney w/ id=' + tourney.id)),
            catchError(this.handleError<TourneyDb>('addTourney'))
        );
    }

    /** PUT: prepare the TourneyDb by stringify of received tourney to save on the server */
    private updateTourney (tourney: Tourney ): Observable<Tourney> {
        let json: string = JSON.stringify(tourney);
        let tourneyDb: TourneyDb = {id: tourney.id, json: json};

        return this.updateTourneyDb(tourneyDb);
    }

    saveTourney (tourney: Tourney ): Observable<Tourney> {
        if(tourney.id == null) {
            if(environment.inMemoryDataService) {
                tourney.id = this.getSequenceNumber();
            }
            return this.addTourney(tourney);
        }
        return this.updateTourney(tourney);
    }

    /** PUT: update the tourney on the server */
    private updateTourneyDb (tourney: TourneyDb ): Observable<TourneyDb> {
        const id =  tourney.id;
        let url = tourneyUrl + "/" + id;

        if(this.loginService.userLogged) {
            url = tourneyUrl +  "/" + id;
        }

        return this.http.put(url, tourney, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(this.handleError<TourneyDb>('updateTourneyDb'))
        );
    }

    saveRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.getSequenceNumber();
            }

            this.addMeetingDb(m, tourneyId, roundId, 0, 0)
        } else {
            this.updateMeetingDb(m, tourneyId, roundId, 0, 0)
        }
    }

    savePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.getSequenceNumber();
            }
            this.addMeetingDb(m, tourneyId, 1, playoffId, 0)
        } else {
            this.updateMeetingDb(m, tourneyId, 1, playoffId, 0)
        }
    }

    saveEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.getSequenceNumber();
            }
            this.addMeetingDb(m, tourneyId, 0, 0, eliminatoryId)
        } else {
            this.updateMeetingDb(m, tourneyId, 0, 0, eliminatoryId)
        }
    }

    private addMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): void {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);

        this.addMeeting(mdb);
    }

    prepareMdb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): MeetingDb {

        let mdb: MeetingDb = {
              id: m.id
            , tourneyId: tourneyId
            , roundId: roundId
            , playoffId: playoffId
            , eliminatoryId: eliminatoryId
            , json: JSON.stringify(m)
        }

        return mdb;
    }

    /** POST: add a new MeetingDb to the db server */
    private addMeeting (mdb: MeetingDb): void {
        let url = meetingUrl;

        let obs = this.http.post<MeetingDb>(url, mdb, httpOptions).pipe(
            tap((m: MeetingDb) => this.log('added MeetingDb, url=' + url)),
            catchError(this.handleError<MeetingDb>('addMeetingDb, url=' + url))
        );
        obs.subscribe();
    }

    completeRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number): MeetingDb {
        return this.prepareMdb(m, tourneyId, roundId, 0, 0);
    }

    completePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number): MeetingDb {
        return this.prepareMdb(m, tourneyId, 1, playoffId, 0);
    }

    completeEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number): MeetingDb {
        return this.prepareMdb(m, tourneyId, 0, 0, eliminatoryId);
    }

    private updateMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number) {
        let mdb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);
        let obs = this.updateMeetingMdb(mdb);
        obs.subscribe();
    }

    /** PsUT: update the MeetingDb on the server */
    // updateMeeting (m: Meeting):  Observable<Meeting> {

    //     let obs = this.updateMeetingMdb(mdb);

    //     return obs;
    // }

    /** PUT: update the MeetingDb on the db server */
    updateMeetingMdb (mdb: MeetingDb ): Observable<MeetingDb> {
        const id =  mdb.id;
        let url = meetingUrl + "/" + id;

        if(this.loginService.userLogged) {
            url = tourneyUrl +  "/" + id;
        }

        return this.http.put(url, mdb, httpOptions).pipe(
            tap(_ => this.log('updated MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb>('updateMeetingDb'))
        );
    }

    doRoundDelete(round: Round): void {
        console.log("doDelete(): " + round.name);
        let popup = 'Sicuro di voler rimuovere il girone: ' + round.name + "?";

        if(confirm(popup)) {
            let index: number = this.selectedTourney.rounds.indexOf(round);
            if(index > -1) {
                let rounds: Round[] = this.selectedTourney.rounds.splice(index, 1);
                for(let r of rounds) {
                    this.removeRound(r);
                }
                this.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
            }
        }
    }

    doPlayoffDelete(playoff: Playoff): any {
        console.log(playoff);
        let popup = 'Sicuro di voler rimuovere la regola di playoff: '+ playoff.playoffName + "?";

        if(confirm(popup)) {

            for( let m of playoff.round.onewayMeetings) {
                this.deleteMeeting(m);
            }

            let index = this.selectedTourney.playoffs.indexOf(playoff);
            if(index > -1) {
                this.selectedTourney.playoffs.splice(index, 1);
                this.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
            }
            
        }
    }

    private next(n:any) {
    }

    private onError(n:any) {
        let msgerr : string = 'MeetingDb reload failed';
        console.log(msgerr);
    }

    private removeRound(r: Round): any {
        for(let m of r.onewayMeetings) {
            this.deleteMeeting(m);
        }

        r.onewayMeetings = [];
    }

    deleteUnusedMeetings(meetings: Meeting[] ): void {
        for(let m of meetings) {
            this.deleteMeeting(m);
        }
    }

    /** DELETE: delete the MeetingDb from the server */
    private deleteMeeting (m: Meeting ): void {
        let id: number = m.id;
        const url = meetingUrl + "/" + id;

        let json = url + ", " + m.name;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb:' + json)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + json))
        );

        obs.subscribe();
    }
    
    /** DELETE: delete the tourney from the server */
    deleteTourney (tourney: Tourney | number): Observable<Tourney> {
        const id = typeof tourney === 'number' ? tourney : tourney.id;        
        const url = tourneyUrl + "/" + id;

        return this.http.delete<Tourney>(url, httpOptions).pipe(
            tap(_ => this.log('deleted Tourney id=' + id)),
            catchError(this.handleError<Tourney>('deleteTourney'))
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
}
