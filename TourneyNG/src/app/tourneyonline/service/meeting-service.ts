

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Meeting } from '../domain/meeting';
import { LoginService } from './login-service';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { TourneyService } from './tourney-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
const meetingUrl = 'api/meetings';  
const loadMeetingByRoundIdUrl   = meetingUrl + '/loadByRoundId';  
const loadMeetingByPlayoffIdUrl = meetingUrl + '/loadByPlayoffId'; 
const loadMeetingByEliminatoryIdUrl    = meetingUrl + '/loadByEliminatoryId';  
const insertMeetingUrl = meetingUrl + '/insert';
const updateMeetingUrl = meetingUrl + '/update';
const deleteMeetingUrl = meetingUrl + '/delete';

@Injectable()
export class MeetingService {

    static deleteMeetingUrl: string = deleteMeetingUrl;
    
    selectedMeetingDb: MeetingDb;
    selectedMeeting: Meeting;

    meetings: Meeting[];
    mdbs: Meeting[];

    constructor(private http: HttpClient, protected router: Router) { 
        console.log("Constructor of TourneyService");
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
        const queryString = "?" + "playoffId=" + playoffId;

        let url = loadMeetingByPlayoffIdUrl + "/" + tourneyId + "/" + playoffId;

        console.log("Url=" + url);

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
        let url = loadMeetingByEliminatoryIdUrl + "/" + tourneyId + "/" + eliminatoryId;
        
        console.log("Url=" + url);

        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
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
        const id =  mdb.id;
        let url = updateMeetingUrl;

        return this.http.put(url, mdb, httpOptions).pipe(
            tap(_ => this.log('updated MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb>('updateMeetingDb'))
        );
    }

    deleteUnusedMeetings(meetings: Meeting[] ): void {
        for(let m of meetings) {
            this.deleteMeeting(m);
        }
    }

    /** DELETE: delete the MeetingDb from the server */
    private deleteMeeting (m: Meeting ): void {
        let id: number = m.id;
        const url = deleteMeetingUrl + "/" + id;

        let json = url + ", " + m.name;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb:' + json)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + json))
        );

        obs.subscribe();
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
