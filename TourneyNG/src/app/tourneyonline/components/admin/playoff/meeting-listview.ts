import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminplayoff/lv/meetingLv/playoffRuledv";
    meetingsCols: TableCols[] ;
    rows: any[];

    msgs: Message[] = [];

    selectedPlayoff: Playoff;
    selectedMeeting: Meeting;
    meetingsNoMsg: string;

    isRoundTrip: boolean;
    meetingDaysMap: Map<number, Meeting[]>;
    onewayDaysNo: number;
    roundtripDaysNo: number;

    onewayDays: Meeting[];
    roundtripDays: Meeting[];
    selectedRow: Meeting;

    allDaysNo: number;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        private   dateFormatPipe: DateFormatPipe
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.meetingsCols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'ruleName',    header: 'Incontro' }
        ];

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        this.preparePlayoffRules();

        this.onewayDaysNo = 1;
        this.prepareOnewayDays();

        this.roundtripDaysNo = 1;
        this.prepareRoundtripDays();

        this.makeRuleNames();
    }
 
    private makeRuleNames() {
        this.allDaysNo = this.selectedPlayoff.playoffRules.length-1;

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayPlayoff == "true") {
            let meetingsNo = this.selectedPlayoff.round.onewayMeetings.length / 2;  
            this.meetingsNoMsg = "" +  meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            let meetingsNo = this.selectedPlayoff.round.onewayMeetings.length;  
            this.meetingsNoMsg = "" +  meetingsNo + " in " + this.allDaysNo*2 + " giornate (Andata e Ritorno)";
        }

        for (let m of this.selectedPlayoff.round.onewayMeetings) {
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

    private preparePlayoffRules() {
        let rules: PlayoffRule[] = [...this.selectedPlayoff.playoffRules];
        
        if( rules.length % 2 > 0 ) {
            let dummyRule: PlayoffRule = this.cloneObject(rules[0]);
            dummyRule.fromRound.position.label = "0";
            dummyRule.fromRound.position.value = 0;
            dummyRule.fromRound.round.label = "Riposo";
            dummyRule.fromRound.round.value = 0;
            dummyRule.id = null;

            rules.push(dummyRule);
        }

        this.applyBergerAlgorithm(rules);
    }

    /**
     * Prepares the meetings of the rules using the Berger algorithm
     */
    private applyBergerAlgorithm(rules: PlayoffRule[]): void {
        let rulesNo = rules.length;
        let giornate = rulesNo - 1;

        /* crea gli array per le due liste in casa e fuori */
        let home : Array<PlayoffRule>  = new Array<PlayoffRule>(rulesNo / 2);
        let away : Array<PlayoffRule>  = new Array<PlayoffRule>(rulesNo / 2);

        for (let i = 0; i < rulesNo / 2; i++) {
            home[i] = rules[i];
            away[i] = rules[rulesNo - 1 - i];
        }

        this.meetingDaysMap = new Map<number, Meeting[]>();

        for (let i = 0; i < giornate; i++) {
            /* stampa le partite di questa giornata */
            let key: number = i + 1;
            console.log( key + "° Giornata");
            if(!this.meetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.meetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.meetingDaysMap.get(key);

            /* alterna le partite in casa e fuori */
            if (i % 2 == 0) {
                for (let j = 0; j < rulesNo / 2; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + " " + rule2 + " - " + rule1);
                    let m = this.newMeeting(pr2, pr1, Direction.OneWay);
                    meetingList.push(m);
                }
            } else {
                for (let j = 0; j < rulesNo / 2; j++) {
                    let pr1: PlayoffRule = home[j];
                    let pr2: PlayoffRule = away[j];
                    let rule1: string = this.makeRule(pr1);
                    let rule2: string = this.makeRule(pr2);
                    console.log( (j + 1) + " " + rule1 + " - " + rule2);
                    let m = this.newMeeting(pr1, pr2, Direction.OneWay);
                    meetingList.push(m);
                }
            }

            // Ruota gli elementi delle liste, tenendo fisso il primo elemento
            // Salva l'elemento fisso
            let pivot : PlayoffRule  = home[0];

            /*
             * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
             * uscente in "riporto"
             */

            let riporto : PlayoffRule  = away[away.length - 1];
            away = this.shiftRight(away, home[1]);

            /*
             * sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
             */

            home = this.shiftLeft(home, riporto);

            // ripristina l'elemento fisso
            home[0] = pivot;
        }
    }

    private newMeeting(pr1: PlayoffRule, pr2: PlayoffRule, d: Direction): Meeting {
        let m: Meeting = this.createMeeting(null, null, pr1, pr2, d);
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

    private prepareOnewayDays() {
        let mk: number = this.onewayDaysNo;
        this.onewayDays = this.meetingDaysMap.get(mk);

        this.selectedPlayoff.round.onewayMeetings = [];

        for (let i = 0; i < this.onewayDays.length; i++) {
            let m = this.onewayDays[i];
            m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
        }
        this.onewayDays = this.sortMeetingRows(this.onewayDays);
        this.selectedPlayoff.round.onewayMeetings = this.selectedPlayoff.round.onewayMeetings.concat(this.onewayDays);
    }

    private prepareRoundtripDays( ) {
        let mk: number = this.roundtripDaysNo;
        let days = this.meetingDaysMap.get(mk);

        this.roundtripDays = [];
        for (let i = 0; i < days.length; i++) {
            let m = days[i];
            
            let rtm = this.cloneObject(m);
            rtm.rule1 = m.rule2;
            rtm.rule2 = m.rule1;
            rtm.direction = Direction.RoundTrip;

            let rule1: string = this.makeRule(rtm.rule1);
            let rule2: string = this.makeRule(rtm.rule2);

            rtm.name = rule1 + " - " + rule2; 

            rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);
            this.roundtripDays.push(rtm);
        }

        this.roundtripDays = this.sortMeetingRows(this.roundtripDays);
        this.selectedPlayoff.round.onewayMeetings = this.selectedPlayoff.round.onewayMeetings.concat(this.roundtripDays);
    }

    private makeRule(rule: PlayoffRule): string {
        return "" + rule.fromRound.position.value + "." + rule.fromRound.round.label;
    }

    private sortMeetingRows(meetings: any[]): any[] {
        return meetings.sort((m1, m2) => {
            if (m1.dateAndTime > m2.dateAndTime) {
                return 1;
            }
            if (m1.dateAndTime < m2.dateAndTime) {
                return -1;
            }
            if(m1.direction > m2.direction) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.prepareOnewayDays();
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.selectedPlayoff.playoffRules.length - 1;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
            return;
        }
        this.prepareOnewayDays();
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.prepareRoundtripDays();
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.selectedPlayoff.playoffRules.length - 1;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
            return;
        }
        this.prepareRoundtripDays();
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
    
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiornamento configurazione playoff fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

