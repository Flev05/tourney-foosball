

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
import { TourneyDb } from '../domain/tourney.db';
import { ClientService } from './client-service';
import { TableCols } from '../domain/table-cols';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { environment } from 'environments/environment';
import { Classification } from '../domain/classification';
import { MeetingStatus } from '../domain/enumerations';
import { MeetingService } from './meeting-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const tourneyUrl = 'api/tourneys';  
const loadTourneyByClientIdUrl = tourneyUrl + '/loadByClientId';  
const loadTourneyUrl = tourneyUrl + '/loadByClientId';  
const insertTourneyUrl = tourneyUrl + '/insert';
const updateTourneyUrl = tourneyUrl + '/update';
const deleteTourneyUrl = tourneyUrl + '/delete';

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
    newRule: boolean;
    selectedTabIndex: number = 0;
    selectedRoundTabIndex: number = 0;
    selectedPlayoffTabIndex: number = 0;
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
    selectedRoundsNumCB: Combobox;
    classificationCols: TableCols[] = [
        { field: 'teamName',    header: 'Team'},
        { field: 'points',      header: 'Pt.'},
        { field: 'played',      header: 'G'},
        { field: 'won',         header: 'V'},
        { field: 'lost',        header: 'P'},
        { field: 'balanced',    header: 'N'},
        { field: 'goalsDone',   header: 'Gf:Gs'},
        { field: 'goalsDiff',   header: 'D'},
    ];

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
    loadAllTourneys(): Observable<TourneyDb[]> {
        let url = loadTourneyByClientIdUrl;

        if(this.loginService.isUserLogged) {
            url = loadTourneyByClientIdUrl + "/" + this.clientService.selectedClient.id
        }
        
        return this.http.get<TourneyDb[]>(url).pipe(
            tap(_ => this.log('fetched all tourneys from DB, url=' + url)),
            catchError(this.handleError('loadTourneyDb', []))
          );
    }

    loadTourneys(fromDate: Date, toDate: Date): any {
        let url = loadTourneyUrl;

        if(this.loginService.isUserLogged) {
            url = loadTourneyUrl + "/" + this.clientService.selectedClient.id
            + "?" + "fromDate=" + fromDate 
            + "&" + "toDate="   + toDate;
        }
        
        return this.http.get<TourneyDb[]>(url).pipe(
            tap(_ => this.log('fetched all tourneys from DB, url=' + url)),
            catchError(this.handleError('loadTourneyDb', []))
          );
    }

    loadTourneyPlayoff (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(loadTourneyUrl)
        .pipe(
            tap(_ => this.log('fetched all Playoff tourneys')),
            catchError(this.handleError('loadTourneyPlayoff', []))
          );
    }

    loadTourneyElimination (): Observable<Tourney[]> {
 
        return this.http.get<Tourney[]>(loadTourneyUrl)
        .pipe(
            tap(_ => this.log('fetched all Elimination tourneys')),
            catchError(this.handleError('loadTourneyElimination', []))
          );
    }

    /** GET hero by id. Will 404 if id not found */
    getTourney(id: number): Observable<Tourney> {
        const url = `${loadTourneyUrl}/${id}`;
        return this.http.get<Tourney>(url).pipe(
            tap(_ => this.log('fetched Tourney id='+id)),
            catchError(this.handleError<Tourney>('getTourney id='+id))
        );
    }

    /** POST: add a new tourney to the server */
    private addTourney (tourney: Tourney): Observable<Tourney> {
        let json: string = JSON.stringify(tourney);
        let tourneyDb: TourneyDb = {id: tourney.id, json: json};

        let url = insertTourneyUrl;

        return this.http.post<TourneyDb>(url, tourneyDb, httpOptions).pipe(
            tap((tourney: TourneyDb) => this.log('added Tourney url=' + url)),
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
        let url = updateTourneyUrl + id;

        return this.http.put(url, tourney, httpOptions).pipe(
            tap(_ => this.log('updated TourneyDb url=' + url)),
            catchError(this.handleError<TourneyDb>('updateTourneyDb'))
        );
    }
 
    private prepareMdb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): MeetingDb {

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
        const url = MeetingService.deleteMeetingUrl + "/" + id;

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
        const url = deleteTourneyUrl + "/" + id;

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

    containsPhase(value: string) : boolean{
        for(let i=0; i<this.selectedTourney.phases.length; i++ ) {
            if(this.selectedTourney.phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }

    newClassification(t: Team, initialPoints: number): Classification {
        return {
            id: this.getSequenceNumber(),
            team: t,
            points: initialPoints,
            played: 0,
            won: 0,
            lost: 0,
            balanced: 0,
            penalty: 0,
            goalsDone: 0,
            goalsConceded: 0,
            goalsDiff: 0
        };
    }

    createClassification(meetings: Meeting[]): Classification[] {
        let classificationMap : Map<string, Classification> = new Map<string, Classification>();

        for(let m of meetings) {

            let t1 = m.team1;
            let t2 = m.team2;
            let key1 = t1.teamName;
            let key2 = t2.teamName;

            if(!classificationMap.has(key1)) {
                let c = this.newClassification(t1, 0);
                classificationMap.set(key1, c);
            }
            let c1 = classificationMap.get(key1);            
 
            if(!classificationMap.has(key2)) {
                let c2 = this.newClassification(t2, 0);
                classificationMap.set(key2, c2);
            }
            
            if(m.status == MeetingStatus.ToPlay) {
                continue;
            }
            
            let c2 = classificationMap.get(key2);

            c1.played++;
            c2.played++;

            c1.points += m.points1;
            c2.points += m.points2;

            if (m.points1 > m.points2) {
                c1.won++;
                c2.lost++;
            }
            if (m.points2 > m.points1) {
                c2.won++;
                c1.lost++;
            }
            if (m.points1 == m.points2) {
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

        let classificationList: Classification[] = [];
        for( let c of classificationMap.values()) {
            if(c.team.teamName == "") {
                continue;
            }
            classificationList.push(c);            
        }

        classificationList = this.sortDesc(classificationList);

        return classificationList;
    }

    private sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        let sortedClassification: Array<Classification>  = unsortedClassification.sort((c1, c2) => {

            if (c1.points > c2.points) {
                return -1;
            }
            if (c1.points < c2.points) {
                return 1;
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

            return c1.team.teamName > c2.team.teamName ? 1 : -1;
        });

        return sortedClassification;
    } 

    /**
        <th>Team</th>
        <th>Pt.</th>
        <th>G</th>
        <th>V</th>
        <th>P</th>
        <th>N</th>
        <th>Gf:Gs</th>
        <th>D</th>
        <td>{{rowIndex + 1}}</td>
        <td>{{rowData.team.teamName}}</td>
        <td>{{rowData.points}}</td>
        <td>{{rowData.played}}</td>
        <td>{{rowData.won}}</td>
        <td>{{rowData.lost}}</td>
        <td>{{rowData.balanced}}</td>
        <td>{{rowData.goalsDone}}:{{rowData.goalsConceded}}</td>
        <td>{{rowData.goalsDiff}}</td>       
     */
     prepareRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            let r = 0;
            for (let c of round.classification) {

                rows.push(c);

                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName = c.team.teamName;    
                rows[row].points = c.points;    
                rows[row].played = c.played;    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDone = c.goalsDone + ":" + c.goalsConceded;
                rows[row].goalsConceded = c.goalsConceded;    
                rows[row].goalsDiff = c.goalsDone - c.goalsConceded;    

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
}
