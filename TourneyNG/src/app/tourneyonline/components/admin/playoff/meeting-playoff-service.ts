

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Injectable()
export class MeetingPlayoffService extends MeetingService {


    constructor(protected http: HttpClient
        , protected router: Router
        , protected dateFormatPipe: DateFormatPipe
        ) 
    { 
        super( http, router, dateFormatPipe );
        console.log("Constructor of MeetingPlayoffService");
    }

    createPlayoffMeeting(tourney: Tourney, playoff : Playoff ) : void {
        this.selectedTourney = tourney;
        this.playoffMeetingNext(playoff);
    }

    public onCompleteLoad(playoff: Playoff, mdbList: MeetingDb[]) {

        this.mdbList = mdbList;
        
        this.extractRoundMeetings(playoff.round, mdbList);

        this.prepareMeetingsMap(playoff.round);

        this.onewayDaysNo = 1;
        this.shiftOnewayDays(this.onewayDaysNo);

        this.roundtripDaysNo = 1;
        this.shiftRoundtripDays(this.roundtripDaysNo);

        this.allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = playoff.round.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }

        this.completeAllMeetings();
    }

    private completeAllMeetings() {
        this.onewayMeetings = [];
        this.roundtripMeetings = [];
        for (let day = 1; day <= this.allDaysNo; day++) {
            this.onewayMeetings = this.onewayMeetings.concat(this.shiftOnewayDays(day));
            this.roundtripMeetings = this.roundtripMeetings.concat(this.shiftRoundtripDays(day));
        }
    }

    private playoffMeetingNext( playoff: Playoff) {
        playoff.round.onewayMeetings = [];
        playoff.round.roundtripMeetings = [];

        this.preparePlayoffRules(playoff);

        this.onewayDaysNo = 1;
        this.shiftOnewayDays(this.onewayDaysNo);
        
        this.roundtripDaysNo = 1;
        this.shiftRoundtripDays(this.roundtripDaysNo);
        
        this.makeRuleNames(playoff);
    }

    private makeRuleNames(playoff: Playoff) {
        this.allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = playoff.round.onewayMeetings.length;  

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            this.meetingsNoMsg = "" +  meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" +  meetingsNo*2 + " in " + this.allDaysNo*2 + " giornate (Andata e Ritorno)";
        }

        for (let m of playoff.round.onewayMeetings) {
            let p1 = m.rule1.fromRound.position.label;
            let r1 = m.rule1.fromRound.round.label;
            let p2 = m.rule2.fromRound.position.label;
            let r2 = m.rule2.fromRound.round.label;
            let rn1 = p1 + " " + r1;
            let rn2 = p2 + " " + r2;
            let rn = rn1 + " - " + rn2;
            m.ruleName = rn;
        }
    }

    private preparePlayoffRules(playoff: Playoff) {
        let rules: PlayoffRule[] = [...playoff.playoffRules];
        
        if( rules.length % 2 > 0 ) {
            let dummyRule: PlayoffRule = this.cloneObject(rules[0]);
            dummyRule.fromRound.position.label = "0";
            dummyRule.fromRound.position.value = 0;
            dummyRule.fromRound.round.label = "Riposo";
            dummyRule.fromRound.round.value = 0;
            dummyRule.id = null;

            rules.push(dummyRule);
        }

        this.applyPlayoffBergerAlgorithm(playoff, rules);

        this.completePlayoffMeetings(playoff);
    }

    /**
     * Prepares the meetings of the rules using the Berger algorithm
     */
    private applyPlayoffBergerAlgorithm(playoff: Playoff, rules: PlayoffRule[]): void {
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
                for (let j = 0; j < rulesNo / 2; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + " " + rule2 + " - " + rule1);

                    let mfound = playoff.round.onewayMeetings.find( m => this.isEquals(m, pr2, pr1));

                    if( mfound == undefined ) {
                        mfound = this.newMeeting(pr2, pr1, key, Direction.OneWay);
                    }

                    meetingList.push(mfound);
                }
            } else {
                for (let j = 0; j < rulesNo / 2; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + " " + rule1 + " - " + rule2);

                    let mfound = playoff.round.onewayMeetings.find( m => this.isEquals(m, pr1, pr2));

                    if( mfound == undefined ) {
                        mfound = this.newMeeting(pr1, pr2, key, Direction.OneWay);
                    }
                    meetingList.push(mfound);
                }
            }

            meetingList = this.sortMeetings(meetingList);

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
    
        return this.makeRule(pr1) + " " + this.makeRule(pr2);
    }
    
    protected makeRule(rule: PlayoffRule): string {
        return rule.fromRound.position.label + "." + rule.fromRound.round.label;
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
                m.dateAndTime = this.dateFormatPipe.transform(m.datetime);

                let pr1 = m.rule1;
                let pr2 = m.rule2;
    
                let rtm = playoff.round.roundtripMeetings.find( i => this.isEquals(i, pr2, pr1));

                if( rtm == undefined ) {
                    rtm = this.newMeeting(pr2, pr1, key, Direction.RoundTrip);
                    rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);
                }

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
            dayList = this.sortMeetings(dayList);
            playoff.round.roundtripMeetings = playoff.round.roundtripMeetings.concat(dayList);
        }
    }

    newMeeting(pr1: PlayoffRule, pr2: PlayoffRule, day: number, d: Direction): Meeting {
        let m: Meeting = this.createMeeting(null, null, pr1, pr2, day, d);
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

    private shiftOnewayDays(currentDay : number) : any[] {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        for( let d of this.onewayDays ) {
            d.ruleName1 = d.rule1.fromRound.position.label + " " + d.rule1.fromRound.round.label;
            d.ruleName2 = d.rule2.fromRound.position.label + " " + d.rule2.fromRound.round.label;;
        }
        return this.onewayDays;
    }

    private shiftRoundtripDays( currentDay : number) : any[] {
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

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.onewayMeetingDaysMap.size;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
        }
        this.shiftOnewayDays(this.onewayDaysNo);
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.shiftRoundtripDays(this.roundtripDaysNo);
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.roundtripMeetingDaysMap.size;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
        }
        this.shiftRoundtripDays(this.roundtripDaysNo);
    }
}
