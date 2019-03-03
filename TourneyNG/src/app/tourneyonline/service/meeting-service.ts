

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { Meeting } from '../domain/meeting';
import { LoginService } from './login-service';
import { Router } from '@angular/router';
import { MeetingDb } from '../domain/meeting-db';
import { environment } from 'environments/environment';
import { TourneyService } from './tourney-service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
const meetingUrl = 'api/meetings';  
const loadMeetingUrl = meetingUrl + '/load';  
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

    constructor(private http: HttpClient
        , protected router: Router
        , private loginService: LoginService
        , private tourneyService: TourneyService
        ) 
    { 
        console.log("Constructor of TourneyService");
    }

    /** 
     * Loads all the meetings of the receìved tourney and round
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadRoundMeeting(tourneyId: number, roundId: number) :  Observable<MeetingDb[]> {
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "roundId=" + roundId;
        let url = loadMeetingUrl + queryString;
        
        if(this.loginService.isUserLogged) {
            url = loadMeetingUrl + queryString;
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
        const queryString = "?" + "tourneyId=" + tourneyId + "&" + "playoffId=" + playoffId;
        let url = loadMeetingUrl + queryString;

        if(this.loginService.isUserLogged) {
            url = loadMeetingUrl + queryString;
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
        let url = loadMeetingUrl + queryString;

        if(this.loginService.isUserLogged) {
            url = loadMeetingUrl + queryString;
        }
        
        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadEliminatoryMeetingDb url=' + url))
        );

        return obs;
    }

    saveRoundMeetingDb(m: Meeting, tourneyId: number, roundId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.tourneyService.getSequenceNumber();
            }

            this.addMeetingDb(m, tourneyId, roundId, null, null)
        } else {
            this.updateMeetingDb(m, tourneyId, roundId, null, null)
        }
    }

    savePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.tourneyService.getSequenceNumber();
            }
            this.addMeetingDb(m, tourneyId, null, playoffId, null)
        } else {
            this.updateMeetingDb(m, tourneyId, null, playoffId, null)
        }
    }

    saveEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number): void {
        if(m.id == null) {
            if(environment.inMemoryDataService) {
                m.id = this.tourneyService.getSequenceNumber();
            }
            this.addMeetingDb(m, tourneyId, null, null, eliminatoryId)
        } else {
            this.updateMeetingDb(m, tourneyId, null, null, eliminatoryId)
        }
    }

    private addMeetingDb(m: Meeting, tourneyId: number, roundId: number, playoffId: number, eliminatoryId: number): void {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, roundId, playoffId, eliminatoryId);

        this.addMeeting(mdb);
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
    private addMeeting (mdb: MeetingDb): void {
        let url = insertMeetingUrl;

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
 
    /** PUT: update the MeetingDb on the db server */
    updateMeetingMdb (mdb: MeetingDb ): Observable<MeetingDb> {
        const id =  mdb.id;
        let url = updateMeetingUrl + "/" + id;

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
