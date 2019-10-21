

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Meeting } from '../domain/meeting';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { Tourney } from '../domain/tourney';
import { Team } from '../domain/team';
import { Direction, MeetingStatus } from '../domain/enumerations';
import { PlayoffRule } from '../domain/playoff-rule';
import { Match } from '../domain/match';
import { AbstractService } from '../components/common/abstract-service';
import { Round } from '../domain/round';
import { DateFormatPipe } from '../components/common/date-format-pipe';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
const meetingUrl = 'api/meetings';  
const loadMeetingByRoundIdUrl   = meetingUrl + '/loadByRoundId';  
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
    protected deleteRoundMeetingsByTourneyIdUrl: string = meetingUrl + "/deleteRoundMeetingsByTourneyId"
    protected deleteMeetingsByRoundIdUrl: string = meetingUrl + "/deleteMeetingsByRoundId"

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

    allDaysNo: number;
    mdbList: MeetingDb[];

    onewayMeetings: Meeting[] = [];
    roundtripMeetings: Meeting[] = [];
    
    constructor( protected http: HttpClient, protected router: Router, protected dateFormatPipe: DateFormatPipe) 
    { 
        super();
        console.log("Constructor of MeetingService");
    }

    public extractRoundMeetings(round : Round, mdbList: MeetingDb[] ) {
        round.onewayMeetings = [];
        round.roundtripMeetings = [];
        for (let mdb of mdbList) {
            let m: Meeting = JSON.parse(mdb.json);
            m.id = mdb.id;
            if (m.direction == Direction.OneWay) {
                round.onewayMeetings.push(m);
            }
            else {
                round.roundtripMeetings.push(m);
            }
        }
    }

    /** 
     * Loads all the meetings of the receìved tourney and round
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadRoundMeeting(tourneyId: number, roundId: number) :  Observable<MeetingDb[]> {
        let url = loadMeetingByRoundIdUrl + "/" + tourneyId + "/" + roundId;

        console.log("Url=" + url);

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

        let url = loadMeetingByPlayoffIdUrl + "/" + tourneyId + "/" + playoffId;

        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadPlayoffMeetingDb url=' + url))
        );

        return obs;
    }
    
    /** 
     * Loads all the meetings of the receìved tourney id
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadPlayoffMeetings(tourneyId: number, playoffIds: Array<number> ) : Observable<MeetingDb[]> {

        let url = loadMeetingByPlayoffIdsUrl + "/" + tourneyId ;

        console.log("Url=" + url);

        let obs = this.http.post<MeetingDb[]>(url, playoffIds, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('loadPlayoffMeetings, url=' + url)),
            catchError(this.handleError<MeetingDb[]>('addMeetingDb, url=' + url))
        );
        return obs;
        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney and eliminatory ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeeting(tourneyId: number, eliminatoryId: number) : Observable<MeetingDb[]> {
        let url = loadMeetingByEliminatoryIdUrl + "/" + tourneyId + "/" + eliminatoryId;
        
        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney  related where eliminatory are not null
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadAllEliminatoryMeeting(tourneyId: number) : Observable<MeetingDb[]> {
        let url = loadAllEliminatoryMeetingsUrl + "/" + tourneyId;
        
        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney id and eliminatory id list
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeetingByIdList(tourneyId: number, eliminiatoryIdList: number[]) : Observable<MeetingDb[]> {
        let url = loadEliminatoryMeetingByIdListUrl + "/" + tourneyId;
        
        console.log("Url=" + url);

        let obs = this.http.post<MeetingDb[]>(url, eliminiatoryIdList, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('added MeetingDb, url=' + url)),
            catchError(this.handleError<MeetingDb[]>('addMeetingDb, url=' + url))
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
            if(isAdmin) {
                if( m.points1 > 0 || m.points2 > 0 ) {
                    m.dateAndTime = m.points1 + " - " + m.points2;
                }
            }

            let key = m.day;
            // console.log( key + "° Giornata di andata");
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);
            meetingList.push(m);
        }

        for( let m of round.roundtripMeetings ) {

            m.dateAndTime = this.dateFormatPipe.transform(m.datetime, isAdmin);
            if(isAdmin) {
                if( m.points1 > 0 || m.points2 > 0 ) {
                    m.dateAndTime = m.points1 + " - " + m.points2;
                }
            }
            
            let key = m.day;
            console.log( key + "° Giornata di ritorno");
            if(!this.roundtripMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.roundtripMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.roundtripMeetingDaysMap.get(key);
            meetingList.push(m);
        }
    }

    saveRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, roundId, null, null);
        } else {
            return this.updateMeetingDb(m, tourneyId, roundId, null, null);
        }
    }

    savePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, null, playoffId, null)
        } else {
            return this.updateMeetingDb(m, tourneyId, null, playoffId, null)
        }
    }

    saveEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, null, null, eliminatoryId)
        } else {
            return this.updateMeetingDb(m, tourneyId, null, null, eliminatoryId)
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

    private updateMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);
        let obs = this.updateMeetingMdb(mdb);
        return obs;
    }
 
    /** PUT: update the MeetingDb on the db server */
    updateMeetingMdb (mdb: MeetingDb ): Observable<MeetingDb> {
        let url = updateMeetingUrl;

        return this.http.put(url, mdb, httpOptions).pipe(
            tap(_ => this.log('updated updateMeetingMdb url=' + url)),
            catchError(this.handleError<MeetingDb>('updateMeetingMdb'))
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

    protected handleError<T> (operation = 'operation', result?: T) {
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

    protected sortMeetings(meetings: any[]): any[] {
        return meetings.sort((m1, m2) => {
            if (m1.dateAndTime > m2.dateAndTime) {
                return 1;
            }
            if (m1.dateAndTime < m2.dateAndTime) {
                return -1;
            }
            return 0;
        });
    }

    public newMeeting(t1: Team, t2: Team, day: number, d: Direction): Meeting {
        let m = this.createMeeting(t1, t2, null, null, day, d);
        return m;
    }
    
    createMeeting(t1: Team, t2: Team, pr1: PlayoffRule, pr2: PlayoffRule, day: number, d: Direction): Meeting {
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
            name = t1.teamName;
            if(t2!=null) {
                name += " - " + t2.teamName; 
            }
        } else {
            if(t2!=null) {
                name = t2.teamName; 
            }
        }

        let ruleName = this.makeRuleName(pr1, pr2);
        
        let m : Meeting = {
            id: null,
            name: name,
            direction: d,
            datetime: this.selectedTourney.datetime,
            address:  this.selectedTourney.address,
            country:  this.selectedTourney.country,
            day: day,
            team1: t1,
            team2: t2,
            points1: 0,
            points2: 0,
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
}
