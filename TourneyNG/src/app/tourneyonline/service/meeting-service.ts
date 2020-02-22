

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Meeting } from '../domain/meeting';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { Tourney } from '../domain/tourney';
import { Direction, MeetingStatus } from '../domain/enumerations';
import { PlayoffRule } from '../domain/playoff-rule';
import { Match } from '../domain/match';
import { AbstractService } from '../components/common/abstract-service';
import { Round } from '../domain/round';
import { DateFormatPipe } from '../components/common/date-format-pipe';
import { Playoff } from '../domain/playoff';
import { Classification } from '../domain/classification';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
const meetingUrl = 'api/meetings';  
const loadMeetingByRoundIdsUrl  = meetingUrl + '/loadByRoundIds';

const loadMeetingByPlayoffIdUrl = meetingUrl + '/loadByPlayoffId'; 
const loadMeetingByPlayoffIdsUrl = meetingUrl + '/loadByPlayoffIds'; 
const loadMeetingByEliminatoryIdUrl = meetingUrl + '/loadByEliminatoryId';  
const loadAllEliminatoryMeetingsUrl = meetingUrl + '/loadAllEliminatoryMeetingsBy';  
const loadEliminatoryMeetingByIdListUrl = meetingUrl + "/loadEliminatoryMeetingByIdList";

const insertMeetingUrl = meetingUrl + '/insert';
const updateMeetingUrl = meetingUrl + '/update';

const deleteMeetingUrl                  = meetingUrl + '/delete';
const deleteMeetingByPlayoffIdUrl       = meetingUrl + "/deletePlayoffMeetingsByTourneyId"

@Injectable()
export  class MeetingService extends AbstractService {
    protected SKIPING_TEAM = "(Riposo)";
    protected deleteRoundMeetingsByTourneyIdUrl: string = meetingUrl + "/deleteRoundMeetingsByTourneyId"
    protected deleteMeetingsByRoundIdUrl: string = meetingUrl + "/deleteMeetingsByRoundId"
    protected loadMeetingByRoundIdUrl: string   = meetingUrl + '/loadByRoundId';  

    static deleteMeetingUrl: string = deleteMeetingUrl;

    selectedTourney: Tourney;
    
    selectedMeetingDb: MeetingDb;
    selectedMeeting: Meeting;

    meetings: Meeting[];
    mdbs: Meeting[];

    isRoundTrip: boolean;
    meetingsNoMsg: string;

    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
    onewayDays: any[];
    
    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    goBackFromMeeting: boolean = false;

    selectedRound: Round;
    allDaysNo: number;
    mdbList: MeetingDb[];

    constructor( protected http: HttpClient
        , protected router: Router
        , protected dateFormatPipe: DateFormatPipe) 
    { 
        super();
        console.log("Constructor of MeetingService");
    }

    public extractRoundMeetings(round: Round, mdbList: MeetingDb[] ) {
        round.onewayMeetings = [];
        round.roundtripMeetings = [];
        for (let mdb of mdbList) {
            if( mdb.roundId != round.id) {
                continue;
            }
            let m: Meeting = JSON.parse(mdb.json);
            m.id = mdb.id;
            if (m.direction == Direction.OneWay) {
                round.onewayMeetings.push(m);
            }
            else {
                round.roundtripMeetings.push(m);
            }
        }

        round.onewayMeetings    = MeetingService.sortMeetings(round.onewayMeetings);
        round.roundtripMeetings = MeetingService.sortMeetings(round.roundtripMeetings);
    }

    public extractPlayoffMeetings(playoff: Playoff, mdbList: MeetingDb[] ) {
        let round = playoff.round;
        round.onewayMeetings = [];
        round.roundtripMeetings = [];
        for (let mdb of mdbList) {
            if(playoff.id != mdb.playoffId) {
                continue;
            }
            let m: Meeting = JSON.parse(mdb.json);
            m.id = mdb.id;
            if(m.direction == undefined) {
                continue;
            }
            if (m.direction == Direction.OneWay) {
                round.onewayMeetings.push(m);
            }
            else {
                round.roundtripMeetings.push(m);
            }
        }

        round.onewayMeetings    = MeetingService.sortMeetings(round.onewayMeetings);
        round.roundtripMeetings = MeetingService.sortMeetings(round.roundtripMeetings);
    }

    
    /** 
     * Loads all the meetings of the receìved tourney id
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadRoundMeetings(tourneyId: number, roundsIds: Array<number>, error: (error: any) => any ) : Observable<MeetingDb[]> {

        let url = loadMeetingByRoundIdsUrl + "/" + tourneyId ;

        console.log("Url=" + url);

        let obs = this.http.post<MeetingDb[]>(url, roundsIds, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('loadRoundMeetings, url=' + url)),
            catchError(error('addMeetingDb, url=' + url))
        );
        return obs;
    }
    /** 
     * Loads all the meetings of the receìved tourney and playoff ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadPlayoffMeeting(tourneyId: number, playoffId: number, error: (error: any) => any) : Observable<MeetingDb[]> {

        let url = loadMeetingByPlayoffIdUrl + "/" + tourneyId + "/" + playoffId;

        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(error('loadPlayoffMeetingDb url=' + url))
        );

        return obs;
    }
    
    /** 
     * Loads all the meetings of the receìved tourney id
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadPlayoffMeetings(tourneyId: number, playoffIds: Array<number>, error: (error: any) => any) : Observable<MeetingDb[]> {

        let url = loadMeetingByPlayoffIdsUrl + "/" + tourneyId ;

        console.log("Url=" + url);

        let obs = this.http.post<MeetingDb[]>(url, playoffIds, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('loadPlayoffMeetings, url=' + url)),
            catchError(error('addMeetingDb, url=' + url))
        );
        return obs;
    }


    /** 
     * Loads all the meetings of the receìved tourney and eliminatory ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeeting(tourneyId: number, eliminatoryId: number, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadMeetingByEliminatoryIdUrl + "/" + tourneyId + "/" + eliminatoryId;
        
        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(error('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney  related where eliminatory are not null
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadAllEliminatoryMeeting(tourneyId: number, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadAllEliminatoryMeetingsUrl + "/" + tourneyId;
        
        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(error('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney id and eliminatory id list
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeetingByIdList(tourneyId: number, eliminiatoryIdList: number[], error: (e: any) => any) : Observable<MeetingDb[]> {
        let url = loadEliminatoryMeetingByIdListUrl + "/" + tourneyId;
        
        console.log("Url=" + url);

        let obs = this.http.post<MeetingDb[]>(url, eliminiatoryIdList, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('added MeetingDb, url=' + url)),
            catchError(error('addMeetingDb, url=' + url))
        );
        return obs;
    }

    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    public prepareMeetingsMap(round : Round, isAdmin: boolean ): void {
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for( let m of round.onewayMeetings ) {

            m.dateAndTime = this.dateFormatPipe.transform(m.datetime, isAdmin);
            m.containerId = round.id;

            let key = m.day;
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);
            meetingList.push(m);
        }

        for( let m of round.roundtripMeetings ) {

            m.dateAndTime = this.dateFormatPipe.transform(m.datetime, isAdmin);
            m.containerId = round.id;

            let key = m.day;
            if(!this.roundtripMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.roundtripMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.roundtripMeetingDaysMap.get(key);
            meetingList.push(m);
        }
    }

    saveRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, roundId, null, null);
        } else {
            return this.updateMeetingDb(m, tourneyId, roundId, null, null, error);
        }
    }

    savePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, null, playoffId, null);
        } else {
            return this.updateMeetingDb(m, tourneyId, null, playoffId, null, error);
        }
    }

    saveEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, null, null, eliminatoryId);
        } else {
            return this.updateMeetingDb(m, tourneyId, null, null, eliminatoryId, error);
        }
    }

    private addMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);

        return this.addMeeting(mdb);
    }

    prepareRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, roundId, null, null);
    }
    preparePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, playoffId, null);
    }
    prepareEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, null, eliminatoryId);
    }

    private prepareMdb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): MeetingDb {
        let mdb: MeetingDb = {
              id: m.id
            , tourneyId: tourneyId
            , roundId: roundId
            , playoffId: playoffId
            , eliminatoryId: eliminatoryId
            , country: m.country
            , json: JSON.stringify(m)
        }
        return mdb;
    }

    /** POST: add a new MeetingDb to the db server */
    private addMeeting (mdb: MeetingDb):  Observable<MeetingDb> {
        let url = insertMeetingUrl;

        let obs = this.http.post<MeetingDb>(url, mdb, httpOptions).pipe(
            tap((m: MeetingDb) => this.log('added MeetingDb, url=' + url)),
            catchError(this.handleError<MeetingDb>('addMeetingDb, url=' + url))
        );
        return obs;
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

    private updateMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number
        , error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }
 
    /** PUT: update the MeetingDb on the db server */
    updateMeetingMdb (mdb: MeetingDb, error: (error: any) => any): Observable<MeetingDb> {
        let url = updateMeetingUrl;

        return this.http.put(url, mdb, httpOptions).pipe(
            tap(_ => this.log('updated updateMeetingMdb url=' + url)),
            catchError(error == null ? this.handleError<Meeting>('deletingMeeting: ' + url) : error )
        );
    }

    deleteUnusedMeetings(meetings: Meeting[] ): void {
        for(let m of meetings) {
            this.deleteMeeting(m);
        }
    }

    /** DELETE: delete the MeetingDb from the server */
    deleteMeeting (m: Meeting ): void {
        let id: number = m.id;
        const url = deleteMeetingUrl + "/" + id;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb:' + url)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + url))
        );

        obs.subscribe();
    }

    deleteRoundMeetingsByTourneyId (tourneyId: number ): void {
        const url = this.deleteRoundMeetingsByTourneyIdUrl + "/" + tourneyId;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb: ' + url)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + url))
        );

        obs.subscribe();
    }
     
    deletePlayoffMeetingsByTourneyId (tourneyId: number ): void {
        const url = deleteMeetingByPlayoffIdUrl + "/" + tourneyId;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb: ' + url)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + url))
        );

        obs.subscribe();
    }

    protected handleError<T> (operation = 'operation', result?: T): any {
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
    protected log(message: string) {
        console.log('TourneyService: ' + message);
    }

    /**
     * Sorts the incoming meeting array by the day number and date of each meeting.
     * When the day is the same, the sorting is by the date of the meeting in the same day
     * 
     * @param meetings the array of the meetings to sort
     */
    public static sortMeetings(meetings: Meeting[]): Meeting[] {
        return meetings.sort((m1, m2) => {
            if( m1.day > m2.day )  {
                return 1;
            }
            if( m1.day < m2.day )  {
                return -1;
            }
            if (m1.datetime > m2.datetime) {
                return 1;
            }
            if (m1.datetime < m2.datetime) {
                return -1;
            }
            return 0;
        });
    }

    public newMeeting(t1: string, t2: string, day: number, d: Direction, skiping: boolean): Meeting {
        let m = this.createMeeting(t1, t2, null, null, day, d, skiping);
        return m;
    }
    
    public createMeeting(t1: string, t2: string, pr1: PlayoffRule, pr2: PlayoffRule, day: number, d: Direction, skiping: boolean): Meeting {
        let matches = new Array<Match>();

        for(let i=0; i<this.selectedTourney.maxMatchesPerMeeting; i++) {
            let m: Match = {id:i
                ,players1: []
                ,players2: []
                ,score1:0
                ,score2:0
            };
            matches.push(m);
        }

        let name = "";
        if(t1!=null) {
            name = t1;
            if(t2!=null) {
                name += " - " + t2; 
            }
        } else {
            if(t2!=null) {
                name = t2; 
            }
        }

        let ruleName = this.makeRuleName(pr1, pr2);
        
        let m : Meeting = {
            id: null,
            name: name,
            isDummy: pr1 == null ? true : pr1.isDummy || pr2 == null ? true :  pr2.isDummy,
            isSkiping: skiping,
            direction: d,
            datetime: this.selectedTourney.datetime,
            dateAndTime: this.dateFormatPipe.transform(this.selectedTourney.datetime),
            address:  this.selectedTourney.address,
            country:  this.selectedTourney.country,
            day: day,
            teamName1: t1,
            teamName2: t2,
            points1: skiping ? -1 : 0,
            points2: skiping ? -1 : 0,
            rule1: pr1,
            rule2: pr2,
            ruleName: ruleName,
            status: MeetingStatus.ToPlay,
            matches: matches
        };

        return m;
    }
        
    protected makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
        return "";
    }
   
    public saveMeetingNext(mdb:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(mdb);
        m.id = mdb.id;
    }
    
    public sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
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

            return c1.teamName > c2.teamName ? 1 : -1;
        });

        return sortedClassification;
    } 

    /**
     * Creates a matrix of best classification of the teams received in the rounds parameter.
     * The matrix contains in the first row the best first classification teams, in the seconds
     * row the second best classification teams and so on.
     * 
     * The matrix has to accessed by 2 indexes:
     * - the band position to select the row
     * - tne position to select the team in the row
     * 
     * @param rounds the rounds containing the teams to make the matrix
     */
    public createRoundMatrix(rounds: Array<Round>): Array<Array<Classification>>  {
        let roundMatrix: Array<Array<Classification>> = new Array<Array<Classification>>();

        for( let i=0; i<rounds[0].classification.length; i++ ) {
            let bestClassifications: Array<Classification> = new Array<Classification>();
            for(let r of rounds) {
                r.classification = this.sortDesc(r.classification);

                bestClassifications.push(r.classification[i]);    
            }
            bestClassifications = this.sortDesc(bestClassifications);
            
            let row: Array<Classification> = new Array<Classification>();
            roundMatrix.push(row);

            for(let c of bestClassifications) {
                row.push(c);
            }
        }
        return roundMatrix;
    }

    /**
     * Resolves, for the automatic playoff mode, the team names of the received meeting and round list applying the rule in the same meeting
     * 
     * @param m the meeting the name to resolve with
     * @param rounds the list of the rounds from which take the round names
     */
    public resolveAutomaticRules( m: Meeting, rounds: Round[] ): void {
        m.dateAndTime = this.dateFormatPipe.transform(m.datetime, false);
        let roundMatrix: Array<Array<Classification>> = this.createRoundMatrix(rounds);

        let row = m.rule1.fromRound.bandPosition;
        let col = m.rule1.fromRound.position.value;
        m.ruleName1 = m.rule1.ruleName;

        if( m.rule1.isDummy ) {
            m.teamName1 = m.rule1.fromRound.round.label;
        } else {
            m.teamName1 = roundMatrix[row-1][col-1].teamName;
        }

        row = m.rule2.fromRound.bandPosition;
        col = m.rule2.fromRound.position.value;
        m.ruleName2 = m.rule2.ruleName;
        
        if( m.rule2.isDummy ) {
            m.teamName2 =  m.rule2.fromRound.round.label;
        } else {
            m.teamName2 = roundMatrix[row-1][col-1].teamName;
        }
        m.name = m.teamName1 + " - " + m.teamName2;
    }
    
    public sortMeeting(m1: Meeting, m2: Meeting): number {
        if( m1.day > m2.day ) {
            return 1;
        }
        if( m1.day < m2.day ) {
            return -1;
        }
        if( m1.datetime > m2.datetime ) {
            return 1;
        }
        if( m1.datetime < m2.datetime ) {
            return -1;
        }
        if( m1.teamName1 > m2.teamName1 ) {
            return 1;
        }
        if( m1.teamName1 < m2.teamName1 ) {
            return -1;
        }
        if( m1.teamName2 > m2.teamName2 ) {
            return 1;
        }
        if( m1.teamName2 < m2.teamName2 ) {
            return -1;
        }
        return 0;
    }

}
