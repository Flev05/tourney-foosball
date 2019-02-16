import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingDetailView } from './meeting-detailview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { AbstractListView } from '../../common/abstract-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';

@Component({
    templateUrl: './round-result-listview.html'
})
export class RoundResultListView extends AbstractListView {
    static redirect: string = "result/lv/meetingLv/dv";
    cols: TableCols[] ;
    
    selectedRow: Meeting;

    selectedRound: Round;
    
    meetingsNoMsg: string;
    onewayDaysNo: number;
    roundtripDaysNo: number;
    
    onewayMeetingDaysMap: Map<number, Meeting[]>;
    onewayDays: any[];

    roundtripMeetingDaysMap: Map<number, Meeting[]>;
    roundtripDays: any[];

    isRoundTrip: boolean;
    allDaysNo: number;
    daysNoMsg: string;
    
    mdbList: MeetingDb[];
    incompleteRoundConfiguration: boolean;
    
    classificationCols: any[];
    classificationRows: any[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {

        super.ngOnInit();
        this.selectedRound = this.tourneyService.selectedRound;
        
        this.classificationCols = this.tourneyService.classificationCols;

        this.cols = [
            { field: 'teamName1',   header: 'In casa' },
            { field: 'dateAndTime', header: 'Data/Ora' },
            { field: 'teamName2',   header: 'Trasferta' }
        ];

        const subsbr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subsbr.subscribe(t => this.mdbList = t, e => this.onError(e), () => this.onCompleteLoad());
    }

    private onCompleteLoad() {

        this.selectedRound.onewayMeetings = [];
        this.selectedRound.roundtripMeetings = [];
        for( let mdb of this.mdbList ) {
            let m: Meeting = JSON.parse(mdb.json);
            if( m.direction == Direction.OneWay ) {
                this.selectedRound.onewayMeetings.push(m);
            } else {
                this.selectedRound.roundtripMeetings.push(m);
            }
        }

        this.incompleteRoundConfiguration = false;
        this.prepareMeetingMaps();
        if(this.selectedRound.onewayMeetings.length == 0) {
            this.incompleteRoundConfiguration = true;
            return;
        }

        this.prepareRoundGuiClassification();

        this.onewayDaysNo = 1;
        this.shiftOnewayDay(this.onewayDaysNo);

        this.roundtripDaysNo = 1;
        this.shiftRoundtripDay(this.roundtripDaysNo);

        this.allDaysNo = this.onewayMeetingDaysMap.size;
        let meetingsNo = this.selectedRound.onewayMeetings.length;
        this.isRoundTrip = false;

        if (this.selectedTourney.isOnewayRound == "true") {
            this.meetingsNoMsg = "" + meetingsNo + " in " + this.allDaysNo + " giornate (Solo Andata)";
        } else {
            this.isRoundTrip = true;
            this.meetingsNoMsg = "" + meetingsNo * 2 + " in " + this.allDaysNo * 2 + " giornate (Andata e Ritorno)";
        }
    }


    /**
     * Converts the date and time and complete the round trip meetings copying from 
     * its corresponding oneway meeting list
     */
    private prepareMeetingMaps(): void {
        this.onewayMeetingDaysMap = new Map<number, Meeting[]>();
        this.roundtripMeetingDaysMap = new Map<number, Meeting[]>();

        for( let m of this.selectedRound.onewayMeetings ) {

            m.dateAndTime = this.dfp.transform(m.datetime);

            if( m.points1 > 0 || m.points2 > 0 ) {
                m.dateAndTime = m.points1 + " - " + m.points2;
            }

            let key = m.day;
            // console.log( key + "° Giornata di andata");
            if(!this.onewayMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.onewayMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.onewayMeetingDaysMap.get(key);
            meetingList.push(m);
        }

        for( let m of this.selectedRound.roundtripMeetings ) {

            m.dateAndTime = this.dfp.transform(m.datetime);
            if( m.points1 > 0 || m.points2 > 0 ) {
                m.dateAndTime = m.points1 + " - " + m.points2;
            }

            let key = m.day;
            console.log( key + "° Giornata di ritorno");
            if(!this.roundtripMeetingDaysMap.has(key)) {
                let emptyList: Meeting[] = [];
                this.roundtripMeetingDaysMap.set(key, emptyList);
            }

            let meetingList: Meeting[] = this.roundtripMeetingDaysMap.get(key);
            meetingList.push(m);
        }
    }

    /**
     * Prepares the classification relatid to the selected round
     */
    private prepareRoundGuiClassification(): void {
        let allMeetings = this.selectedRound.onewayMeetings.concat(this.selectedRound.roundtripMeetings);
        this.selectedRound.classification = this.tourneyService.createClassification(allMeetings);

        this.classificationRows = this.tourneyService.prepareRoundsGui([this.selectedRound]);
    }

    private shiftOnewayDay( currentDay : number) {
        this.onewayDays = this.onewayMeetingDaysMap.get(currentDay);
        for( let d of this.onewayDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
    }

    private shiftRoundtripDay( currentDay : number ) {
        this.roundtripDays = this.roundtripMeetingDaysMap.get(currentDay);
        for( let d of this.roundtripDays ) {
            d.teamName1 = d.team1.teamName;
            d.teamName2 = d.team2.teamName;
        }
    }

    goOnewayLeft() {
        console.log("goOnewayLeft()");
        this.onewayDaysNo--;
        if(this.onewayDaysNo < 1) {
            this.onewayDaysNo = 1;
        }
        console.log("daysKey=" + this.onewayDaysNo);
        this.shiftOnewayDay(this.onewayDaysNo);
    }

    goOnewayRight() {
        console.log("goOnewayLeft()");
        let M = this.onewayMeetingDaysMap.size;
        this.onewayDaysNo++;
        console.log("daysKey=" + this.onewayDaysNo);
        if(this.onewayDaysNo > M) {
            this.onewayDaysNo = M;
        }
        this.shiftOnewayDay(this.onewayDaysNo);
    }

    goRoundtripLeft() {
        console.log("goRoundtripLeft()");
        this.roundtripDaysNo--;
        if(this.roundtripDaysNo < 1) {
            this.roundtripDaysNo = 1;
        }
        console.log("daysKey=" + this.roundtripDaysNo);
        this.shiftRoundtripDay(this.roundtripDaysNo);
    }

    goRoundtripRight() {
        console.log("goRoundtripLeft()");
        let M = this.roundtripMeetingDaysMap.size;
        this.roundtripDaysNo++;
        console.log("daysKey=" + this.roundtripDaysNo);
        if(this.roundtripDaysNo > M) {
            this.roundtripDaysNo = M;
        }
        this.shiftRoundtripDay(this.roundtripDaysNo);
    }

    onRowSelect(event) {
        console.log(event.data);

        this.tourneyService.selectedMeeting = this.selectedRow;

        this.gotoDetailView();
    }
}

