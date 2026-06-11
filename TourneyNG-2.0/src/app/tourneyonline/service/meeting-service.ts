import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
import { AbstractRoundVO } from '../domain/abstract-round-vo';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
const meetingUrl = 'api/meetings';  
const loadMeetingByRoundIdsUrl  = meetingUrl + '/loadByRoundIds';

const loadMeetingByPlayoffIdUrl = meetingUrl + '/loadByPlayoffId'; 
const loadMeetingByPlayoutIdUrl = meetingUrl + '/loadByPlayoutId'; 
const loadMeetingByPlayoffIdsUrl = meetingUrl + '/loadByPlayoffIds'; 
const loadMeetingByPlayoutIdsUrl = meetingUrl + '/loadByPlayoutIds'; 
const loadMeetingByEliminatoryIdUrl = meetingUrl + '/loadByEliminatoryId';  
const loadAllEliminatoryMeetingsUrl = meetingUrl + '/loadAllEliminatoryMeetingsBy';  
const loadEliminatoryMeetingByIdListUrl = meetingUrl + "/loadEliminatoryMeetingByIdList";
const loadEliminatoryBMeetingByIdListUrl = meetingUrl + "/loadEliminatoryBMeetingByIdList";

const insertMeetingUrl = meetingUrl + '/insert';
const updateMeetingUrl = meetingUrl + '/update';

const deleteMeetingUrl                  = meetingUrl + '/delete';
const deleteMeetingByPlayoffIdUrl       = meetingUrl + "/deletePlayoffMeetingsByTourneyId"
const deleteMeetingByPlayoutIdUrl       = meetingUrl + "/deletePlayoutMeetingsByTourneyId"

@Injectable({
  providedIn: 'root'
})
export class MeetingService extends AbstractService {

    public static SKIPING_TEAM = "(Riposo)";
    protected deleteRoundMeetingsByTourneyIdUrl: string = meetingUrl + "/deleteRoundMeetingsByTourneyId"
    protected deleteMeetingsByRoundIdUrl: string = meetingUrl + "/deleteMeetingsByRoundId"
    protected loadMeetingByRoundIdUrl: string   = meetingUrl + '/loadByRoundId';  

    static deleteMeetingUrl: string = deleteMeetingUrl;

    selectedTourney: Tourney = new Tourney();
    
    selectedMeetingDb: MeetingDb = new MeetingDb();
    selectedMeeting: Meeting  = new Meeting();

    meetings: Meeting[] = [];
    mdbs: Meeting[] = [];

    isRoundTrip: boolean = false;
    meetingsNoMsg: string = "";

    onewayDaysNo: number = 0;
    roundtripDaysNo: number = 0;
    selectedTabIndex: number = 0;
    selectedResultTabIndex: number = 0; 
    onewayMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>;
    onewayDays: any[] | undefined = [];
    
    roundtripMeetingDaysMap: Map<number, Meeting[]> = new Map<number, Meeting[]>;
    roundtripDays: any[] | undefined = [];
    goBackFromMeeting: boolean = false;

    abstractRoundVO: AbstractRoundVO = new AbstractRoundVO();

    selectedRound: Round = new Round();
    qualifyingRounds: Round[] = [];
    allDaysNo: number = 0;
    mdbList: MeetingDb[]  = [];
    onSaveMeetingError: boolean = false;

    constructor( protected http: HttpClient
        , protected router: Router
        , protected dateFormatPipe: DateFormatPipe ) 
    { 
        super();
        console.log("Constructor of MeetingService");
        this.selectedResultTabIndex = 0;
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
            } else {
                round.roundtripMeetings.push(m);
            }
        }

        round.onewayMeetings    = MeetingService.sortMeetings(round.onewayMeetings);
        round.roundtripMeetings = MeetingService.sortMeetings(round.roundtripMeetings);
    }

    public extractPlayoffMeetings(playoff: Playoff, mdbList: MeetingDb[] ) {
        let round = playoff.round;
        if( round == undefined ) {
            round = new Round();
        }
        round.onewayMeetings = [];
        round.roundtripMeetings = [];
        for (let mdb of mdbList) {
            if(playoff.id != mdb.playoffId && playoff.id != mdb.playoutId) {
                continue;
            }
            let m: Meeting = JSON.parse(mdb.json);
            if( m.isSkiping) {
                continue;
            }
            m.id = mdb.id;
            if(m.direction == undefined) {
                continue;
            }
            if (m.direction == Direction.OneWay) {
                round.onewayMeetings.push(m);
            } else {
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
    loadRoundMeetings(tourneyId: number| null, roundsIds: Array<number>, error: (error: any) => any ) : Observable<MeetingDb[]> {

        let url = loadMeetingByRoundIdsUrl + "/" + tourneyId ;

        console.log("Url=" + url + "?roundsIds=" + roundsIds);

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
    loadPlayoffMeeting(tourneyId: number| null, playoffId: number, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadMeetingByPlayoffIdUrl + "/" + tourneyId + "/" + playoffId;
        console.log("Url=" + url);
        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(error('loadPlayoffMeetingDb url=' + url))
        );
        return obs;
    }
    
    loadPlayoutMeeting(tourneyId: number| null, playoutId: number, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadMeetingByPlayoutIdUrl + "/" + tourneyId + "/" + playoutId;
        console.log("Url=" + url);
        const obs : Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        obs.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(error('loadPlayoutMeetingDb url=' + url))
        );
        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney id
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadPlayoffMeetings(tourneyId: number| null, playoffIds: Array<number>, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadMeetingByPlayoffIdsUrl + "/" + tourneyId ;
        console.log("Url=" + url);
        let obs = this.http.post<MeetingDb[]>(url, playoffIds, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('loadPlayoffMeetings, url=' + url)),
            catchError(error('addMeetingDb, url=' + url))
        );
        return obs;
    }

    loadPlayoutMeetings(tourneyId: number| null, playoutIds: Array<number>, error: (error: any) => any) : Observable<MeetingDb[]> {
        let url = loadMeetingByPlayoutIdsUrl + "/" + tourneyId ;
        console.log("Url=" + url);
        let obs = this.http.post<MeetingDb[]>(url, playoutIds, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('loadPlayoutMeetings, url=' + url)),
            catchError(error('addMeetingDb, url=' + url))
        );
        return obs;
    }


    /** 
     * Loads all the meetings of the receìved tourney and eliminatory ids
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryMeeting(tourneyId: number| null, eliminatoryId: number, error: (error: any) => any) : Observable<MeetingDb[]> {
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
    loadEliminatoryMeetingByIdList(tourneyId: number | null, eliminiatoryIdList: number[], error: (e: any) => any) : Observable<MeetingDb[]> {
        let url = loadEliminatoryMeetingByIdListUrl + "/" + tourneyId;
        console.log("Url=" + url);
        // let obs = this.http.post<MeetingDb[]>(url, eliminiatoryIdList, httpOptions).pipe(
        //     tap((m: MeetingDb[]) => this.log('added MeetingDb, url=' + url)),
        //     catchError(error('addMeetingDb, url=' + url))
        // );
        let obs = this.http.post<MeetingDb[]>(url, eliminiatoryIdList, httpOptions).pipe(
            tap((m: MeetingDb[]) => this.log('added MeetingDb, url=' + url)),
            //  FIX: Wrap it in an arrow function so it receives the actual RxJS error
            catchError((err) => {
                // Call your custom error handler
                error(err); 
                // Return a safe fallback observable so the stream doesn't completely break
                return of([]); 
            })
        );
        return obs;
    }

    /** 
     * Loads all the meetings of the receìved tourney id and eliminatory id list
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadEliminatoryBMeetingByIdList(tourneyId: number | null, eliminiatoryIdList: number[], error: (e: any) => any) : Observable<MeetingDb[]> {
        let url = loadEliminatoryBMeetingByIdListUrl + "/" + tourneyId;
        
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
    public prepareMeetingsMap(round : Round): void {
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for( let m of round.onewayMeetings ) {
            m.containerId = round.id;
            let key = m.day;
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }
            let meetingList: Meeting[] | undefined = this.onewayMeetingDaysMap.get(key) ;
            if( !meetingList ) {
                continue;
            }
            meetingList.push(m);
        }

        for( let m of round.roundtripMeetings ) {
            m.containerId = round.id;
            let key = m.day;
            if(!this.roundtripMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.roundtripMeetingDaysMap.set(key, emptyList);
            }
            let meetingList: Meeting[] | undefined = this.roundtripMeetingDaysMap.get(key);
            if( meetingList == undefined ) {
                continue;
            }
            meetingList.push(m);
        }
    }

    saveRoundMeetingDb(m: Meeting, tourneyId: number| null, roundId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addMeetingDb(m, tourneyId, roundId, null, null);
        } else {
            return this.updateMeetingDb(m, tourneyId, roundId, null, null, error);
        }
    }

    savePlayoffMeetingDb(m: Meeting, tourneyId: number| null, playoffId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addPlayoffMeetingDb(m, tourneyId,  playoffId );
        } else {
            return this.updatePlayoffMeetingDb(m, tourneyId,   playoffId,  error);
        }
    }

    savePlayoutMeetingDb(m: Meeting, tourneyId: number| null, playoffId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addPlayoutMeetingDb(m, tourneyId,  playoffId );
        } else {
            return this.updatePlayoutMeetingDb(m, tourneyId,   playoffId,  error);
        }
    }

    saveEliminatoryMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryId: number | null, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addEliminatoryMeetingDb(m, tourneyId, eliminatoryId);
        } else {
            return this.updateEliminatoryMeetingDb(m, tourneyId, eliminatoryId, error);
        }
    }
    
    saveEliminatoryBMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryBId: number, error: (error: any) => any): Observable<MeetingDb> {
        if(m.id == null) {
            return this.addEliminatoryBMeetingDb(m, tourneyId, eliminatoryBId);
        } else {
            return this.updateEliminatoryBMeetingDb(m, tourneyId, eliminatoryBId, error);
        }
    }

    private addEliminatoryMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryId: number | null ): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, null, null, null, eliminatoryId, null);
        return this.addMeeting(mdb);
    }

    private addEliminatoryBMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryBId: number): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, null, null, null, null, eliminatoryBId);
        return this.addMeeting(mdb);
    }

    private addMeetingDb(m: Meeting, tourneyId: number| null, roundId: number, playoffId: number | null, eliminatoryId: number | null): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, roundId, null, playoffId, eliminatoryId, null);
        return this.addMeeting(mdb);
    }

    private addPlayoffMeetingDb(m: Meeting, tourneyId: number| null, playoffId: number): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, null, playoffId, null, null, null);
        return this.addMeeting(mdb);
    }

    private addPlayoutMeetingDb(m: Meeting, tourneyId: number | null, playoutId: number): Observable<MeetingDb> {
        let mdb: MeetingDb = this.prepareMdb(m, tourneyId, null, null, playoutId, null, null);
        return this.addMeeting(mdb);
    }

    prepareRoundMeetingDb(m: Meeting, tourneyId: number| null, roundId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, roundId, null, null, null, null);
    }
    preparePlayoffMeetingDb(m: Meeting, tourneyId: number| null, playoffId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, playoffId, null, null, null);
    }
    preparePlayoutMeetingDb(m: Meeting, tourneyId: number| null, playoutId: number):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, null, playoutId, null, null);
    }
    prepareEliminatoryMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryId: number | null):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, null, null, eliminatoryId, null);
    }
    prepareEliminatoryBMeetingDb(m: Meeting, tourneyId: number| null, eliminatoryBId: number | null):  MeetingDb {
        return this.prepareMdb(m, tourneyId, null, null, null, null, eliminatoryBId);
    }

    private prepareMdb(m: Meeting, tourneyId: number | null
        , roundId: number | null
        , playoffId: number | null
        , playoutId: number | null 
        , eliminatoryId: number | null 
        , eliminatoryBId: number | null 
    ): MeetingDb 
    {
        m.name = m.teamName1 + " - " + m.teamName2;
        let mdb: MeetingDb = {
              id: m.id
            , tourneyId: tourneyId
            , roundId: roundId
            , playoffId: playoffId
            , playoutId: playoutId
            , eliminatoryId: eliminatoryId
            , eliminatoryBId: eliminatoryBId
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
        return this.prepareMdb(m, tourneyId, roundId, 0, 0, 0, 0);
    }

    completePlayoffMeetingDb(m: Meeting, tourneyId: number, playoffId: number): MeetingDb {
        return this.prepareMdb(m, tourneyId, 1, playoffId, 0, 0, 0);
    }

    completeEliminatoryMeetingDb(m: Meeting, tourneyId: number, eliminatoryId: number): MeetingDb {
        return this.prepareMdb(m, tourneyId, 0, 0, 0, eliminatoryId, 0);
    }

    private updateMeetingDb(m: Meeting, tourneyId: number| null, roundId: number, playoffId: number | null, eliminatoryId: number | null
        , error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, roundId, playoffId, 0, eliminatoryId, 0);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }

    private updateRoundMeetingDb(m: Meeting, tourneyId: number | null,  roundId: number, error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, roundId, 0, 0, 0, 0);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }

    private updateEliminatoryMeetingDb(m: Meeting, tourneyId: number| null,  eliminatoryId: number | null
        , error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, null, null, null, eliminatoryId, null);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }

    private updateEliminatoryBMeetingDb(m: Meeting, tourneyId: number| null,  eliminatoryBId: number | null
        , error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, null, null, null, null, eliminatoryBId);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }
 
    private updatePlayoffMeetingDb(m: Meeting, tourneyId: number| null,  playoffId: number, error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, 0, playoffId, 0, 0, 0);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }
    
    private updatePlayoutMeetingDb(m: Meeting, tourneyId: number| null,  playoutId: number, error: (error: any) => any ):  Observable<MeetingDb> {
        let mdb = this.prepareMdb(m, tourneyId, 0, 0, playoutId, 0, 0);
        let obs = this.updateMeetingMdb(mdb, error);
        return obs;
    }
    
    /** PUT: update the MeetingDb on the db server */
    updateMeetingMdb (mdb: MeetingDb, error: (error: any) => any): Observable<MeetingDb> {
        let url = updateMeetingUrl;

        return this.http.put<MeetingDb>(url, mdb, httpOptions).pipe(
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
        if( m.id == null ) {
            return;
        }
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
     
    deletePlayoffMeetingsByTourneyId (tourneyId: number| null ): void {
        const url = deleteMeetingByPlayoffIdUrl + "/" + tourneyId;
        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb: ' + url)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + url))
        );
        obs.subscribe();
    }
    
    deletePlayoutMeetingsByTourneyId (tourneyId: number| null ): void {
        const url = deleteMeetingByPlayoutIdUrl + "/" + tourneyId;
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

    public newMeeting(t1: string | null, t2: string, day: number, d: Direction, skiping: boolean): Meeting {
        let m = this.createMeeting(t1, t2, null, null, day, d, skiping);
        return m;
    }
    
    public createMeeting(t1: string | null, t2: string | null, pr1: PlayoffRule | null, pr2: PlayoffRule | null, day: number, d: Direction, skiping: boolean): Meeting {
        let matches = new Array<Match>();
        for(let i=0; i<this.abstractRoundVO.maxMatchesPerMeeting; i++) {
            let m: Match = new Match();
            m.id = i;
            m.players1 = [];
            m.players2 = [];
            m.score1 = 0;
            m.score2 = 0;
            matches.push(m);
        }

        var name = "";
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
        
        let m = new Meeting();
        m.id = null;
        m.name = name;
        m.isSkiping = skiping;
        m.direction = d;
        m.datetime = this.selectedTourney.datetime;
        m.address =  this.selectedTourney.address;
        m.country =  this.selectedTourney.country;
        m.day = day;
        m.teamName1 = t1 == null ? "" : t1;
        m.teamName2 = t2 == null ? "" : t2;
        m.points1 = skiping ? -1 : 0;
        m.points2 = skiping ? -1 : 0;
        m.rule1 = pr1 == null ? new PlayoffRule() : pr1;
        m.rule2 = pr2 == null ? new PlayoffRule() : pr2;
        m.ruleName = ruleName;
        m.status = skiping ? MeetingStatus.Terminated :  MeetingStatus.ToPlay;
        m.matches = matches;

        return m;
    }
        
    protected makeRuleName(pr1: PlayoffRule | null, pr2: PlayoffRule | null): string {
        return "";
    }
   
    public saveMeetingNext(mdb:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(mdb);
        m.id = mdb.id;
    }

    /**
     * Resolves, for the automatic playoff mode, the team names of the received meeting and round list applying the rule in the same meeting
     * 
     * @param m the meeting the name to resolve with
     * @param rounds the list of the rounds from which take the round names
     */
    public resolveAutomaticRules( m: Meeting, terminated: boolean, roundMatrix: Array<Array<Classification>> ): void {
        let row = m.rule1.fromRound.bandPosition;
        let col = m.rule1.fromRound.position.value == null ? 0 : m.rule1.fromRound.position.value;
        m.ruleName1 = m.rule1.ruleName;

        if( m.rule1.isDummy ) {
            m.teamName1 = m.rule1.fromRound.round.label;
        } else {
            if(!terminated || m.teamName1 == "" || m.teamName1 == null) {
                m.teamName1 = roundMatrix[row-1][col-1].teamName;
            }
        }

        row = m.rule2.fromRound.bandPosition;
        col = m.rule2.fromRound.position.value == null ? 0 : m.rule2.fromRound.position.value;
        m.ruleName2 = m.rule2.ruleName;
        
        if( m.rule2.isDummy ) {
            m.teamName2 =  m.rule2.fromRound.round.label;
        } else {
            if(!terminated || m.teamName2 == "" || m.teamName2 == null) {
                m.teamName2 = roundMatrix[row-1][col-1].teamName;
            }
        }
        m.name = m.teamName1 + " - " + m.teamName2;
        // console.log(m.name);
    }
    
    public areAllTerminated(rounds: Round[]) : boolean {
        if(rounds == undefined || rounds.length == 0) {
            return true;
        }
        let terminated: boolean = true;
        for (let r of rounds) {
            for (let m of r.onewayMeetings) {
                if (m.status != MeetingStatus.Terminated && m.status != MeetingStatus.Confirmed) {
                    terminated = false;
                    break;
                }
            }
            if (!terminated) {
                break;
            }
            for (let m of r.roundtripMeetings) {
                if (m.status != MeetingStatus.Terminated && m.status != MeetingStatus.Confirmed) {
                    terminated = false;
                    break;
                }
            }
        }
        return terminated;
    }

    public sortMeeting(m1: Meeting, m2: Meeting): number {
        if( m1.name.indexOf ('(Riposo)') != -1 ) {
            return -1;
        }
        if( m2.name.indexOf ('(Riposo)') != -1 ) {
            return 1;
        }
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
        if( m1.teamName1 == null || m2.teamName1 == null) {
            return 0;
        }
        if( m1.teamName1 > m2.teamName1 ) {
            return 1;
        }
        if( m1.teamName1 < m2.teamName1 ) {
            return -1;
        }
        if( m1.teamName2 == null || m2.teamName2 == null) {
            return 0;
        }
        if( m1.teamName2 > m2.teamName2 ) {
            return 1;
        }
        if( m1.teamName2 < m2.teamName2 ) {
            return -1;
        }
        return 0;
    }

    public updateOnChangeTeamName(t: Tourney, previousTeamName: string, newTeamName: string)  : void {
        if( t == null ) {
            return;
        }
        this.updateRoundMeetings(t, previousTeamName, newTeamName);
        this.updatePlayoffMeeting(t, previousTeamName, newTeamName);
        this.updatePlayoutMeeting(t, previousTeamName, newTeamName);
        this.updateEliminatoryLevelMeetings(t, previousTeamName, newTeamName);
        this.updateEliminatoryBLevelMeetings(t, previousTeamName, newTeamName);
    }

    private updateRoundMeetings(t: Tourney, previousTeamName: string, newTeamName: string)  : void {
        if( t.roundVO == null ) {
            return;
        }
        for (let r of t.roundVO.rounds) {
            for (let m of r.onewayMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updateRoundMeetingDb(m, t.id, r.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer = this.updateRoundMeetingDb(m, t.id, r.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
            for (let m of r.roundtripMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updateRoundMeetingDb(m, t.id, r.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer = this.updateRoundMeetingDb(m, t.id, r.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
        }
    }

    private updatePlayoffMeeting(t: Tourney, previousTeamName: string, newTeamName: string)  : void {
        if( t.playoffVO == null ) {
            return;
        }

        for (let p of t.playoffVO.playoffs ) {
            for (let m of p.round.onewayMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updatePlayoffMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer =  this.updatePlayoffMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
            for (let m of p.round.roundtripMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updatePlayoffMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer = this.updatePlayoffMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
        }
    }
    private updatePlayoutMeeting(t: Tourney, previousTeamName: string, newTeamName: string) : void {
        if( t.playoutVO == null ) {
            return;
        }

        for (let p of t.playoutVO.playoffs ) {
            for (let m of p.round.onewayMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updatePlayoutMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer = this.updatePlayoutMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
            for (let m of p.round.roundtripMeetings) {
                if (m.teamName1 === previousTeamName) {
                    m.teamName1 = newTeamName;
                    let observer = this.updatePlayoutMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
                if (m.teamName2 === previousTeamName) {
                    m.teamName2 = newTeamName;
                    let observer = this.updatePlayoutMeetingDb(m, t.id, p.id, this.saveMeetingErrorHandler());
                    observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                }
            }
        }
    }
    private updateEliminatoryLevelMeetings(t: Tourney, previousTeamName: string, newTeamName: string) {
        if( t.eliminatoryLevels == null ) {
            return;
        }
        for (let el of t.eliminatoryLevels ) {
            for( let e of el.eliminatories ) {
                for (let m of e.round.onewayMeetings) {
                    if (m.teamName1 === previousTeamName) {
                        m.teamName1 = newTeamName;
                        let observer = this.updateEliminatoryMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                    if (m.teamName2 === previousTeamName) {
                        m.teamName2 = newTeamName;
                        let observer = this.updateEliminatoryMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                }
                for (let m of e.round.roundtripMeetings) {
                    if (m.teamName1 === previousTeamName) {
                        m.teamName1 = newTeamName;
                        let observer = this.updateEliminatoryMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                    if (m.teamName2 === previousTeamName) {
                        m.teamName2 = newTeamName;
                        let observer = this.updateEliminatoryMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                }
            }
        }
    }
    private updateEliminatoryBLevelMeetings(t: Tourney, previousTeamName: string, newTeamName: string) {
        if( t.eliminatoryBLevels == null ) {
            return;
        }
        for (let el of t.eliminatoryBLevels ) {
            for( let e of el.eliminatories ) {
                for (let m of e.round.onewayMeetings) {
                    if (m.teamName1 === previousTeamName) {
                        m.teamName1 = newTeamName;
                        let observer = this.updateEliminatoryBMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                    if (m.teamName2 === previousTeamName) {
                        m.teamName2 = newTeamName;
                        let observer = this.updateEliminatoryBMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                }
                for (let m of e.round.roundtripMeetings) {
                    if (m.teamName1 === previousTeamName) {
                        m.teamName1 = newTeamName;
                        let observer = this.updateEliminatoryBMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                    if (m.teamName2 === previousTeamName) {
                        m.teamName2 = newTeamName;
                        let observer = this.updateEliminatoryBMeetingDb(m, t.id, e.id, this.saveMeetingErrorHandler());
                        observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
                    }
                }
            }
        }
    }

    protected saveMeetingErrorHandler<MeetingDb> (result?: MeetingDb)  {
        return (res: any): Observable<MeetingDb> => {
            console.log("Entering saveMeetingErrorHandler()");
            console.error(res); // log to console instead
            this.onSaveMeetingError = true;
            return of(result as MeetingDb);
        };
    }

    /**
     * Finds the first and the last days of the week containing the received weekDay date
     * 
     * @returns the concatenation of the first and last above days
     */
    public getWeekDaysRange( weekDay : Date ) : string {
        // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = weekDay.getDay();

        // Determine the distance to the Monday (1) and Sunday (0)
        const distanceToMonday = (dayOfWeek + 6) % 7; // Adjust for Monday being the start
        const distanceToFriday = 4 - distanceToMonday; // 6 days from Monday to Sunday

        // Calculate the start and end of the week
        const monday = new Date(weekDay);
        monday.setDate(weekDay.getDate() - distanceToMonday);

        const sunday = new Date(weekDay);
        sunday.setDate(weekDay.getDate() + distanceToFriday);

        // Format the dates as DD/MM/YYYY
        const formatDate = (d: Date): string => {
            const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate().toString();
            const month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1).toString();
            return `${day}/${month}/${d.getFullYear()}`;
        };

        // Return the range as a formatted string
        return `dal ${formatDate(monday)} al ${formatDate(sunday)}`;
    }
}
