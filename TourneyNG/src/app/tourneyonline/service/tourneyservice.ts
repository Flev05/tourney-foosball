

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Tourney } from '../domain/tourney';
import { Meeting } from '../domain/meeting';
import { Player } from '../domain/player';
import { Round } from '../domain/round';
import { Playoff } from '../domain/playoff';
import { Team } from '../domain/team';
import { Discipline } from '../domain/discipline';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { PlayoffRule } from '../domain/playoff-rule';
import { MeetingDb } from '../domain/meeting-db';
import { LoginService } from './loginservice';
import { TourneyDb } from '../domain/tourney.db';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const tourneyUrl = 'api/tourneys';  // URL to web api
const tourneyBeUrl = 'be/tourneys';  // URL to web api
const tourneyPlayoffUrl = 'api/tourneys';  // URL to web api
const tourneyEliminationUrl = 'api/tourneys';  // URL to web api
const typologiesUrl = 'api/typologies';  // URL to web api
const meetingUrl = 'api/meetings';  // URL to web api
const meetingBeUrl = 'be/meetings';  // URL to web api

const classificationLabel = "°";

@Injectable()
export class TourneyService {

    tourneys: Tourney[];

    positionsCombobox: Combobox[];
    roundsCombobox: Combobox[];
    teamsCombobox: Combobox[];
    playoffsCombobox: Combobox[];

    selectedTourney : Tourney;
    selectedPlayer : Player;
    selectedTeam: Team;
    selectedRound : Round;
    selectedPlayoff : Playoff;
    selectedEliminatory : Eliminatory;
    selectedEliminatoryLevel: EliminatoryLevel;
    selectedMeeting : Meeting;
    availableTeams: Team[];
    selectedTeams:  Team[];

    newTourney : boolean = false;
    newPlayer : boolean = false;
    newTeam : boolean = false;
    newRound : boolean = false;
    
    newPlayoffConfig : boolean = false;

    firstTime : boolean = true;
    
    private sequenceNumber: number = 1000;
    playoffsConfig: boolean;

    originalTeams: Team[];
    meetings: Meeting[];
    isOneway: boolean;
    selectedPlayoffConfig: PlayoffRule;
    selectedIndex: number;
    newRule: boolean;

    private subject = new Subject<Meeting>();
 
    constructor(private http: HttpClient, private loginService: LoginService) { 
        console.log("Constructor of TourneyService");
        this.sequenceNumber++;
    }

    sendMessage(m: Meeting) {
        this.subject.next(m);
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<Meeting> {
        return this.subject.asObservable();
    }
    
    prepareEliminatoriesComboBoxes(): number {
        if(this.selectedTourney.rounds.length==0 && this.selectedTourney.teams.length==0) {
            return;
        }

        let min: number = 2;

        let teamsNo = this.selectedTourney.rounds.length;
        if( this.selectedTourney.rounds.length==0 ) {
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
        
        if(this.availableTeams==undefined) {
            this.availableTeams = [];
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
        if(this.selectedTourney.rounds.length>0) {
            let maxPosition = this.selectedTourney.teams.length / this.selectedTourney.rounds.length;
            if(this.selectedTourney.teams.length % this.selectedTourney.rounds.length > 0) {
                maxPosition++;
            }
            for(let p=1; p<=maxPosition; p++ ) {
                let vv: string = "" + p + classificationLabel;
                this.positionsCombobox.push({label: vv, value: p});
            }                    
        }

        return teamsNo;
    }

    public prepareLevelCombobox(teamsNo: number) : Array<Combobox> {

        this.selectedTeams = [];
        for(let t of this.selectedTourney.teams) {
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
            url = tourneyBeUrl + "?" + "userId=" + this.loginService.selectedLogin.id;
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
    loadRoundMeeting(tourneyId: number, roundId: number): Observable<Meeting[]> {
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "roundId=" + roundId + "&" + "playoffId=null";
        let url = meetingUrl + queryString;

        if(this.loginService.userLogged) {
            url = tourneyBeUrl + queryString;
        }

        return this.http.get<MeetingDb[]>(url).pipe(
            tap(_ => this.log('fetched MeetingDb url='+url)),
            catchError(this.handleError<MeetingDb[]>('loadMeetingDb url='+url))
        );
    }

    loadDisciplines (): Observable<Discipline[]> {
 
        return this.http.get<Discipline[]>(typologiesUrl)
        .pipe(
            tap(_ => this.log('fetched all typologies of the tourney')),
            catchError(this.handleError('loadTypologies', []))
          );
    }

    loadTourneyPlayoff (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyPlayoffUrl)
        .pipe(
            tap(_ => this.log('fetched all Playoff tourneys')),
            catchError(this.handleError('loadTourneyPlayoff', []))
          );
    }

    loadTourneyElimination (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(tourneyEliminationUrl)
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
    addTourney (tourney: Tourney): Observable<Tourney> {
        return this.http.post<Tourney>(tourneyUrl, tourney, httpOptions).pipe(
            tap((tourney: Tourney) => this.log('added Tourney w/ id=' + tourney.id)),
            catchError(this.handleError<Tourney>('addTourney'))
        );
    }

    /** PUT: prepare the TourneyDb by stringify of received tourney to save on the server */
    updateTourney (tourney: Tourney ): Observable<Tourney> {
        let json: string = JSON.stringify(tourney);
        let tourneyDb: TourneyDb = {id: tourney.id, json: json};

        return this.updateTourneyDb(tourneyDb);
    }

    /** PUT: update the tourney on the server */
    private updateTourneyDb (tourney: TourneyDb ): Observable<TourneyDb> {
        const id =  tourney.id;
        let url = tourneyUrl + "/" + id;

        if(this.loginService.userLogged) {
            url = tourneyBeUrl +  "/" + id;
        }

        return this.http.put(url, tourney, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(this.handleError<TourneyDb>('updateTourneyDb'))
        );
    }
    
    /** PUT: update the Meeting on the server */
    updateMeeting (m: Meeting): Observable<Meeting> {
        const id =  m.id;
        const url = meetingUrl + "/" + id;

        let json: string = JSON.stringify(m);
        let mdb: TourneyDb = {id: m.id, json: json};

        return this.updateMeetingDb(mdb);
    }

    /** PUT: update the MeetingDb on the db server */
    private updateMeetingDb (mdb: MeetingDb ): Observable<MeetingDb> {
        const id =  mdb.id;
        let url = meetingUrl + "/" + id;

        if(this.loginService.userLogged) {
            url = meetingBeUrl +  "/" + id;
        }

        return this.http.put(url, mdb, httpOptions).pipe(
            tap(_ => this.log('updated MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb>('updateMeetingDb'))
        );
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
