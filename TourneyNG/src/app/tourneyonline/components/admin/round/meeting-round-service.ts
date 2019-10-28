import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { Team } from 'app/tourneyonline/domain/team';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class MeetingRoundService extends MeetingService {

 
    constructor(protected http: HttpClient
        , protected router: Router
        , protected dateFormatPipe: DateFormatPipe ) 
    { 
        super(  http, router, dateFormatPipe );
        console.log("Constructor of MeetingRoundService");
    }
    
    remakeRoundMeeting( tourney: Tourney, round : Round ) : void {
        this.selectedTourney = tourney;

        const url = this.deleteMeetingsByRoundIdUrl + "/" + tourney.id + "/" + round.id;

        let obs = this.http.delete<Meeting>(url).pipe(
            tap(_ => this.log('deleting MeetingDb: ' + url)),
            catchError(this.handleError<Meeting>('deletingMeeting: ' + url))
        );

        obs.subscribe(cs => this.next(cs), e => this.handleError(e), () => this.createAndSaveRoundMeeting(tourney, round));
    }

    protected next(n:any) {
        console.debug(n);
    }

    private createAndSaveRoundMeeting(tourney: Tourney, round: Round): void {
        this.createRoundMeeting(tourney, round);
    }

    createRoundMeeting( tourney: Tourney, round : Round ) : void {
        this.selectedTourney = tourney;

        round.onewayMeetings = [];
        round.roundtripMeetings = [];

        this.prepareMeetings(round);

        this.onewayDaysNo = 1;
        this.shiftOnewayDay(this.onewayDaysNo);

        this.roundtripDaysNo = 1;
        this.shiftRoundtripDay(this.roundtripDaysNo);

        let allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = round.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayRound == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }

    public onCompleteLoad(round: Round, mdbList: MeetingDb[]) {

        this.mdbList = mdbList;
        
        this.extractRoundMeetings(round, mdbList);

        this.makeTeamName(round.onewayMeetings);
        this.makeTeamName(round.roundtripMeetings);

        let allDaysNo = round.daysNo;
        let meetingsNo = round.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayRound == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }

    private makeTeamName(meetings: Meeting[]) {
        for(let m of meetings) {
            m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
            m.teamName1 = m.team1.teamName;
            m.teamName2 = m.team2.teamName;
        }
    }

    /**
     * Prepares the meetings only if there was the changes in the teams or in the round configurations
     */
    private prepareMeetings(round : Round) {

        let teams: Team[] = [...round.teams];
        
        if( teams.length % 2 > 0 ) {
            let dummyTeam: Team = this.cloneObject(teams[0]);
            dummyTeam.teamName = "Riposo";
            dummyTeam.id = null;

            teams.push(dummyTeam);
        }

        this.applyBergerAlgorithm(round, teams);

        this.completeMeetings(round);

        round.pageSize = round.onewayMeetings.length / round.daysNo
        console.log("[Meetings " + round.onewayMeetings.length + "]");
        console.log("[Days     " + round.daysNo + "]");
        console.log("[PageSize " + round.pageSize + "]");
    }

    /**
     * Prepares the meetings of the teams using the Berger algorithm
     */
    private applyBergerAlgorithm(round: Round, teams: Team[]): void {
        let teamsNo = teams.length;
        round.daysNo = teamsNo - 1;

        /* crea gli array per le due liste in casa e fuori */
        let home : Array<Team>  = new Array<Team>(teamsNo / 2);
        let away : Array<Team>  = new Array<Team>(teamsNo / 2);

        for (let i = 0; i < teamsNo / 2; i++) {
            home[i] = teams[i];
            away[i] = teams[teamsNo - 1 - i];
        }

        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();

        for (let i = 0; i < round.daysNo; i++) {
            /* stampa le partite di questa giornata */
            let key: number = i + 1;
            console.log( key + "° Giornata");
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);

            /* alterna le partite in casa e fuori */
            if (i % 2 == 0) {
                for (let j = 0; j < teamsNo / 2; j++) {
                    let t1: Team = home[j];
                    let t2: Team = away[j];
                    let day = j + 1;
                    console.log( day + " " + t2.teamName + " - " + t1.teamName);

                    let mfound = round.onewayMeetings.find( m => this.whereCondition(m, t2, t1));

                    if( mfound == undefined ) {
                        mfound = this.newMeeting(t2, t1, key, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            } else {
                for (let j = 0; j < teamsNo / 2; j++) {
                    let t1: Team = home[j];
                    let t2: Team = away[j];
                    let day = j + 1;
                    console.log( day + " " + t1.teamName + " - " + t2.teamName);

                    let mfound = round.onewayMeetings.find( m => this.whereCondition(m, t1, t2));

                    if( mfound == undefined ) {
                        mfound = this.newMeeting(t1, t2, key, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            }

            meetingList = MeetingService.sortMeetings(meetingList);

            // Ruota gli elementi delle liste, tenendo fisso il primo elemento
            // Salva l'elemento fisso
            let pivot : Team  = home[0];

            /*
             * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
             * uscente in "riporto"
             */
            let riporto : Team  = away[away.length - 1];
            away = this.shiftRight(away, home[1]);

            //  sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
            home = this.shiftLeft(home, riporto);

            // ripristina l'elemento fisso
            home[0] = pivot;
        }
    }

    private whereCondition(m: Meeting, t1: Team, t2: Team) : boolean {

        return m.team1.teamName == t1.teamName && m.team2.teamName == t2.teamName;
    }

     /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private completeMeetings(round : Round): void {
        round.onewayMeetings = [];
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for (let key of this.onewayMeetingDaysMap.keys()) {
            let onewayMeetings: Meeting[] = this.onewayMeetingDaysMap.get(key);

            for( let m of onewayMeetings ) {   
                m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
    
                let rtm = round.roundtripMeetings.find( i => this.whereCondition(m, m.team2, m.team1));

                if( rtm == undefined ) {
                    rtm = this.newMeeting(m.team2, m.team1, m.day, Direction.RoundTrip);
                    rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);
                }

                if( !this.roundtripMeetingDaysMap.has(key) ) {
                    let emptyList: Meeting[] = [];
                    this.roundtripMeetingDaysMap.set(key, emptyList);
                }
                let dayList = this.roundtripMeetingDaysMap.get(key);
                dayList.push(rtm);
            }

            round.onewayMeetings = round.onewayMeetings.concat(onewayMeetings);
        }
        
        round.roundtripMeetings = [];
        for (let key of this.roundtripMeetingDaysMap.keys()) {
            let dayList = this.roundtripMeetingDaysMap.get(key);
            dayList = MeetingService.sortMeetings(dayList);
            round.roundtripMeetings = round.roundtripMeetings.concat(dayList);
        }
    }

    public newMeeting(t1: Team, t2: Team, day: number, d: Direction): Meeting {
        let m = this.createMeeting(t1, t2, null, null, day, d);
        return m;
    }
    
    protected makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
        return "";
    }

    private shiftLeft(data : Team[] , add: Team ) : Team[] {

        let temp : Array<Team>  = new Array<Team>(data.length);

        for (let i = 0; i < data.length - 1; i++) {
            temp[i] = data[i + 1];
        }
        temp[data.length - 1] = add;
        return temp;
    }

    private shiftRight(data : Team[] , add: Team ): Team[] {
        let temp : Array<Team>  = new Array<Team>(data.length);

        for (let i = 1; i < data.length; i++) {
            temp[i] = data[i - 1];
        }
        temp[0] = add;

        return temp;
    }

    public shiftOnewayDay( currentDay : number) : any[] {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        for( let d of this.onewayDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
        return this.onewayDays;
    }

    public shiftRoundtripDay( currentDay : number ) : any[] {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        for( let d of this.roundtripDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
        return this.roundtripDays;
    }

    saveEliminatoryMeetings(st : Tourney) {
        for (let el of st.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                for (let m of e.round.onewayMeetings) {
                    let observer = this.saveEliminatoryMeetingDb(m, st.id, e.id);
                    observer.subscribe(mdb => this.saveEliminatoryMeetingNext(mdb, e, m));
                }
                for (let m of e.round.roundtripMeetings) {
                    let observer = this.saveEliminatoryMeetingDb(m, st.id, e.id);
                    observer.subscribe(mdb => this.saveEliminatoryMeetingNext(mdb, e, m));
                }
            }
        }
    }

    private saveEliminatoryMeetingNext(mdb:  MeetingDb, e: Eliminatory, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(mdb);
        m.id = mdb.id;
        e.id = mdb.eliminatoryId;
    }
    
    public saveMeetingNext(mdb:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(mdb);
        m.id = mdb.id;
    }
}
