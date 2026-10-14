import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { Router } from '@angular/router';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Direction, PhaseType } from 'app/tourneyonline/domain/enumerations';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { catchError, tap } from 'rxjs/operators';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Observable } from 'rxjs';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MeetingDto } from './meeting-dto';
import { Team } from 'app/tourneyonline/domain/team';

@Injectable({
  providedIn: 'root'
})
export class MeetingRoundService extends MeetingService {
    isRoundAutoGen: string = "";
    isFirstRound: boolean = false;
    constructor(protected override http: HttpClient
        , protected override router: Router
        , protected tourneyService: TourneyService
        , protected clientService: ClientService
        , protected override dateFormatPipe: DateFormatPipe ) 
    { 
        super( http, router, dateFormatPipe  );
        console.log("Constructor of MeetingRoundService");
    }
    
    /** 
     * Loads all the meetings of the receìved tourney and round
     *  GET meetings by params. Will 404 if meetings not found 
     */
    loadRoundMeeting(tourney: Tourney, round : Round ) :  Observable<MeetingDb[]> {
        let url = this.loadMeetingByRoundIdUrl + "/" + tourney.id + "/" + round.id;
        console.log("Url=" + url);
        const subsbr :Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        subsbr.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadRoundMeetingDb url=' + url))
        );

        return subsbr;
    }

    public saveRoundMeetings( selectedTourney : Tourney
        , saveEH : (operation: string, result?: TourneyVO) => any
        , subscribeEH : (operation: string, result?: TourneyVO) => void
        , unBlockDocument: () => void)
    {
        this.selectedTourney = selectedTourney;
        let roundsMeetings: MeetingDb[] = [];
        for (let r of this.selectedTourney.roundVO.rounds) {
            for(let m of r.onewayMeetings ) {
                let mdb = this.prepareRoundMeetingDb(m, this.selectedTourney.id, r.id);
                roundsMeetings.push(mdb);
            }
            for(let m of r.roundtripMeetings ) {
                let mdb = this.prepareRoundMeetingDb(m, this.selectedTourney.id, r.id);
                roundsMeetings.push(mdb);
            }
        }

        let tvo: TourneyVO = this.prepareTourneyVOForRound(false);
        tvo.mdbs = roundsMeetings;
        const subscriber = this.tourneyService.updateTourneyAndRounds(tvo, saveEH('Create Tourney operation', tvo));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => subscribeEH(e, tvo), () => unBlockDocument() );
    }

    public addInProgressRoundMeetings(selectedTourney : Tourney
        , roundId : number
        , onewayMeetings : Meeting[]
        , roundtripMeetings: Meeting[])
    {
        this.selectedTourney = selectedTourney;
        for(let m of onewayMeetings ) {
            let observer = this.saveRoundMeetingDb(m, this.selectedTourney.id, roundId, this.saveMeetingErrorHandler()  );
            observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
        }
        for(let m of roundtripMeetings ) {
            let observer = this.saveRoundMeetingDb(m, this.selectedTourney.id, roundId, this.saveMeetingErrorHandler()  );
            observer.subscribe( n => this.saveMeetingNext(n, this.selectedMeeting));
        }
    }
 
    private saveTourneyNext(tvo: TourneyVO): void {
        console.log("saveTourneyNext()");
        console.log(tvo);
        this.selectedTourney.id = tvo.id;
    }

    public prepareTourneyVOForRound(cleanRounds: boolean) {
        this.cleanRoundMeetings(cleanRounds);
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        return tvo;
    }

    public cleanRoundMeetings(cleanRounds: boolean) {
        for (let r of this.selectedTourney.roundVO.rounds) {
            r.onewayMeetings = [];
            r.roundtripMeetings = [];
        }
        if (cleanRounds) {
            this.selectedTourney.roundVO.rounds = [];
        }
        if(this.containsPlayoff()) {
            this.cleanPlayoffMeetings(cleanRounds);
        }
    }

    public cleanPlayoffMeetings(cleanPlayoffs: boolean) {
        for (let p of this.selectedTourney.playoffVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        if (cleanPlayoffs) {
            this.selectedTourney.playoffVO.playoffs = [];
        }
        if(this.containsPlayout()) {
            this.cleanPlayoutMeetings(cleanPlayoffs);
        }
        if(this.containsEliminatory()) {
            this.cleanEliminatoryMeetings(cleanPlayoffs);
            if(this.containsEliminatoryB()) {
                this.cleanEliminatoryBMeetings(cleanPlayoffs);
            }
        }
    }
     
    public cleanPlayoutMeetings(cleanPlayoffs: boolean) {
        for (let p of this.selectedTourney.playoutVO.playoffs) {
            p.round.onewayMeetings = [];
            p.round.roundtripMeetings = [];
        }
        if (cleanPlayoffs) {
            this.selectedTourney.playoutVO.playoffs = [];
        }
    }
     
    containsPlayoff(): boolean {
        return this.containsPhase(PhaseType.P, this.selectedTourney.phases);
    }
    containsPlayout(): boolean {
        return this.containsPhase(PhaseType.O, this.selectedTourney.phases);
    }

    containsEliminatory(): boolean {
        let con: boolean = this.containsPhase(PhaseType.E, this.selectedTourney.phases);
        return con;
    }
    
    containsEliminatoryB(): boolean {
        let con: boolean = this.containsPhase(PhaseType.EB, this.selectedTourney.phases);
        return con;
    }
    protected containsPhase(value: PhaseType, phases: PhaseType[]) : boolean {
        for(let i=0; i<phases.length; i++ ) {
            if(phases[i] == value ) {
                return true;
            }
        }
        return false;
    }
 
    public cleanEliminatoryMeetings(cleanEliminatory: boolean) {
        for (let el of this.selectedTourney.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
 
        if (cleanEliminatory) {
            for (let el of this.selectedTourney.eliminatoryLevels) {
                el.eliminatories = [];
            }
            this.selectedTourney.eliminatoryLevels = [];
        }
    }

    public cleanEliminatoryBMeetings(cleanEliminatory: boolean) {
        for (let el of this.selectedTourney.eliminatoryBLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        if (cleanEliminatory) {
            for (let el of this.selectedTourney.eliminatoryBLevels) {
                el.eliminatories = [];
            }
            this.selectedTourney.eliminatoryBLevels = [];
        }
    }

    /** 
     * Loads all the meetings of the receìved tourney and round
     *  GET meetings by params. Will 404 if meetings not found 
     */
    reloadRoundMeeting(tourney: Tourney, round : Round, complete: () => void ) :  Observable<MeetingDb[]> {
        let url = this.loadMeetingByRoundIdUrl + "/" + tourney.id + "/" + round.id;

        console.log("Url=" + url);

        const subsbr :Observable<MeetingDb[]> = this.http.get<MeetingDb[]>(url);
        subsbr.pipe(tap(_ => this.log('fetched MeetingDb url=' + url)),
            catchError(this.handleError<MeetingDb[]>('loadRoundMeetingDb url=' + url))
        );

        subsbr.subscribe(t => this.onCompleteLoad(round, t, complete), e => this.onError(e) );

        return subsbr;
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
        this.prepareCaption(meetingsNo, allDaysNo, round);
    }

    private prepareCaption(meetingsNo: number, allDaysNo: number, r : Round) {
        if (this.selectedTourney.isOnewayRound == "true") {
            this.meetingsNoMsg = r.name + ": " + meetingsNo + " incontri in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = r.name + ": " + meetingsNo * 2 + " incontri in " + allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }

    public onCompleteLoad(round: Round, mdbList: MeetingDb[], complete: () => void ) {
        this.mdbList = mdbList;
        this.extractRoundMeetings(round, mdbList);
        let allDaysNo = round.daysNo;
        let meetingsNo = round.onewayMeetings.length;
        this.isRoundTrip = false;
        this.prepareCaption(meetingsNo, allDaysNo, round);
        complete();
    }

    /**
     * Prepares the meetings only if there was the changes in the teams or in the round configurations
     */
    private prepareMeetings(round : Round) {
        let teamNames: string[] = [...round.teamNames];
        const teams : Team[] = [];
        for( let tn of teamNames ) {
            const t : Team | undefined = this.selectedTourney.teams.find( e => e.teamName === tn);
            if( t != undefined) {
                teams.push(t);
            }                    
        }
        let grouppedTeams : Team[] = []; 
        if (this.selectedTourney.teamsWeightEnabled === "group") {
            const teamsByAsd = new Map<string, Team[]>();
            for (const team of teams) { // Group teams by ASD.
                const asd = team.asd ?? "";
                if (!teamsByAsd.has(asd)) {
                    teamsByAsd.set(asd, []);
                }
                teamsByAsd.get(asd)!.push(team);
            }
            // Sort ASD groups by number of teams, descending.
            const sortedGroups = [...teamsByAsd.entries()].sort((a, b) => b[1].length - a[1].length);
            for (const [asd, asdTeams] of sortedGroups) {
                grouppedTeams.push(...asdTeams);
            }

            // const teamsByAsd = new Map<string, Team[]>();
            // for (const team of teams) {
            //     const asd = team.asd ?? "";
            //     if (!teamsByAsd.has(asd)) {
            //         teamsByAsd.set(asd, []);
            //     }
            //     teamsByAsd.get(asd)!.push(team);
            // }
            // // Sort ASD groups by number of teams, descending.
            // const sortedGroups = [...teamsByAsd.entries()].sort(
            //     (a, b) => b[1].length - a[1].length
            // );
            // const grouppedTeams: Team[] = new Array(teams.length);
            // let left = 0;
            // let right = teams.length - 1;
            // for (const [, asdTeams] of sortedGroups) {
            //     for (let i = 0; i < asdTeams.length; i++) {
            //         grouppedTeams[left++] = asdTeams[i];
            //         grouppedTeams[right--] = asdTeams[asdTeams.length - i - 1];
            //     }
            // }
        } else {
            grouppedTeams = teams;
        }

        if( grouppedTeams.length % 2 != 0 ) {
            const dummyTeam : Team = new Team();
            dummyTeam.teamName = MeetingService.SKIPING_TEAM;
            grouppedTeams.push(dummyTeam);
        }
        this.applyBergerAlgorithm(round, grouppedTeams);
        this.completeMeetings(round);
        round.pageSize = round.onewayMeetings.length / round.daysNo

        console.log("[Meetings " + round.onewayMeetings.length + "]");
        console.log("[Days     " + round.daysNo + "]");
        console.log("[PageSize " + round.pageSize + "]");
    }
   
    /**
     * Prepares the meetings of the teams using the Berger algorithm
     */
    private applyBergerAlgorithm(round: Round, teams : Team[]): void {
        let teamsNo = teams.length;
        round.daysNo = teamsNo - 1;
        const halfTeams : number =  teamsNo / 2;
        let home : Array<Team>  = new Array<Team>(halfTeams);
        let away : Array<Team>  = new Array<Team>(halfTeams);
        for (let i = 0; i < teamsNo / 2; i++) {
            home[i] = teams[i];
            away[i] = teams[teamsNo - 1 - i];
        }
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
        for (let i = 0; i < round.daysNo; i++) {
            let day: number = i + 1;
            if(!this.onewayMeetingDaysMap.has(day)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(day, emptyList);
            }
            let meetingList = this.onewayMeetingDaysMap.get(day);
            if( !meetingList ) continue;
            if (i % 2 == 0) {
                for (let j = 0; j < halfTeams; j++) {
                    let t1: Team = home[j];
                    let t2: Team = away[j];
                    console.log( day + "° Giornata: " + t2.teamName  + " <-> " + t1.teamName );
                    let mfound = round.onewayMeetings.find(m => this.whereCondition(m, t2.teamName, t1.teamName));
                    if( mfound == undefined ) {
                        mfound = this.newMeeting(t2.teamName, t1.teamName, day, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            } else {
                for (let j = 0; j < halfTeams; j++) {
                    let t1: Team = home[j];
                    let t2: Team = away[j];
                    console.log( day + "° Giornata: " + t1.teamName  + " <-> " + t2.teamName );
                    let mfound = round.onewayMeetings.find(m => this.whereCondition(m, t1.teamName, t2.teamName));
                    if( mfound == undefined ) {
                        mfound = this.newMeeting(t1.teamName, t2.teamName, day, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            }
            meetingList = MeetingService.sortMeetings(meetingList);
            let pivot : Team  = home[0];
            let riporto : Team  = away[away.length - 1];
            away = this.shiftRight(away, home[1]);
            home = this.shiftLeft(home, riporto);
            home[0] = pivot;
        }
    }

    private whereCondition(m: Meeting, t1: string | null, t2: string | null) : boolean {
        return m.teamName1 == t1 && m.teamName2 == t2;
    }

     /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private completeMeetings(round : Round): void {
        round.onewayMeetings = [];
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for (let key of this.onewayMeetingDaysMap.keys()) {
            let onewayMeetings  = this.onewayMeetingDaysMap.get(key);
            if( !onewayMeetings ) continue;
            for( let m of onewayMeetings ) {   
                let rtm = round.roundtripMeetings.find( i => this.whereCondition(m, m.teamName2, m.teamName1));
                if( rtm == undefined ) {
                    rtm = this.newMeeting(m.teamName2, m.teamName1, m.day, Direction.RoundTrip);
                }
                if( !this.roundtripMeetingDaysMap.has(key) ) {
                    let emptyList: Meeting[] = [];
                    this.roundtripMeetingDaysMap.set(key, emptyList);
                }
                let dayList = this.roundtripMeetingDaysMap.get(key);
                if( dayList )
                    dayList.push(rtm);
            }
            round.onewayMeetings = round.onewayMeetings.concat(onewayMeetings);
        }
         
        round.roundtripMeetings = [];
        for (let key of this.roundtripMeetingDaysMap.keys()) {
            let dayList = this.roundtripMeetingDaysMap.get(key);
            if( !dayList ) continue;
            dayList = MeetingService.sortMeetings(dayList);
            round.roundtripMeetings = round.roundtripMeetings.concat(dayList);
        }
    }

    public override newMeeting(t1: string | null, t2: string| null, day: number, d: Direction): Meeting {
        let skiping: boolean = t1 == MeetingService.SKIPING_TEAM || t2 == MeetingService.SKIPING_TEAM;
        let m = this.createMeeting(t1, t2, null, null, day, d, skiping);
        return m;
    }
    
    protected override makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
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

    public shiftOnewayDay( currentDay : number) : any[] | undefined {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        return this.onewayDays;
    }

    public shiftRoundtripDay( currentDay : number ) : any[] | undefined  {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        return this.roundtripDays;
    }

    saveEliminatoryMeetings(st : Tourney) {
        for (let el of st.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                for (let m of e.round.onewayMeetings) {
                    let observer = this.saveEliminatoryMeetingDb(m, st.id, e.id, this.saveMeetingErrorHandler());
                    observer.subscribe(mdb => this.saveEliminatoryMeetingNext(mdb, e, m));
                }
                for (let m of e.round.roundtripMeetings) {
                    let observer = this.saveEliminatoryMeetingDb(m, st.id, e.id, this.saveMeetingErrorHandler());
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

    public getOnewayMeetingsOfDay(md: number) : Meeting[] {
        let onewayMeetingDaysMap = this.onewayMeetingDaysMap;
        let onewayMeetings = onewayMeetingDaysMap.get(md);
        if( !onewayMeetings ) return [];
        onewayMeetings.sort((m1, m2) => this.sortMeeting(m1, m2));
        return onewayMeetings;
    }

    public getRoundtripMeetingsOfDay(md: number) : Meeting[]{
        let roundtripMeetingDaysMap = this.roundtripMeetingDaysMap;
        let roundtripMeetings = roundtripMeetingDaysMap.get(md);
        if( !roundtripMeetings ) return [];
        roundtripMeetings.sort((m1, m2) => this.sortMeeting(m1, m2));
        return roundtripMeetings;
    }

    public printPdfPlayoffMeeting( selectedTourney: Tourney) {
        this.isFirstRound = true;
        const rounds : Round[] = selectedTourney.playoffVO.playoffs.map((p) => {return p.round;});
        const both : boolean = selectedTourney.isOnewayPlayoff != "true";
        const roundName : string = selectedTourney.playoffTabName==null?'Play Off':selectedTourney.playoffTabName;
        this.doPrintPdfMeeting(selectedTourney, rounds, both, roundName);
    }

    public printPdfPlayoutMeeting( selectedTourney: Tourney) {
        this.isFirstRound = true;
        const rounds : Round[] = selectedTourney.playoutVO.playoffs.map((p) => {return p.round;});
        const both : boolean = selectedTourney.isOnewayPlayout != "true";
        const roundName : string = selectedTourney.playoutTabName==null?'Play Out':selectedTourney.playoutTabName;
        this.doPrintPdfMeeting(selectedTourney, rounds, both, roundName);
    }

    public printPdfMeeting( selectedTourney: Tourney) {
        this.isFirstRound = true;
        const both : boolean = selectedTourney.isOnewayRound != "true";
        const roundName : string = selectedTourney.roundTabName==null?'Girone':selectedTourney.roundTabName;
        this.doPrintPdfMeeting(selectedTourney, selectedTourney.roundVO.rounds, both, roundName);
    }

    public printPdfSingleRound(selectedTourney: Tourney, selectedRound: Round, addedTeamInProgressList : Meeting []) {
        this.isFirstRound = true;
        const both : boolean = selectedTourney.isOnewayRound != "true";
        const roundName : string = selectedTourney.roundTabName==null?'Girone':selectedTourney.roundTabName;
        const round : Round = new Round();
        const rounds : Round[] = [];
        rounds.push(round);
        round.name = selectedRound.name;
        round.daysNo = selectedRound.daysNo;
        round.onewayCurrentDay = selectedRound.onewayCurrentDay;
        round.roundtripCurrentDay = selectedRound.roundtripCurrentDay;
        round.pageSize = selectedRound.pageSize;
        round.label = selectedRound.label;
        for( let m of addedTeamInProgressList ) {
            if( m.direction === Direction.OneWay ) {
                round.onewayMeetings.push(m);
            } else {
                round.roundtripMeetings.push(m);
            }
        }

        this.doPrintPdfMeeting(selectedTourney, rounds, both, roundName);
    }

    private doPrintPdfMeeting(selectedTourney: Tourney, rounds: Round[], both: boolean, roundName: string) {
        const doc = new jsPDF();
        this.selectedTourney = selectedTourney;

        // --- SECTION 1: ANDATA (HOME) ---
        if( both ) {
            this.printFullDirection(doc, rounds, roundName, "Andata", false);
        } else {
            this.printFullDirection(doc, rounds, roundName, null, false);
        }

        // --- SECTION 2: RITORNO (AWAY) ---
        if (both) {
            doc.addPage(); // Start Away meetings on a fresh page
            this.printFullDirection(doc, rounds, roundName, "Ritorno", false);
        }

        doc.save(`Meetings-${roundName}-${this.selectedTourney.tourneyName}.pdf`);
    }

    public printFullDirection(doc: jsPDF, rounds: Round[], roundBaseName: string, directionLabel: string | null, fillpage: boolean) {
        let lastY = 20;
        
        // Initial Title
        doc.setFontSize(20);
        if( directionLabel ) {
            doc.text(`${this.selectedTourney.tourneyName} - ${directionLabel}`, 14, 15);
        } else {
            doc.text(`${this.selectedTourney.tourneyName}`, 14, 15);           
        }

        for (let i = 0; i < rounds.length; i++) {
            const r = rounds[i];
            if (!fillpage) {
                if (i > 0) {
                    doc.addPage();
                }
                lastY = 20;
            }

            this.prepareMeetingsMap(r);
            let currentRoundName = roundBaseName + " " + String.fromCharCode(65 + i);

            for (let md = 1; md <= r.daysNo; md++) {
                let meetingList: Meeting[] = (directionLabel == null || directionLabel === "Andata") 
                    ? this.getOnewayMeetingsOfDay(md) 
                    : this.getRoundtripMeetingsOfDay(md);

                if (meetingList.length > 0) {
                    let currentDayMeetings: any[] = [];
                    if( directionLabel ) {
                        this.collectMeetingData(currentDayMeetings, meetingList, currentRoundName, `${directionLabel},`, md, r.daysNo);
                    } else {
                        this.collectMeetingData(currentDayMeetings, meetingList, currentRoundName, null, md, r.daysNo);
                    }

                    const estimatedTableHeight = 10 + (currentDayMeetings.length * 10);
                    const pageHeight = doc.internal.pageSize.getHeight();

                    // Logic to check if we need a new page
                    if (lastY + estimatedTableHeight > pageHeight - 20 && lastY > 20) {
                        doc.addPage(); // Uncommented this to actually create the page
                        lastY = 20;
                        doc.setFontSize(20);
                        if( directionLabel ) {
                            doc.text(`${this.selectedTourney.tourneyName} - ${directionLabel}`, 14, 15);
                        } else {
                            doc.text(`${this.selectedTourney.tourneyName}`, 14, 15);
                        }
                    }

                    // --- HEADER LOGIC ---
                    // Show header ONLY if we are at the top of a page (lastY is 20)
                    const shouldShowHeader = (lastY === 20);
                    
                    this.printMeetingsByDirection(doc, currentDayMeetings, lastY, shouldShowHeader);
                    
                    // Update lastY for the next table
                    lastY = (doc as any).lastAutoTable.finalY + 10;
                }
            }
        }
    }

    /**
     * Helper to avoid repeating logic for pushing DTOs into the list
     */
    private collectMeetingData(mDtoList: MeetingDto[], meetingList: Meeting[], rn: string, dir: string | null, md: number, totalDays: number) {
        let newDate = new Date(meetingList[0].datetime);
        let range = this.dateFormatPipe.transform(newDate);
        // Add Header Row
        let header = new MeetingDto();
        header.round = rn;
        if( dir ) {
            header.direction = dir;
        }
        header.separator = true;
        header.md = md;
        header.days = totalDays;
        header.weekRange = range;
        mDtoList.push(header);
        for (let m of meetingList) {
            if (m.points1 >= 0) {
                // Data Row
                mDtoList.push({ 
                    round: rn, 
                    direction: dir == null ? " " : dir, 
                    separator: false, 
                    md: m.day, 
                    days: totalDays, 
                    weekRange: range, 
                    meeting: m 
                });
                // Signature Row
                mDtoList.push({ 
                    round: rn, 
                    direction: dir == null ? " " : dir, 
                    separator: false, 
                    md: m.day, 
                    days: totalDays, 
                    weekRange: range, 
                    meeting: m, 
                    signLine: true 
                });
            }
        }
    }
    
    private printMeetingsByDirection(doc: jsPDF, meetings: MeetingDto[], startY: number, showTableHeader: boolean) {
        autoTable(doc, {
            head: [["Data", "N°", "In Casa", "P1", "P2", "Fuori Casa"]],
            body: this.formatRoundData(meetings),
            startY: startY,
            margin: { top: 20, bottom: 20 },
            theme: 'striped',
            showHead: showTableHeader ? 'everyPage' : false, 
            rowPageBreak: 'avoid', 
            
            // This styles the general look of the header
            headStyles: {
                fillColor: [41, 128, 185], // Optional: standard blue
                textColor: 255,
                fontStyle: 'bold',
            },

            // This styles the columns for both Head and Body
            columnStyles: {
                0: { halign: 'center' }, // Data
                1: { halign: 'center' }, // N°
                2: { halign: 'right' },  // "In Casa"
                3: { halign: 'center', cellWidth: 15 }, // P1
                4: { halign: 'center', cellWidth: 15 }, // P2
                5: { halign: 'left' } // Fuori Casa
            },

            styles: { minCellHeight: 10, fontSize: 14 },
            
            // --- THE FIX FOR THE TYPESCRIPT ERROR ---
            didParseCell: (data) => {
                // Force horizontal alignment by index for the header specifically
                if (data.section === 'head') {
                    if (data.column.index === 2) {
                        data.cell.styles.halign = 'right';
                    }
                    if (data.column.index === 0 || data.column.index === 1 || data.column.index === 3 || data.column.index === 4) {
                        data.cell.styles.halign = 'center';
                    }
                }
            },
            didDrawCell: (data) => {
                // Check if we are in the body and in the score columns (P1=3, P2=4)
                if (data.section === 'body' && (data.column.index === 3 || data.column.index === 4)) {
                    // Get the actual text content
                    const cellText = data.cell.text.join('').trim();
                    // If the text is empty, draw the square
                    if (cellText === '') {
                        const boxSize = 8;
                        // Calculate center
                        const posX = data.cell.x + (data.cell.width - boxSize) / 2;
                        const posY = data.cell.y + (data.cell.height - boxSize) / 2;
                        doc.setDrawColor(0);
                        doc.setLineWidth(0.1); // Ensure line width is set for the rectangle
                        doc.rect(posX, posY, boxSize, boxSize, 'S');
                    }
                }
            }
        });
    }

    public formatRoundData(meetings: MeetingDto[]): any[] {
        const tableRows: any[] = [];
        meetings.forEach((dto) => {
            // 1. Handle Separator Row
            if (dto.separator) {
                tableRows.push([{
                    content: `${dto.round}: ${dto.direction} Giornata ${dto.md}/${dto.days}`,
                    colSpan: 6,
                    styles: { 
                        minCellHeight: 5,
                        halign: 'center', 
                        fillColor: [220, 220, 200], // Fixed: jsPDF uses [r, g, b]
                        fontStyle: 'bold' 
                    }
                }]);
                return; // Move to next dto
            }
            // 2. Handle Signature/Spacer Row
            if (dto.signLine) {
                tableRows.push([{
                    content: '',
                    colSpan: 6,
                    styles: { 
                        minCellHeight: 10,
                        lineColor: [0, 0, 0],
                        lineWidth: { bottom: 1.0, top: 0, left: 0, right: 0 }
                    }
                }]);
                return;
            }

            // 3. Handle Meeting Rows (Swapping logic here)
            const isRitorno = dto.direction.includes("Ritorno");

            // 3. Handle Meeting Rows
            // We loop through matches and push a NEW row for each match
            dto.meeting.matches.forEach(m => {
                // If it's Ritorno, Team 2 is now the Home team
                const matchNo = m.id + 1;
                const teamHome = isRitorno ? dto.meeting.teamName2 : dto.meeting.teamName1;
                const teamAway = isRitorno ? dto.meeting.teamName1 : dto.meeting.teamName2;
                const scoreHome = isRitorno ? m.score2 : m.score1;
                const scoreAway = isRitorno ? m.score1 : m.score2;

                const row = [
                    this.dateFormatPipe.transformWeek(dto.meeting.datetime),
                    matchNo,
                    teamHome,
                    (scoreHome === 0 && scoreAway === 0) ? '' : scoreHome.toString(),
                    (scoreHome === 0 && scoreAway === 0) ? '' : scoreAway.toString(),
                    teamAway
                ];
                tableRows.push(row);
            });
        });
        return tableRows;
    } 
}
