import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import {  PhaseType, Direction } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Team } from 'app/tourneyonline/domain/team';
import { DateFormatPipe } from './date-format-pipe';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';

export abstract class AbstractEliminatoryListView extends AbstractListView {
         
    eliminatoryCols: TableCols[] ;
    eliminatoryLevelRows: any[];
    selectedRow: any;

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;

    isTopLevel: boolean;

    isOneway: string;
    isStandalone: boolean;

    selectedLevelCombobox: Combobox;
    eliminatoryTeamsCombobox: Combobox[];
  
    elHttpCounter: number;
    eliminatoryRoundMap: Map<number, Round>;
    meetingMap: Map<number, MeetingDb[]>;

    roundHttpCounter: number;
    roundMap: Map<number, Round>;
    roundMeetingMap: Map<number, MeetingDb[]>;

    playoffHttpCounter: number;
    playoffRoundMap: Map<number, Playoff>;
    playoffMeetingMap: Map<number, MeetingDb[]>;

    roundRows:   any[] = [];
    playoffRows: any[] = [];

    constructor(
        protected redirect: string,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected router: Router,
        protected location: Location,
        protected dateFormatPipe: DateFormatPipe
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.meetingService.selectedTourney = this.tourneyService.selectedTourney;
        this.tourneyService.prepareEliminatoriesComboBoxes();
 
        if(this.tourneyService.selectedEliminatoryLevel!=undefined) {
            this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
            this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
            this.isOneway = this.selectedEliminatoryLevel.isOneway ? "true" : "false" ;
            this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
        }

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        
        this.eliminatoryTeamsCombobox = this.tourneyService.eliminatoryTeamsCombobox;
  
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
 
        if (this.selectedTourney.phases.length == 1 &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isStandalone = true;
        } else {
            this.isStandalone = false;
        }
        this.tourneyService.isStandalone = this.isStandalone;

        this.loadEliminatoryMeetings();
    }

    protected prepareGui() {
        if (this.isStandalone) {
            this.prepareStandaloneGui();
        } else {
            this.prepareNotStandaloneGui();
        }
    }
    
    protected prepareELCols(): TableCols[] {
        let eliminatoryCols = [
            { field: 'name',        header: 'Livello' },
            { field: 'level',       header: 'Squadre' },
         ];
         return eliminatoryCols;
     }

    /**
        For each eliminatory level configureted in selected tourney, loads their corresponding meetings,
        for both the one way and round trip meetings
     */
    loadEliminatoryMeetings() {
        this.meetingMap = new Map<number, MeetingDb[]>();
        this.eliminatoryRoundMap = new Map<number, Round>();

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        this.eliminatoryCols = this.prepareELCols();
        if(this.eliminatoryLevels==undefined || this.eliminatoryLevels.length == 0) {    
            this.processEliminationTree()
            return;
        }

        this.elHttpCounter = 0;
        for (let l=0; l<this.eliminatoryLevels.length; l++) {
            let el: EliminatoryLevel = this.eliminatoryLevels[l];
            this.elHttpCounter += el.eliminatories.length;
        }
        
        this.eliminatoryLevelRows = [];
        for (let rowNumber=0; rowNumber<this.eliminatoryLevels.length; rowNumber++) {

            let topElimLevel: EliminatoryLevel = this.eliminatoryLevels[rowNumber];

            let level = topElimLevel.level == -1 ? 2 : this.pow2(topElimLevel.level);
            
            this.eliminatoryLevelRows.push({e: topElimLevel, rowNumber: rowNumber+1 , level: level, name: topElimLevel.name});

            for (let e of topElimLevel.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                let abs = this.meetingService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(mdbs), e => this.onError(e));
            }
        }
    }
    
    private addToMeetingMap(mdbs: MeetingDb[]): void {
        console.log("Entering addToMeetingMap(mdbs.length=" + mdbs.length + ")");
        if(mdbs.length == 0 ) {
            return;
        }
        let elid = mdbs[0].eliminatoryId;
        this.meetingMap.set(elid, mdbs);

        this.elHttpCounter--;

        if(this.elHttpCounter == 0) {
            for(let key of this.eliminatoryRoundMap.keys()) {
                let eid: number = +key;
                let meetingsDb: MeetingDb[] = this.meetingMap.get(eid);
                console.log("meetingMap.get(" + key + ")=" );
                console.log(meetingsDb);
                let onewayMeetings: Array<Meeting> = new Array<Meeting>();
                let roundtripMeetings: Array<Meeting> = new Array<Meeting>();
                for(let mdb of meetingsDb) {
                    let m: Meeting = JSON.parse(mdb.json);
                    m.id = mdb.id;
                    if( m.direction == Direction.OneWay ) {
                        onewayMeetings.push(m);
                    } else {
                        roundtripMeetings.push(m);
                    }
                }

                let round = this.eliminatoryRoundMap.get(eid);
                round.onewayMeetings = this.sortMeetings(onewayMeetings)
                round.roundtripMeetings = this.sortMeetings(roundtripMeetings)
            }

            this.processEliminationTree();
        }
    }    

    protected processEliminationTree(): void {
    }

    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedEliminatoryLevel.isOneway=true;
        this.onClickManageMeeting(true);
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedEliminatoryLevel.isOneway=false;
        this.onClickManageMeeting(false);
    }

    private onClickManageMeeting(isOneway: boolean) {

        this.processEliminationTree();

        this.prepareGui();
    }

    protected newDummyTeam() : Team {
        let dummy: Team = {id: this.tourneyService.getSequenceNumber(), teamName: "", isDummy: true};
        return dummy;
    }

    protected prepareResultColums(): any[] {
        return this.prepareColums(true);
    }

    prepareResultRoundPlayoffColums(): any[] {
        return this.prepareColums(false);
    }

    private prepareColums(isElimininatory: boolean): any[] {
        let cols: TableCols[] = [];
        if(isElimininatory) {
            cols.push({ field: 'rowNumber', header: 'A/R' });
        } else {
            cols.push({ field: 'rowNumber', header: 'N°' });
            cols.push({ field: 'roundtrip', header: 'A/R' });
        }

        cols.push({ field: 'dateAndTime', header: 'Data' });
        cols.push({ field: 'teamName1', header: 'Team 1' });
        cols.push({ field: 'teamName2', header: 'Team 2' });
        if (this.selectedTourney.maxMatchesPerMeeting == 1) {
            cols.push({ field: 'goals1', header: 'Goal 1' });
            cols.push({ field: 'goals2', header: 'Goal 2' });
        }
        else {
            cols.push({ field: 'points1', header: 'Punti 1' });
            cols.push({ field: 'points2', header: 'Punti 2' });
        }

        return cols;
    }

     /**
        <th>N°</th>
        <th *ngIf="isTopLevel">Team 1</th>
        <th *ngIf="isTopLevel">Team 2</th>
        <th>Andata</th>
        <th *ngIf="!selectedEliminatoryLevel.isOneway">Ritorno</th>

        <td>{{rowIndex + 1}}</td>
        <td *ngIf="isTopLevel">{{rowData.round.meetings[0].team1.teamName}}</td>
        <td *ngIf="isTopLevel"> - </td>
        <td *ngIf="isTopLevel">{{rowData.round.meetings[0].team2.teamName}}</td>
        <td>{{rowData.round.meetings[0].datetime | date : "dd/MM/y HH:mm" }}</td>
        <td *ngIf="!selectedEliminatoryLevel.isOneway">{{rowData.round.meetings[1].datetime | date : "dd/MM/y HH:mm"}}</td>
     */
    prepareStandaloneGui(): void {
        this.eliminatoryCols = [
        ];

        if(this.isTopLevel) {
            this.eliminatoryCols.push({ field: 'teamName1', header: 'Team 1'});
            this.eliminatoryCols.push({ field: 'teamName2', header: 'Team 2'});
        }

        this.eliminatoryCols.push({ field: 'onewayDatetime', header: 'Andata' });
        if(!this.selectedEliminatoryLevel.isOneway) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }
        this.eliminatoryLevelRows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime    = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let roundtripDatetime = this.dateFormatPipe.transform(e.round.roundtripMeetings[0].datetime);

            this.eliminatoryLevelRows.push({e:e
                , rowNumber: i+1 
                , teamName1: e.round.onewayMeetings[0].team1.teamName
                , teamName2: e.round.onewayMeetings[0].team2.teamName
                , onewayDatetime: onewayDatetime
                , roundtripDatetime: roundtripDatetime
            });
        }
    }

    /**
        <th>N°</th>
        <th>Andata</th>
        <th *ngIf="isTopLevel">Classif.</th>
        <th *ngIf="isTopLevel">Girone</th>
        <th *ngIf="isPlayoff && isTopLevel">Playoff</th>
        <th *ngIf="isTopLevel">Classif.</th>
        <th *ngIf="isTopLevel">Girone</th>
        <th *ngIf="isPlayoff && isTopLevel">Playoff</th>
        <th *ngIf="!selectedEliminatoryLevel.isOneway">Ritorno</th>     
        
        <td>{{rowIndex + 1}}</td>
        <td>{{rowData.round.meetings[0].datetime | date: 'dd/MM/y HH:mm'}}</td>
        <td *ngIf="isTopLevel">{{rowData.rule1.fromRound.position.value > 0 ? rowData.rule1.fromRound.position.label : rowData.rule1.fromPlayoff.position.label}}</td>
        <td *ngIf="isTopLevel">{{rowData.rule1.fromRound.round.label}}</td>
        <td *ngIf="isPlayoff && isTopLevel">{{rowData.rule1.fromPlayoff.round.label}}</td>
        <td *ngIf="isTopLevel"> - </td>
        <td *ngIf="isTopLevel">{{rowData.rule2.fromRound.position.value > 0 ? rowData.rule2.fromRound.position.label : rowData.rule2.fromPlayoff.position.label}}</td>
        <td *ngIf="isTopLevel">{{rowData.rule2.fromRound.round.label}}</td>
        <td *ngIf="isPlayoff && isTopLevel">{{rowData.rule2.fromPlayoff.round.label}}</td>
        <td *ngIf="!selectedEliminatoryLevel.isOneway">{{rowData.round.meetings[1].datetime | date : "dd/MM/y HH:mm"}}</td>
    */
   protected prepareNotStandaloneGui(): void {
        this.eliminatoryCols = [
            { field: 'onewayDatetime', header: 'Andata'}
        ];

        if(this.isTopLevel) {
            this.eliminatoryCols.push({ field: 'position1', header: 'Classif.'});
            this.eliminatoryCols.push({ field: 'fromRound1', header: 'Girone' });
            if(this.isPlayoff) {
                this.eliminatoryCols.push({ field: 'fromPlayoff1', header: 'Playoff'});
            }

            this.eliminatoryCols.push({ field: 'versus', header: 'Vs'});

            this.eliminatoryCols.push({ field: 'position2', header: 'Classif.'});
            this.eliminatoryCols.push({ field: 'fromRound2', header: 'Girone' });
            if(this.isPlayoff) {
                this.eliminatoryCols.push({ field: 'fromPlayoff2', header: 'Playoff'});
            }
        }

        if(!this.selectedEliminatoryLevel.isOneway) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }

        this.eliminatoryLevelRows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime  = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let position1       = this.getPosition1(e);
            let fromRound1      = e.rule1.fromRound.round.label
            let fromPlayoff1    = e.rule1.fromPlayoff.round.label

            let position2       = this.getPosition2(e);
            let fromRound2      = e.rule2.fromRound.round.label
            let fromPlayoff2    = e.rule2.fromPlayoff.round.label

            let roundtripDatetime = this.dateFormatPipe.transform(e.round.roundtripMeetings[0].datetime);

            let fullList = {e:e
                , onewayDatetime: onewayDatetime
                , position1: position1
                , fromRound1: fromRound1
                , fromPlayoff1: fromPlayoff1
                , versus: "<==>"
                , position2: position2
                , fromRound2: fromRound2
                , fromPlayoff2: fromPlayoff2
                , roundtripDatetime: roundtripDatetime
            };
            this.eliminatoryLevelRows.push(fullList);
        }
    }

    getPosition1(e: Eliminatory): string {
        return "";
    }
    
    getPosition2(e: Eliminatory): string{
        return "";
    }

     /**
     * Prepare the meeting list GUI found in the received list of rounds
     * 
     * @param rounds the list of round containg the meetings
     */
    protected prepareCalendarGui(rounds: Round[] ): any[] {
        this.eliminatoryCols = [
            { field: 'rowNumber', header: 'N°'},
            { field: 'teamName1', header: 'Team 1'},
            { field: 'teamName2', header: 'Team 2'},
            { field: 'dateAndTime',   header: 'Data Ora'},
            { field: 'address',   header: 'Indirizzo'},
        ];

        let row : number = 0;
        let rows: any[] = [];

        let raoundMap: Map<string, Round> = new Map<string, Round>();

        for (let round of rounds) {
            let r = 0;
            for (let m of round.onewayMeetings) {

                rows.push(m);

                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName1 = m.team1.teamName;    
                rows[row].teamName2 = m.team2.teamName;    

                rows[row].dateAndTime = this.dateFormatPipe.transform(m.datetime);    

                let currentKey = round.name;  
                if(!raoundMap.has(currentKey)) {
                    raoundMap.set(currentKey, round);
                    let len = this.eliminatoryCols.length;
                    rows[row].rowspanSize = len;
                } else {
                    rows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }

        return rows;
    }

    protected sortMeetings(rows: any[]): any[] {
        return rows.sort((m1, m2) => {
            if (m1.dateAndTime > m2.dateAndTime) {
                return -1;
            }
            if (m1.dateAndTime < m2.dateAndTime) {
                return 1;
            }
            return 0;
        });
    }
}

