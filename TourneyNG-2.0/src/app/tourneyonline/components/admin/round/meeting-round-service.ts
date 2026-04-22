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

    public saveRoundMeetings( st : TourneyVO
        , saveEH : (operation: string, result?: TourneyVO) => any
        , subscribeEH : (operation: string, result?: TourneyVO) => void
        , unBlockDocument: () => void)
    {
        this.selectedTourney = JSON.parse(st.json);
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

            let meetingList = this.onewayMeetingDaysMap.get(key);
            if( !meetingList ) continue;

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

    private doPrintPdfMeeting(selectedTourney: Tourney, rounds: Round[], both: boolean, roundName: string) {
        const doc = new jsPDF();
        this.selectedTourney = selectedTourney;

        // --- SECTION 1: ANDATA (HOME) ---
        this.printFullDirection(doc, rounds, roundName, "Andata");

        // --- SECTION 2: RITORNO (AWAY) ---
        if (both) {
            doc.addPage(); // Start Away meetings on a fresh page
            this.printFullDirection(doc, rounds, roundName, "Ritorno");
        }

        doc.save(`Meetings-${roundName}-${this.selectedTourney.tourneyName}.pdf`);
    }

    private printFullDirection(doc: jsPDF, rounds: Round[], roundBaseName: string, directionLabel: string) {
        let lastY = 20;

        // Initial Title for the direction
        doc.setFontSize(16);
        doc.text(`${this.selectedTourney.tourneyName} - ${directionLabel}`, 14, 15);

        for (let i = 0; i < rounds.length; i++) {
            const r = rounds[i];
            if (i > 0) {
                doc.addPage();
            }
            lastY = 20; 
            this.prepareMeetingsMap(r);
            let currentRoundName = roundBaseName + " " + String.fromCharCode(65 + i);

            for (let md = 1; md <= r.daysNo; md++) {
                // Pick correct data based on direction
                let ms: Meeting[] = (directionLabel === "Andata") 
                    ? this.getOnewayMeetingsOfDay(md) 
                    : this.getRoundtripMeetingsOfDay(md);

                if (ms.length > 0) {
                    let currentDayMeetings: any[] = [];
                    this.collectMeetingData(currentDayMeetings, ms, currentRoundName, `${directionLabel},`, md, r.daysNo);

                    const estimatedTableHeight = 10 + (currentDayMeetings.length * 10);
                    const pageHeight = doc.internal.pageSize.getHeight();

                    // Packing Logic: If it doesn't fit AND we aren't already at the top
                    if (lastY + estimatedTableHeight > pageHeight - 20 && lastY > 20) {
                        doc.addPage();
                        lastY = 20;
                        doc.setFontSize(16);
                        doc.text(`${this.selectedTourney.tourneyName} - ${directionLabel}`, 14, 15);
                    }

                    this.printMeetingsByDirection(doc, currentDayMeetings, lastY);
                    lastY = (doc as any).lastAutoTable.finalY + 10;
                }
            }
        }
    }

    private printMeetingsByDirection(doc: jsPDF, meetings: any[], startY: number) {
        autoTable(doc, {
            head: [["Data", "In Casa", "P1", "P2", "Fuori Casa"]],
            body: this.formatRoundData(meetings),
            startY: startY,
            margin: { top: 20, bottom: 20 },
            theme: 'striped',
            rowPageBreak: 'avoid', 
            columnStyles: {
                0: { halign: 'left', cellWidth: 'auto' },
                1: { halign: 'right', cellWidth: 'auto' },
                2: { halign: 'center', cellWidth: 15 },
                3: { halign: 'center', cellWidth: 15 },
                4: { halign: 'left', cellWidth: 'auto' }
            },
            // ... Keep your didParseCell, styles, and didDrawCell exactly as they were ...
            didParseCell: (data) => { /* your existing code */ },
            styles: { minCellHeight: 10, fontSize: 9 },
            didDrawCell: (data) => {
                if (data.section === 'body' && (data.column.index === 2 || data.column.index === 3)) {
                    if (data.cell.text[0] === '') {
                        const boxSize = 8;
                        const posX = data.cell.x + (data.cell.width - boxSize) / 2;
                        const posY = data.cell.y + (data.cell.height - boxSize) / 2;
                        doc.setDrawColor(0);
                        doc.rect(posX, posY, boxSize, boxSize, 'S');
                    }
                }
            }
        });
    }

    /**
     * Helper to avoid repeating logic for pushing DTOs into the list
     */
    private collectMeetingData(list: MeetingDto[], ms: any[], rn: string, dir: string, md: number, totalDays: number) {
        let newDate = new Date(ms[0].datetime);
        let range = this.dateFormatPipe.transform(newDate);
        // Add Header Row
        let header = new MeetingDto();
        header.round = rn;
        header.direction = dir;
        header.separator = true;
        header.md = md;
        header.days = totalDays;
        header.weekRange = range;
        list.push(header);
        for (let m of ms) {
            if (m.points1 >= 0) {
                // Data Row
                list.push({ 
                    round: rn, 
                    direction: dir, 
                    separator: false, 
                    md: m.day, 
                    days: totalDays, 
                    weekRange: range, 
                    meeting: m 
                });
                // Signature Row
                list.push({ 
                    round: rn, 
                    direction: dir, 
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
    
    public formatRoundData(meetings: MeetingDto[]): any[] {
        const tableRows: any[] = [];
        meetings.forEach((dto) => {
            // 1. Handle Separator Row
            if (dto.separator) {
                tableRows.push([{
                    content: `${dto.round}: ${dto.direction} Giornata ${dto.md}/${dto.days}`,
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

            // 3. Handle Meeting Rows (Swapping logic here)
            const isRitorno = dto.direction.includes("Ritorno");

            // 3. Handle Meeting Rows
            // We loop through matches and push a NEW row for each match
            dto.meeting.matches.forEach(m => {
                // If it's Ritorno, Team 2 is now the Home team
                const teamHome = isRitorno ? dto.meeting.teamName2 : dto.meeting.teamName1;
                const teamAway = isRitorno ? dto.meeting.teamName1 : dto.meeting.teamName2;
                const scoreHome = isRitorno ? m.score2 : m.score1;
                const scoreAway = isRitorno ? m.score1 : m.score2;

                const row = [
                    this.dateFormatPipe.transformWeek(dto.meeting.datetime),
                    teamHome,
                    (scoreHome === 0 && scoreAway === 0) ? '' : scoreHome,
                    (scoreHome === 0 && scoreAway === 0) ? '' : scoreAway,
                    teamAway
                ];
                tableRows.push(row);
            });
        });
        return tableRows;
    } 
}
