import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingRoundService } from './meeting-round-service';

@Component({
    templateUrl: './meeting-listview.html'
})
export class MeetingListView extends AbstractListView {
    static redirect: string = "adminround/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    msgs: Message[] = [];
    selectedRound: Round;
    atLeast2teams: boolean;
    
    // meetingsNoMsg: string;
    // onewayDaysNo: number;
    // roundtripDaysNo: number;
    
    // onewayMeetingDaysMap: Map<number, Meeting[]>;
    // onewayDays: any[];

    // roundtripMeetingDaysMap: Map<number, Meeting[]>;

    // roundtripDays: any[];

    isRoundTrip: boolean;
    
    // allDaysNo: number;
    // daysNoMsg: string;
    
    // mdbList: MeetingDb[];

    constructor(
        protected tourneyService: TourneyService,
        public meetingService: MeetingRoundService,
        protected router: Router,
        protected location: Location
    ) {
        super(MeetingListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;
        
        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName1',   header: 'In casa' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];
        
        this.atLeast2teams = this.selectedRound.teams.length >= 2 ? true : false;
        if(!this.atLeast2teams) {
            return;
        }

        this.isRoundTrip = true;
        if (this.selectedTourney.isOnewayRound == "true") {
            this.isRoundTrip = false;
        }

        // const subsbr = this.meetingService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        // subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onLoadRoundMeetingComplete());
    }

    onRowSelect(event) {
        console.log(event.data);

        this.meetingService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }

    // private onLoadRoundMeetingComplete() {

    //     this.selectedRound.onewayMeetings = [];
    //     this.selectedRound.roundtripMeetings = [];

    //     for( let mdb of this.mdbList ) {
    //         let m: Meeting = JSON.parse(mdb.json);
    //         if( m.direction == Direction.OneWay ) {
    //             this.selectedRound.onewayMeetings.push(m);
    //         } else {
    //             this.selectedRound.roundtripMeetings.push(m);
    //         }
    //     }

    //     this.prepareMeetings();

    //     this.onewayDaysNo = 1;
    //     this.shiftOnewayDay(this.onewayDaysNo);

    //     this.roundtripDaysNo = 1;
    //     this.shiftRoundtripDay(this.roundtripDaysNo);

    //     this.allDaysNo = this.onewayMeetingDaysMap.size;
    //     let meetingsNo = this.selectedRound.onewayMeetings.length;
    //     this.isRoundTrip = false;

    //     if (this.selectedTourney.isOnewayRound == "true") {
    //         this.meetingsNoMsg = "" + meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
    //     } else {
    //         this.isRoundTrip = true;
    //         this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
    //     }
    // }

    /**
     * Prepares the meetings only if there was the changes in the teams or in the round configurations
     */
    // private prepareMeetings() {

    //     let teams: Team[] = [...this.selectedRound.teams];
        
    //     if( teams.length % 2 > 0 ) {
    //         let dummyTeam: Team = this.cloneObject(teams[0]);
    //         dummyTeam.teamName = "Riposo";
    //         dummyTeam.id = null;

    //         teams.push(dummyTeam);
    //     }

    //     this.applyBergerAlgorithm(teams);

    //     this.completeMeetings();
    // }

    // /**
    //  * Prepares the meetings of the teams using the Berger algorithm
    //  */
    // private applyBergerAlgorithm(teams: Team[]): void {
    //     let teamsNo = teams.length;
    //     let giornate = teamsNo - 1;

    //     /* crea gli array per le due liste in casa e fuori */
    //     let home : Array<Team>  = new Array<Team>(teamsNo / 2);
    //     let away : Array<Team>  = new Array<Team>(teamsNo / 2);

    //     for (let i = 0; i < teamsNo / 2; i++) {
    //         home[i] = teams[i];
    //         away[i] = teams[teamsNo - 1 - i];
    //     }

    //     this.onewayMeetingDaysMap = new Map<number, Meeting[]>();

    //     for (let i = 0; i < giornate; i++) {
    //         /* stampa le partite di questa giornata */
    //         let key: number = i + 1;
    //         console.log( key + "° Giornata");
    //         if(!this.onewayMeetingDaysMap.has(key)) {
    //             let emptyList: Meeting[] = [];
    //             this.onewayMeetingDaysMap.set(key, emptyList);
    //         }

    //         let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);

    //         /* alterna le partite in casa e fuori */
    //         if (i % 2 == 0) {
    //             for (let j = 0; j < teamsNo / 2; j++) {
    //                 let t1: Team = home[j];
    //                 let t2: Team = away[j];
    //                 let day = j + 1;
    //                 console.log( day + " " + t2.teamName + " - " + t1.teamName);

    //                 let mfound = this.selectedRound.onewayMeetings.find( m => this.whereCondition(m, t2, t1));

    //                 if( mfound == undefined ) {
    //                     mfound = this.newMeeting(t2, t1, key, Direction.OneWay);
    //                 }
    //                 meetingList.push(mfound);
    //             }
    //         } else {
    //             for (let j = 0; j < teamsNo / 2; j++) {
    //                 let t1: Team = home[j];
    //                 let t2: Team = away[j];
    //                 let day = j + 1;
    //                 console.log( day + " " + t1.teamName + " - " + t2.teamName);

    //                 let mfound = this.selectedRound.onewayMeetings.find( m => this.whereCondition(m, t1, t2));

    //                 if( mfound == undefined ) {
    //                     mfound = this.newMeeting(t1, t2, key, Direction.OneWay);
    //                 }
    //                 meetingList.push(mfound);
    //             }
    //         }

    //         meetingList = this.sortMeetings(meetingList);

    //         // Ruota gli elementi delle liste, tenendo fisso il primo elemento
    //         // Salva l'elemento fisso
    //         let pivot : Team  = home[0];

    //         /*
    //          * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
    //          * uscente in "riporto"
    //          */
    //         let riporto : Team  = away[away.length - 1];
    //         away = this.shiftRight(away, home[1]);

    //         //  sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
    //         home = this.shiftLeft(home, riporto);

    //         // ripristina l'elemento fisso
    //         home[0] = pivot;
    //     }
    // }

    // private whereCondition(m: Meeting, t1: Team, t2: Team) : boolean {

    //     return m.team1.teamName == t1.teamName && m.team2.teamName == t2.teamName;
    // }

    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    // private completeMeetings(): void {
    //     this.selectedRound.onewayMeetings = [];
    //     this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

    //     for (let key of this.onewayMeetingDaysMap.keys()) {
    //         let onewayMeetings: Meeting[] = this.onewayMeetingDaysMap.get(key);

    //         for( let m of onewayMeetings ) {   
    //             m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
    
    //             let rtm = this.selectedRound.roundtripMeetings.find( i => this.whereCondition(m, m.team2, m.team1));

    //             if( rtm == undefined ) {
    //                 rtm = this.newMeeting(m.team2, m.team1, m.day, Direction.RoundTrip);
    //                 rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);
    //             }

    //             if( !this.roundtripMeetingDaysMap.has(key) ) {
    //                 let emptyList: Meeting[] = [];
    //                 this.roundtripMeetingDaysMap.set(key, emptyList);
    //             }
    //             let dayList = this.roundtripMeetingDaysMap.get(key);
    //             dayList.push(rtm);
    //         }

    //         this.selectedRound.onewayMeetings = this.selectedRound.onewayMeetings.concat(onewayMeetings);
    //     }
        
    //     this.selectedRound.roundtripMeetings = [];
    //     for (let key of this.roundtripMeetingDaysMap.keys()) {
    //         let dayList = this.roundtripMeetingDaysMap.get(key);
    //         dayList = this.sortMeetings(dayList);
    //         this.selectedRound.roundtripMeetings = this.selectedRound.roundtripMeetings.concat(dayList);
    //     }
    // }

    // private newMeeting(t1: Team, t2: Team, day: number, d: Direction): Meeting {
    //     let m = this.createMeeting(t1, t2, null, null, day, d);
    //     return m;
    // }

    // private shiftLeft(data : Team[] , add: Team ) : Team[] {

    //     let temp : Array<Team>  = new Array<Team>(data.length);

    //     for (let i = 0; i < data.length - 1; i++) {
    //         temp[i] = data[i + 1];
    //     }
    //     temp[data.length - 1] = add;
    //     return temp;
    // }

    // private shiftRight(data : Team[] , add: Team ): Team[] {
    //     let temp : Array<Team>  = new Array<Team>(data.length);

    //     for (let i = 1; i < data.length; i++) {
    //         temp[i] = data[i - 1];
    //     }
    //     temp[0] = add;

    //     return temp;
    // }

    // private shiftOnewayDay( currentDay : number) {
    //     this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
    //     for( let d of this.onewayDays ) {
    //         d.teamName1 = d.team1.teamName;
    //         d.teamName2 = d.team2.teamName;
    //     }
    // }

    // private shiftRoundtripDay( currentDay : number ) {
    //     this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
    //     for( let d of this.roundtripDays ) {
    //         d.teamName1 = d.team1.teamName;
    //         d.teamName2 = d.team2.teamName;
    //     }
    // }

    // goOnewayLeft() {
    //     console.log("goOnewayLeft()");
    //     this.onewayDaysNo--;
    //     if(this.onewayDaysNo < 1) {
    //         this.onewayDaysNo = 1;
    //     }
    //     console.log("daysKey=" + this.onewayDaysNo);
    //     this.shiftOnewayDay(this.onewayDaysNo);
    // }

    // goOnewayRight() {
    //     console.log("goOnewayLeft()");
    //     let M = this.onewayMeetingDaysMap.size;
    //     this.onewayDaysNo++;
    //     console.log("daysKey=" + this.onewayDaysNo);
    //     if(this.onewayDaysNo > M) {
    //         this.onewayDaysNo = M;
    //     }
    //     this.shiftOnewayDay(this.onewayDaysNo);
    // }

    // goRoundtripLeft() {
    //     console.log("goRoundtripLeft()");
    //     this.roundtripDaysNo--;
    //     if(this.roundtripDaysNo < 1) {
    //         this.roundtripDaysNo = 1;
    //     }
    //     console.log("daysKey=" + this.roundtripDaysNo);
    //     this.shiftRoundtripDay(this.roundtripDaysNo);
    // }

    // goRoundtripRight() {
    //     console.log("goRoundtripLeft()");
    //     let M = this.roundtripMeetingDaysMap.size;
    //     this.roundtripDaysNo++;
    //     console.log("daysKey=" + this.roundtripDaysNo);
    //     if(this.roundtripDaysNo > M) {
    //         this.roundtripDaysNo = M;
    //     }
    //     this.shiftRoundtripDay(this.roundtripDaysNo);
    // }

    // onError(n:any) {
    //     this.msgs = [];
    //     let msgerr : string;

    //     msgerr = 'Aggiornamento configurazione gironi fallita';
    //     this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    // }
}

