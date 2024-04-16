

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Round } from 'app/tourneyonline/domain/round';
import { Observable } from 'rxjs';

@Injectable()
export class MeetingPlayoffService extends MeetingService {
    
    constructor(protected http: HttpClient
        , protected tourneyService: TourneyService
        , protected router: Router
        , protected dateFormatPipe: DateFormatPipe
        ) 
    { 
        super( http, router, dateFormatPipe  );
        console.log("Constructor of MeetingPlayoffService");
    }

        /** 
     * Loads all the meetings of the receìved tourney id
     *  GET meetings by params. Will 404 if meetings not found 
     */
    reloadPlayoffMeetings(tourneyId: number, p: Playoff, complete: () => void, error: (error: any) => any ) : Observable<MeetingDb[]> {
        let obs = super.loadPlayoffMeeting(tourneyId, p.id, e => error(e));
        obs.subscribe(t => this.onPlayoffCompleteLoad(t, p, complete), e => error(e));
        return obs;
    }
    
    reloadPlayoutMeetings(tourneyId: number, p: Playoff, complete: () => void, error: (error: any) => any ) : Observable<MeetingDb[]> {
        let obs = super.loadPlayoutMeeting(tourneyId, p.id, e => error(e));
        obs.subscribe(t => this.onPlayoffCompleteLoad(t, p, complete), e => error(e));
        return obs;
    }

    private onPlayoffCompleteLoad(t: MeetingDb[], p: Playoff, complete: () => void ): void {
        this.mdbList = t;
        this.extractPlayoffMeetings(p, this.mdbList);

        if( this.selectedTourney.playoffVO.isPlayoffAutoGen == "true") {
            this.resolveAutomaticTeams(p);
            this.resolveAutomaticMeetings(p, this.selectedTourney.roundVO.rounds);
        } else {
            this.resolveManualTeams(p);
            this.resolveManualMeetings(p, this.selectedTourney.roundVO.rounds);
        }

        this.prepareMeetingsMap(p.round, false);
        complete();
    }
    
    createPlayoffMeeting(tourney: Tourney, playoff : Playoff ) : void {
        this.selectedTourney = tourney;
        this.doPlayoffMeeting(playoff);

        playoff.round.daysNo   = this.onewayMeetingDaysMap.size;
        playoff.round.pageSize = playoff.round.onewayMeetings.length / playoff.round.daysNo

        console.log("[Meetings " + playoff.round.onewayMeetings.length + "]");
        console.log("[Days     " + playoff.round.daysNo + "]");
        console.log("[PageSize " + playoff.round.pageSize + "]");
    }

    public onCompleteLoad(playoff: Playoff, mdbList: MeetingDb[]) {

        this.mdbList = mdbList;
        
        this.extractPlayoffMeetings(playoff, mdbList);

        this.prepareRuleName(playoff.round.onewayMeetings);
        this.prepareRuleName(playoff.round.roundtripMeetings);

        let allDaysNo = playoff.round.daysNo;
        let meetingsNo = playoff.round.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }
        
    private prepareRuleName(meetings: Meeting[]) {
        for (let m of meetings) {
            // m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
            this.makeRuleName(m.rule1, m.rule2);
        }
    }

    private doPlayoffMeeting( playoff: Playoff) {
        playoff.round.onewayMeetings = [];
        playoff.round.roundtripMeetings = [];

        this.preparePlayoffMeetingRules(playoff);

        this.onewayDaysNo = 1;
        this.shiftOnewayDays(this.onewayDaysNo);
        
        this.roundtripDaysNo = 1;
        this.shiftRoundtripDays(this.roundtripDaysNo);
        
        this.makeRuleNames(playoff);
        
        let allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = playoff.round.onewayMeetings.length;
        this.prepareCaption(meetingsNo, allDaysNo,  playoff.round);
    }

    private prepareCaption(meetingsNo: number, allDaysNo: number, r : Round) {
        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = r.name + ": " + meetingsNo + " incontri in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = r.name + ": " + meetingsNo * 2 + " incontri in " + allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }

    private makeRuleNames(playoff: Playoff) {
        let allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = playoff.round.onewayMeetings.length;  

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" +  meetingsNo + " in " + allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" +  meetingsNo*2 + " in " + allDaysNo*2 + " giornate (Andata e Ritorno)";
        }

        this.completeRuleNames(playoff.round.onewayMeetings);
        this.completeRuleNames(playoff.round.roundtripMeetings);
    }

    private completeRuleNames(meetings: Meeting[]) {
        for (let m of meetings) {
            let p1 = m.rule1.fromRound.position.label;
            let r1 = m.rule1.fromRound.round.label;
            let p2 = m.rule2.fromRound.position.label;
            let r2 = m.rule2.fromRound.round.label;

            let prefix = this.selectedTourney.roundVO.rounds.length == 1 ? "" : p1;
            m.ruleName1 = prefix + r1;
            
            prefix = this.selectedTourney.roundVO.rounds.length == 1 ? "" : p2;
            m.ruleName2 = prefix + r2;
            
            let rn = m.ruleName1 + " - " + m.ruleName2;
            m.ruleName = rn;
        }
    }

    private preparePlayoffMeetingRules(playoff: Playoff) {
        let rules: PlayoffRule[]  = playoff.playoffRules;      

        this.applyPlayoffBergerAlgorithm(playoff, rules);

        this.completePlayoffMeetings(playoff);
    }

    private prepareSkipingRule(isAutoGen : boolean): PlayoffRule {
        let posCB:     Combobox    = { label: "", value: 0 };
        let roundCB:   Combobox    = { label: MeetingService.SKIPING_TEAM , value: 0 };
        let fromRound: FromRound   = { id: this.tourneyService.getSequenceNumber()
            , isDummy: false
            , position: posCB
            , round: roundCB
            , bandPosition: posCB.value };
        let pr: PlayoffRule = { id: this.tourneyService.getSequenceNumber(), fromRound: fromRound, ruleName: MeetingService.SKIPING_TEAM, isDummy: true };
        return pr;
    } 
    
    /**
     * Prepares the meetings of the rules using the Berger algorithm
     */
    private applyPlayoffBergerAlgorithm(playoff: Playoff, rules: PlayoffRule[]): void {
        if( rules.length % 2 > 0 ) {
            let isAutoGen = this.selectedTourney.playoffVO.isPlayoffAutoGen == "true" ? true : false;
            let dummyRule: PlayoffRule = this.prepareSkipingRule(isAutoGen);
            rules.push(dummyRule);
        }
        let rulesNo = rules.length;
        let giornate = rulesNo - 1;

        /* crea gli array per le due liste in casa e fuori */
        let home : Array<PlayoffRule>  = new Array<PlayoffRule>(rulesNo / 2);
        let away : Array<PlayoffRule>  = new Array<PlayoffRule>(rulesNo / 2);

        for (let i = 0; i < rulesNo / 2; i++) {
            home[i] = rules[i];
            away[i] = rules[rulesNo - 1 - i];
        }

        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();

        for (let i = 0; i < giornate; i++) {
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
                let rn = rulesNo / 2;
                for (let j = 0; j < rn; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + ") " + rule2 + " - " + rule1);

                    let mfound = playoff.round.onewayMeetings.find( m => this.isEquals(m, pr2, pr1));

                    if( mfound == undefined ) {
                        let skip = pr1.ruleName.indexOf(MeetingService.SKIPING_TEAM)!=-1 || pr2.ruleName.indexOf(MeetingService.SKIPING_TEAM)!=-1;
                        mfound = this.newPlayoffMeeting(pr2, pr1, key, Direction.OneWay, skip);
                    }
                    meetingList.push(mfound);
                }
            } else {
                for (let j = 0; j < rulesNo / 2; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + ") " + rule1 + " - " + rule2);

                    let mfound = playoff.round.onewayMeetings.find( m => this.isEquals(m, pr1, pr2));

                    if( mfound == undefined ) {
                        let skip = pr1.ruleName.indexOf(MeetingService.SKIPING_TEAM)!=-1 || pr2.ruleName.indexOf(MeetingService.SKIPING_TEAM)!=-1;
                        mfound = this.newPlayoffMeeting(pr1, pr2, key, Direction.OneWay, skip);
                    }
                    meetingList.push(mfound);
                }
            }

            meetingList = MeetingService.sortMeetings(meetingList);

            // Ruota gli elementi delle liste, tenendo fisso il primo elemento
            // Salva l'elemento fisso
            let pivot : PlayoffRule  = home[0];

            /*
             * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
             * uscente in "riporto"
             */
            let riporto : PlayoffRule  = away[away.length - 1];
            away = this.shiftRight(away, home[1]);

            // sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
            home = this.shiftLeft(home, riporto);

            // ripristina l'elemento fisso
            home[0] = pivot;
        }
    }

    protected isEquals(m: Meeting, pr1: PlayoffRule, pr2: PlayoffRule): boolean {
        let rule1: string = this.makeRule(pr1);
        let rule2: string = this.makeRule(pr2);

        let b: boolean = m.rule1.fromRound.position.label == rule2;
        b = b && m.rule2.fromRound.position.label == rule1;

        return b;
    }

    protected makeRuleName(pr1: PlayoffRule, pr2: PlayoffRule): string {
        if( pr1 == null && pr1 == null) {
            return "";
        }
    
        return this.makeRule(pr1) + " delle migliori " + this.makeRule(pr2);
    }
    
    protected makeRule(rule: PlayoffRule): string {
        return rule.fromRound.position.label + " del girone " + rule.fromRound.round.label;
    }
    
    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private completePlayoffMeetings(playoff: Playoff): void {
        playoff.round.onewayMeetings = [];
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for (let key of this.onewayMeetingDaysMap.keys()) {
            let onewayMeetings: Meeting[] = this.onewayMeetingDaysMap.get(key);

            for( let m of onewayMeetings ) {   
                // m.dateAndTime = this.dateFormatPipe.transform(m.datetime);

                let pr1 = m.rule1;
                let pr2 = m.rule2;
    
                let rtm = playoff.round.roundtripMeetings.find( i => this.isEquals(i, pr2, pr1));

                if( rtm == undefined ) {
                    rtm = this.newPlayoffMeeting(pr2, pr1, key, Direction.RoundTrip, m.isSkiping);
                }
                // rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);

                if( !this.roundtripMeetingDaysMap.has(key) ) {
                    let emptyList: Meeting[] = [];
                    this.roundtripMeetingDaysMap.set(key, emptyList);
                }
                let dayList = this.roundtripMeetingDaysMap.get(key);
                dayList.push(rtm);
            }

            playoff.round.onewayMeetings = playoff.round.onewayMeetings.concat(onewayMeetings);
        }
        
        for (let key of this.roundtripMeetingDaysMap.keys()) {
            let dayList = this.roundtripMeetingDaysMap.get(key);
            dayList = MeetingService.sortMeetings(dayList);
            playoff.round.roundtripMeetings = playoff.round.roundtripMeetings.concat(dayList);
        }
    }

    private newPlayoffMeeting(pr1: PlayoffRule, pr2: PlayoffRule, day: number, d: Direction, isSkiping: boolean): Meeting {
        let m: Meeting = this.createMeeting(null, null, pr1, pr2, day, d, isSkiping);
        return m;
    }

    private shiftLeft(data : PlayoffRule[] , add: PlayoffRule ) : PlayoffRule[] {

        let temp : Array<PlayoffRule>  = new Array<PlayoffRule>(data.length);

        for (let i = 0; i < data.length - 1; i++) {
            temp[i] = data[i + 1];
        }
        temp[data.length - 1] = add;
        return temp;
    }

    private shiftRight(data : PlayoffRule[] , add: PlayoffRule ): PlayoffRule[] {
        let temp : Array<PlayoffRule>  = new Array<PlayoffRule>(data.length);

        for (let i = 1; i < data.length; i++) {
            temp[i] = data[i - 1];
        }
        temp[0] = add;

        return temp;
    }

    private shiftOnewayDays( currentDay : number ) : any[] {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        for( let d of this.onewayDays ) {
            d.ruleName1 = d.rule1.fromRound.position.label + " " + d.rule1.fromRound.round.label;
            d.ruleName2 = d.rule2.fromRound.position.label + " " + d.rule2.fromRound.round.label;;
        }
        return this.onewayDays;
    }

    private shiftRoundtripDays( currentDay : number ) : any[] {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        for( let d of this.roundtripDays ) {
            d.ruleName1 = d.rule1.fromRound.position.label + " " + d.rule1.fromRound.round.label;
            d.ruleName2 = d.rule2.fromRound.position.label + " " + d.rule2.fromRound.round.label;;
        }
        return this.roundtripDays;
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.shiftOnewayDays(this.onewayDaysNo);
    }

    /**
     * Called every time at meeting reload in the automatic mode configuration,
     * resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    public resolveAutomaticTeams(playoff: Playoff) {
        let roundMatrix: Array<Array<Classification>> = this.tourneyService.createBestGlobalClassificationMatrix(this.selectedTourney.roundVO.rounds);
        playoff.round.teamNames = [];

        for(let pr of playoff.playoffRules ) {
            if( pr.isDummy ) {
                continue;
            }
            let row  = pr.fromRound.bandPosition;
            let col  = pr.fromRound.position.value;
            let teamName = roundMatrix[row-1][col-1].teamName;

            console.log(playoff.playoffName + "(" + pr.ruleName + ")=" + teamName);

            playoff.round.teamNames.push(teamName);
        }
    }

    /**
     * Called every time at meeting reload in the automatic mode configuration,
     * resolves the team names in the both oneway and rountrip meeting list applying
     * the corresponding rule present in the meeting
     */
    public resolveAutomaticMeetings(playoff: Playoff, rounds: Round[]) {
        let roundMatrix: Array<Array<Classification>> = this.tourneyService.createBestGlobalClassificationMatrix(rounds);
        let terminated: boolean = this.areAllTerminated(rounds);

        console.log("ANDATA: " + playoff.playoffName);
        for( let m of playoff.round.onewayMeetings ) {
            this.resolveAutomaticRules( m, terminated, roundMatrix );
        }

        console.log("RITORNO: " + playoff.playoffName);

        for( let m of playoff.round.roundtripMeetings ) {
            this.resolveAutomaticRules( m, terminated, roundMatrix );
        }
    }

    /**
     * Called every time at meeting reload, it resolves the playoff rules to their corresponding 
     * qualified teams from the tourney rounds
     */
    public resolveManualTeams(playoff : Playoff): void {
        playoff.round.teamNames = [];

        for( let rule of playoff.playoffRules ) {
            if( rule.isDummy ) {
                continue;
            }
            let position:  number = rule.fromRound.position.value;
            let roundName: string = rule.fromRound.round.label;

            let round = this.selectedTourney.roundVO.rounds.find( r => r.name == roundName );
            if( round != undefined ) {
                if( round.classification.length > 0 ) {
                    let c: Classification = round.classification[position-1];
    
                    // let teamName = rule.fromRound.position.label + " " + c.teamName;
                    playoff.round.teamNames.push(c.teamName);
                }
            }
        }
    }

    /**
     * Resolves the team names in the both oneway and rountrip meeting list applying
     * the the corresponding rule present in the meeting
     */
    public resolveManualMeetings(playoff : Playoff, rounds: Round[]): void {
        for( let m of playoff.round.onewayMeetings ) {
            this.resolveManualRules( m, rounds);
        }

        for( let m of playoff.round.roundtripMeetings ) {
            this.resolveManualRules( m, rounds);
        }
    }

    /**
     * Resolves the team names of the received meeting and round list applying the rule in the same meeting
     * 
     * @param m the meeting the name to resolve with
     * @param rounds the list of the rounds from which take the round names
     */
    private resolveManualRules( m: Meeting, rounds: Round[]): void {
        // m.dateAndTime = this.dateFormatPipe.transform(m.datetime, false);

        let teamName: string = null;
        if( m.isDummy ) {
            teamName =  m.rule1.fromRound.round.label;
        } else {
            teamName = this.findTeam(m.rule1, rounds);
        }
        m.teamName1 = teamName;
        m.ruleName1 = m.rule1.ruleName;

        if( m.isDummy ) {
            teamName =  m.rule2.fromRound.round.label;
        } else {
            teamName = this.findTeam(m.rule2, rounds);
        }
        m.teamName2 = teamName;
        m.ruleName2 = m.rule2.ruleName;
    }
    
    /**
     * Finds the team corresponding to the received rule
     * 
     * @param rule the playoff rule to associate to the qualified team
     */
    private findTeam(rule: PlayoffRule, rounds: Round[]): string {

        let position:  number = rule.fromRound.position.value;
        let roundName: string = rule.fromRound.round.label;

        let round = rounds.find( r => r.name == roundName );
        if( round != undefined ) {
            if( round.classification.length > 0 ) {
                let c: Classification = round.classification[position-1];
                let teamName = c.teamName;
                console.log("Resolved Team is [" + teamName + "]");
                return teamName;
            }
        }       
        return null;
    }
}
