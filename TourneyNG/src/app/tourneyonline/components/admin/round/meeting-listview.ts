import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'app/components/common/api';

import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingKey } from 'app/tourneyonline/domain/meeting.key';
import { Team } from 'app/tourneyonline/domain/team';

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
    
    meetingsNoMsg: string;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
    onewayDays: Meeting[];

    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: Meeting[];

    isRoundTrip: boolean;
    allDaysNo: number;
    daysNoMsg: string;

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

        this.selectedRound = this.tourneyService.selectedRound;

        this.cols = [
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'name',        header: 'Incontro' }
        ];

        this.prepareMeetings();
        this.completeMeetings();

        this.onewayDaysNo = 1;
        this.showOnewayDay(this.onewayDaysNo);

        this.roundtripDaysNo = 1;
        this.showRoundtripDay(this.roundtripDaysNo);
        
        this.sortOnewayDays();
        this.sortRoundtripDays();

        this.atLeast2teams = this.selectedRound.onewayMeetings.length >= 1 ? true : false;

        this.allDaysNo = this.selectedRound.teams.length-1;

        this.isRoundTrip = false;
        if(this.selectedTourney.isOnewayRound == "true") {
            let meetingsNo = this.selectedRound.onewayMeetings.length;  
            this.meetingsNoMsg = "" +  meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            let meetingsNo = this.selectedRound.roundtripMeetings.length;  
            this.meetingsNoMsg = "" +  meetingsNo + " in " + this.allDaysNo*2 + " giornate (Andata e Ritorno)";
        }
    }

    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private completeMeetings(): void {
        this.selectedRound.roundtripMeetings = [];
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for (let key of this.onewayMeetingDaysMap.keys()) {
            let onewayMeetings: Meeting[] = this.onewayMeetingDaysMap.get(key);

            for( let m of onewayMeetings ) {   
                m.dateAndTime = this.dateFormatPipe.transform(m.datetime);
    
                let rtm = this.cloneObject(m);
                rtm.team1 = m.team2;
                rtm.team2 = m.team1;
                rtm.name = rtm.team1.teamName + " - " + rtm.team2.teamName ; 
                rtm.direction = Direction.RoundTrip;
    
                rtm.dateAndTime = this.dateFormatPipe.transform(rtm.datetime);

                if( !this.roundtripMeetingDaysMap.has(key) ) {
                    let emptyList: Meeting[] = [];
                    this.roundtripMeetingDaysMap.set(key, emptyList);
                }
                let dayList = this.roundtripMeetingDaysMap.get(key);
                dayList.push(rtm);
                this.selectedRound.roundtripMeetings.push(rtm);
            }
        }
    }

    /**
     * Prepares the meetings only if there was the changes in the teams or in the round configurations
     */
    private prepareMeetings() {

        if( this.selectedRound.onewayMeetings.length > 0 ) {
            this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
            for( let m of this.selectedRound.onewayMeetings ) {

                let days = this.selectedRound.onewayMeetings.length / this.selectedRound.teams.length;

                for( let key = 1; key <= days; key++ ) {
                    if( !this.onewayMeetingDaysMap.has(key) ) {
                        let emptyList: Meeting[] = []; 
                        this.onewayMeetingDaysMap.set(key, emptyList);
                    }
                    let mList = this.onewayMeetingDaysMap.get(key);

                    mList.push(m);
                }
            }
        } else {
            let teams: Team[] = [...this.selectedRound.teams];
            
            if( teams.length % 2 > 0 ) {
                let dummyTeam: Team = this.cloneObject(teams[0]);
                dummyTeam.teamName = "Riposo";
                dummyTeam.id = null;
    
                teams.push(dummyTeam);
            }
    
            this.applyBergerAlgorithm(teams);
        }
    }

    private sortOnewayDays(): any {
        this.selectedRound.onewayMeetings = this.sortMeetings(this.selectedRound.onewayMeetings);
    }

    private sortRoundtripDays(): any {
        this.selectedRound.roundtripMeetings = this.sortMeetings(this.selectedRound.roundtripMeetings);
    }

    /**
     * Prepares the meetings of the teams using the Berger algorithm
     */
    private applyBergerAlgorithm(teams: Team[]): void {
        let teamsNo = teams.length;
        let giornate = teamsNo - 1;

        /* crea gli array per le due liste in casa e fuori */
        let casa : Array<Team>  = new Array<Team>(teamsNo / 2);
        let trasferta : Array<Team>  = new Array<Team>(teamsNo / 2);

        for (let i = 0; i < teamsNo / 2; i++) {
            casa[i] = teams[i];
            trasferta[i] = teams[teamsNo - 1 - i];
        }

        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
        this.selectedRound.onewayMeetings = [];

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
                for (let j = 0; j < teamsNo / 2; j++) {
                    let t1: Team = casa[j];
                    let t2: Team = trasferta[j];
                    console.log( (j + 1) + " " + t2.teamName + " - " + t1.teamName);
                    let m = this.newMeeting(t2, t1, Direction.OneWay);
                    meetingList.push(m);
                }
            } else {
                for (let j = 0; j < teamsNo / 2; j++) {
                    let t1: Team = casa[j];
                    let t2: Team = trasferta[j];
                    console.log( (j + 1) + " " + t1.teamName + " - " + t2.teamName);
                    let m = this.newMeeting(t1, t2, Direction.OneWay);
                    meetingList.push(m);
                }
            }
            this.selectedRound.onewayMeetings = this.selectedRound.onewayMeetings.concat(meetingList);

            // Ruota gli elementi delle liste, tenendo fisso il primo elemento
            // Salva l'elemento fisso
            let pivot : Team  = casa[0];

            /*
             * sposta in avanti gli elementi di "trasferta" inserendo all'inizio l'elemento casa[1] e salva l'elemento
             * uscente in "riporto"
             */

            let riporto : Team  = trasferta[trasferta.length - 1];
            trasferta = this.shiftRight(trasferta, casa[1]);

            /*
             * sposta a sinistra gli elementi di "casa" inserendo all'ultimo posto l'elemento "riporto"
             */

            casa = this.shiftLeft(casa, riporto);

            // ripristina l'elemento fisso
            casa[0] = pivot;
        }
    }

    private newMeeting(t1: Team, t2: Team, d: Direction): Meeting {
        let m = this.createMeeting(t1, t2, null, null, d);
        return m;
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

    private showOnewayDay( currentDay : number) {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
    }

    private showRoundtripDay( currentDay : number ) {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.showOnewayDay(this.onewayDaysNo);
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.selectedRound.teams.length - 1;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
            return;
        }
        this.showOnewayDay(this.onewayDaysNo);
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.showRoundtripDay(this.roundtripDaysNo);
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.selectedRound.teams.length - 1;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
            return;
        }
        this.showRoundtripDay(this.roundtripDaysNo);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Aggiornamento configurazione gironi fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

