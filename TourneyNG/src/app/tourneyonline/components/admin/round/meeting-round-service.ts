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
import { Observable, of } from 'rxjs';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MeetingDto } from './meeting-dto';

@Injectable()
export class MeetingRoundService extends MeetingService {

    isRoundAutoGen: string;
    isFirstRound: boolean;

    constructor(protected http: HttpClient
        , protected router: Router
        , protected tourneyService: TourneyService
        , protected clientService: ClientService
        , protected dateFormatPipe: DateFormatPipe ) 
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

    public saveRoundMeetings( st : TourneyVO
        , saveEH : (operation: string, result?: TourneyVO) => any
        , subscribeEH : (operation: string, result?: TourneyVO) => void
        , unBlockDocument: () => void)
    {
        this.selectedTourney = st;
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
 
    private saveTourneyNext(tvo: TourneyVO): void {
        console.log("saveTourneyNext()");
        console.log(tvo);
        this.selectedTourney.id = tvo.id;
    }

    public prepareTourneyVOForRound(cleanRounds: boolean) {
        this.cleanRoundMeetings(cleanRounds);
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
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

        this.makeTeamName(round.onewayMeetings);
        this.makeTeamName(round.roundtripMeetings);

        let allDaysNo = round.daysNo;
        let meetingsNo = round.onewayMeetings.length;
        this.isRoundTrip = false;

        this.prepareCaption(meetingsNo, allDaysNo, round);
        complete();
    }

    private makeTeamName(meetings: Meeting[]) {
        for(let m of meetings) {
            m.teamName1 = m.teamName1;
            m.teamName2 = m.teamName2;
        }
    }

    /**
     * Prepares the meetings only if there was the changes in the teams or in the round configurations
     */
    private prepareMeetings(round : Round) {

        let teams: string[] = [...round.teamNames];
        
        if( teams.length % 2 > 0 ) {
            let dummyTeam = MeetingService.SKIPING_TEAM;
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
    private applyBergerAlgorithm(round: Round, teams: string[]): void {
        let teamsNo = teams.length;
        round.daysNo = teamsNo - 1;

        /* crea gli array per le due liste in casa e fuori */
        let home : Array<string>  = new Array<string>(teamsNo / 2);
        let away : Array<string>  = new Array<string>(teamsNo / 2);

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
                    let t1: string = home[j];
                    let t2: string = away[j];
                    let day = j + 1;
                    console.log( day + " " + t2  + " - " + t1 );

                    let mfound = round.onewayMeetings.find( m => this.whereCondition(m, t2, t1));

                    if( mfound == undefined ) {
                        mfound = this.newMeeting(t2, t1, key, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            } else {
                for (let j = 0; j < teamsNo / 2; j++) {
                    let t1: string = home[j];
                    let t2: string = away[j];
                    let day = j + 1;
                    // console.log( day + " " + t1  + " - " + t2 );

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
            let pivot : string  = home[0];

            /*
             * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
             * uscente in "riporto"
             */
            let riporto : string  = away[away.length - 1];
            away = this.shiftRight(away, home[1]);

            //  sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
            home = this.shiftLeft(home, riporto);

            // ripristina l'elemento fisso
            home[0] = pivot;
        }
    }

    private whereCondition(m: Meeting, t1: string, t2: string) : boolean {

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
            let onewayMeetings: Meeting[] = this.onewayMeetingDaysMap.get(key);

            for( let m of onewayMeetings ) {   
                // m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
    
                let rtm = round.roundtripMeetings.find( i => this.whereCondition(m, m.teamName2, m.teamName1));

                if( rtm == undefined ) {
                    rtm = this.newMeeting(m.teamName2, m.teamName1, m.day, Direction.RoundTrip);
                    // rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);
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

    public newMeeting(t1: string, t2: string, day: number, d: Direction): Meeting {
        let skiping: boolean = t1 == MeetingService.SKIPING_TEAM || t2 == MeetingService.SKIPING_TEAM;
        let m = this.createMeeting(t1, t2, null, null, day, d, skiping);
        return m;
    }
    
    protected makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
        return "";
    }

    private shiftLeft(data : string[] , add: string ) : string[] {

        let temp : Array<string>  = new Array<string>(data.length);

        for (let i = 0; i < data.length - 1; i++) {
            temp[i] = data[i + 1];
        }
        temp[data.length - 1] = add;
        return temp;
    }

    private shiftRight(data : string[] , add: string ): string[] {
        let temp : Array<string>  = new Array<string>(data.length);

        for (let i = 1; i < data.length; i++) {
            temp[i] = data[i - 1];
        }
        temp[0] = add;

        return temp;
    }

    public shiftOnewayDay( currentDay : number) : any[] {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        // for( let d of this.onewayDays ) {
        //     d.teamName1 = d.teamName1;
        //     d.teamName2 = d.teamName2;
        // }
        return this.onewayDays;
    }

    public shiftRoundtripDay( currentDay : number ) : any[] {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        // for( let d of this.roundtripDays ) {
        //     d.teamName1 = d.teamName1;
        //     d.teamName2 = d.teamName2;
        // }
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
        onewayMeetings.sort((m1, m2) => this.sortMeeting(m1, m2));
        return onewayMeetings;
    }

    public getRoundtripMeetingsOfDay(md: number) : Meeting[]{
        let roundtripMeetingDaysMap = this.roundtripMeetingDaysMap;
        let roundtripMeetings = roundtripMeetingDaysMap.get(md);
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

    private doPrintPdfMeeting( selectedTourney: Tourney, rounds : Round[], both : boolean, roundName : string) {
        const doc = new jsPDF();
        this.selectedTourney = selectedTourney;

        let isAbsoluteFirstPAge = true;

        let i = 0;
        for (let r of  rounds ) {
            // 2. Prepare the data just for THIS specific round
            this.prepareMeetingsMap(r);
            // (Populate roundMeetings instead of a global meetings array)  
            let rn = roundName + " " + String.fromCharCode(65 + i);
            i++;
            for( let md = 1; md <= r.daysNo; md ++ ) {
                let ms = this.getOnewayMeetingsOfDay(md);
                // 1. If it's not the first round, add a new page
                if (!isAbsoluteFirstPAge) {
                    doc.addPage();
                }
                isAbsoluteFirstPAge = false;
                let meetings: MeetingDto[] = [];
                let newDate = new Date(ms[0].datetime);
                let range = this.dateFormatPipe.transform(newDate);
                let dto: MeetingDto = {round: rn, direction: "Andata,", separator: true, md: md, days: r.daysNo, weekRange: range};
                meetings.push(dto);
                for( let m of ms ) {
                    if( m.points1 >= 0 ) {
                        let dto: MeetingDto = {round: rn, direction: "Andata,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m};
                        meetings.push(dto);
                        dto = {round: rn, direction: "Andata,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m, signLine: true};
                        meetings.push(dto);
                    }
                }
                this.printMeetingsByDirection(doc, rn, meetings);
            } 
        }

        if ( both ) {
             i = 0;
            for (let r of rounds) {
                // 2. Prepare the data just for THIS specific round
                this.prepareMeetingsMap(r);
                let rn = roundName + " " + String.fromCharCode(65 + i);
                i++;
                for( let md = 1; md <= r.daysNo; md ++ ) {
                    let ms = this.getRoundtripMeetingsOfDay(md);
                    if (!isAbsoluteFirstPAge) {
                        doc.addPage();
                    }
                    isAbsoluteFirstPAge = false;
                    let meetings: MeetingDto[] = [];
                    let newDate = new Date(ms[0].datetime);
                    let range = this.dateFormatPipe.transform(newDate);
                    let dto: MeetingDto = {round: rn, direction: "Ritorno,", separator: true, md: md, days: r.daysNo, weekRange: range};
                    meetings.push(dto);
                    for( let m of ms ) {
                        if( m.points1 >= 0 ) {
                            dto = {round: rn, direction: "Ritorno,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m};
                            meetings.push(dto);
                            dto = {round: rn, direction: "Ritorno,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m, signLine: true};
                            meetings.push(dto);
                        }
                    }
                    this.printMeetingsByDirection(doc, rn, meetings);
                } 
            }
        }
        doc.save(`Meetings-${roundName}-${this.selectedTourney.tourneyName}.pdf`);
    }
    
    // 3. Add a Title for this specific Round page
    private printMeetingsByDirection(doc: jsPDF, roundName: string, meetings: MeetingDto[]) {
        doc.setFontSize(16);
        doc.text(`${this.selectedTourney.tourneyName} - ${roundName}`, 14, 15);
        // 4. Draw the table starting slightly below the text
        autoTable(doc, {
            head: [["Data","In Casa", "P1", "P2", "Fuori Casa"]],
            body: this.formatRoundData(meetings),
            startY: 20,
            theme: 'striped',
            columnStyles: {
                0: { halign: 'left', cellWidth: 'auto' },
                1: { halign: 'right', cellWidth: 'auto' },
                2: { halign: 'center', cellWidth: 15 },
                3: { halign: 'center', cellWidth: 15 },
                4: { halign: 'left', cellWidth: 'auto' }
            },
            didParseCell: (data) => {
                // Only apply this logic to the header row
                if (data.section === 'head') {
                    // 1. Shrink the height/area
                    data.cell.styles.fontSize = 10;      // Smaller font (default is usually 10)
                    data.cell.styles.cellPadding = 1;    // Minimum padding to tighten the area
                    data.cell.styles.minCellHeight = 8;  // Explicitly force a smaller height                    
                    if (data.column.index === 0) data.cell.styles.halign = 'left';
                    if (data.column.index === 1) data.cell.styles.halign = 'right';
                    if (data.column.index === 2) data.cell.styles.halign = 'center';
                    if (data.column.index === 3) data.cell.styles.halign = 'center';
                    if (data.column.index === 4) data.cell.styles.halign = 'left';
                }
            },
            styles: { minCellHeight: 12 }, // Ensure cell is tall enough for a 10mm box
            didDrawCell: (data) => {
                // Check if we are in the body and in the P1 or P2 columns (index 1 and 2)
                if (data.section === 'body' && (data.column.index === 2 || data.column.index === 3)) {
                    // Only draw if the content is empty (which means points were 0)
                    const boxSize = 10; // 10mm
                    if (data.cell.text[0] === '') {
                        // Calculate center of the cell to place the box
                        const posX = data.cell.x + (data.cell.width - boxSize) / 2;
                        const posY = data.cell.y + (data.cell.height - boxSize) / 2;
                        // Draw the rectangle (x, y, width, height, style)
                        doc.setDrawColor(0); // Black border
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
                    content: `${dto.direction} Giornata ${dto.md}/${dto.days}`,
                    colSpan: 5,
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
                    colSpan: 5,
                    styles: { 
                        minCellHeight: 10,
                        lineColor: [0, 0, 0],
                        lineWidth: { bottom: 1.0, top: 0, left: 0, right: 0 }
                    }
                }]);
                return;
            }

            // 3. Handle Meeting Rows (The Fix)
            // We loop through matches and push a NEW row for each match
            dto.meeting.matches.forEach(m => {
                const row = [
                    this.dateFormatPipe.transformWeek(dto.meeting.datetime),
                    dto.meeting.teamName1,
                    (m.score1 === 0 && m.score2 === 0) ? '' : m.score1,
                    (m.score1 === 0 && m.score2 === 0) ? '' : m.score2,
                    dto.meeting.teamName2
                ];
                tableRows.push(row);
            });
        });

        return tableRows;
    } 
}
