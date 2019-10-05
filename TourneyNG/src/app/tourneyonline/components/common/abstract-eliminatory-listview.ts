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
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { EliminatoryVO } from 'app/tourneyonline/domain/eliminatory.vo';

export abstract class AbstractEliminatoryListView extends AbstractListView {
         
    eliminatoryLevelCols: TableCols[] ;
    eliminatoryLevelSelectedRow: EliminatoryLevelVO;
    
    eliminatoryCols: TableCols[] ;
    eliminatoryLevelRows: EliminatoryLevelVO[];
 
    eliminatoryRows: EliminatoryVO[];
    eliminatorySelectedRow: EliminatoryVO;

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;

    isTopLevel: boolean;
    isAutomatic: boolean;

    isOneway: string;
    private isStandalone: boolean;

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
    mdbs: MeetingDb[];
    
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
            this.isOneway = this.selectedEliminatoryLevel.direction == Direction.OneWay ? "true" : "false" ;
            this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
        }

        this.isPlayoff = this.containsPlayoff();
        
        this.eliminatoryTeamsCombobox = this.tourneyService.eliminatoryTeamsCombobox;
  
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
 
        if (this.isStandAlone(this.selectedTourney)) {
            this.isStandalone = true;
        } else {
            this.isStandalone = false;
        }
        this.tourneyService.isStandalone = this.isStandalone;
    }

    public isStandAlone(tourney : Tourney ): boolean {
        return tourney.phases.length == 1 && this.containsPhase(PhaseType.E, tourney.phases);
    }

    public prepareGui(): void {
        if (this.isStandalone) {
            this.prepareStandaloneGui();
        } else {
            this.prepareNotStandaloneGui();
        }
    }
    
    protected prepareELCols(): TableCols[] {
        let cols = [
            { field: 'name',        header: 'Livello' },
            { field: 'level',       header: 'Squadre' },
         ];
         return cols;
     }

    /**
        For each eliminatory level configureted in selected tourney, loads their corresponding meetings,
        for both the one way and round trip meetings
     */
    loadEliminatoryMeetings( complete: () => void ): void {
        this.meetingMap = new Map<number, MeetingDb[]>();
        this.eliminatoryRoundMap = new Map<number, Round>();

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        this.eliminatoryLevelCols = this.prepareELCols();
        if(this.eliminatoryLevels==undefined || this.eliminatoryLevels.length == 0) {    
            this.processEliminationTree();
            complete();
            return;
        }

        this.elHttpCounter = 0;
        for (let l=0; l<this.eliminatoryLevels.length; l++) {
            let el: EliminatoryLevel = this.eliminatoryLevels[l];
            this.elHttpCounter += el.eliminatories.length;
        }
        
        this.eliminatoryLevelRows = [];
        for (let rowNumber=0; rowNumber<this.eliminatoryLevels.length; rowNumber++) {

            let el: EliminatoryLevel = this.eliminatoryLevels[rowNumber];

            let level = el.level == -1 ? 2 : this.pow2(el.level);
            
            const elvo = { eliminatoryLevel: el, rowNumber: rowNumber + 1, level: level, name: el.name };
            this.eliminatoryLevelRows.push(elvo);

            for (let e of el.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                let abs = this.meetingService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(complete, mdbs), e => this.onError(e));
            }
        }
    }
    
    private addToMeetingMap(complete: () => void,  mdbs: MeetingDb[]): void {
        console.log("Entering addToMeetingMap(mdbs.length=" + mdbs.length + ")");
        if( mdbs.length == 0 ) {
            return;
        }

        this.elHttpCounter--;
        let elid = mdbs[0].eliminatoryId;
        this.meetingMap.set(elid, mdbs);
    
        if(this.elHttpCounter > 0) {
            return;
        }

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
            round.onewayMeetings = this.sortMeetings(onewayMeetings);
            round.roundtripMeetings = this.sortMeetings(roundtripMeetings);
        }

        this.processEliminationTree();
        
        complete();
    }    

    protected processEliminationTree(): void {
    }
    
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedEliminatoryLevel.direction=Direction.OneWay;
        this.isOneway = "true";
        this.prepareGui();
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedEliminatoryLevel.direction=Direction.RoundTrip;
        this.isOneway = "false";
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
      * Prepares the columns and the rows for the eliminatories belonging to the selected eliminatory level 
      * in the Stand Alone use case
     */
    prepareStandaloneGui(): void {
        this.eliminatoryCols = [
        ];

        if(this.isTopLevel) {
            this.eliminatoryCols.push({ field: 'teamName1', header: 'Team 1'});
            this.eliminatoryCols.push({ field: 'teamName2', header: 'Team 2'});
        }

        this.eliminatoryCols.push({ field: 'onewayDatetime', header: 'Andata' });
        if(this.selectedEliminatoryLevel.direction != Direction.OneWay) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }
        
        this.eliminatoryRows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime    = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let roundtripDatetime = this.dateFormatPipe.transform(e.round.roundtripMeetings[0].datetime);

            let evo: EliminatoryVO = {eliminatory:e
                , rowNumber: i+1
                , teamName1: e.round.onewayMeetings[0].team1.teamName
                , teamName2: e.round.onewayMeetings[0].team2.teamName
                , onewayDatetime: onewayDatetime
                , roundtripDatetime: roundtripDatetime
                , position1: "0"
                , fromRound1: ""
                , fromPlayoff1: ""
                , versus: ""
                , position2: "0"
                , fromRound2: ""
                , fromPlayoff2: ""
            };            
            this.eliminatoryRows.push(evo);
        }
    }

    /**
     * Prepares the columns and the rows for the eliminatories belonging to the selected eliminatory level
     * Insert manually the rules to pass the from rounds and/or playoffs to direct eliminatories
    */
   protected prepareNotStandaloneGui(): void {
        this.eliminatoryCols = [
            { field: 'onewayDatetime', header: 'Andata'}
        ];

        if(this.isTopLevel) {
            if( this.isAutomatic) {
                this.eliminatoryCols.push({ field: 'position1', header: 'I° Squadra'});
                this.eliminatoryCols.push({ field: 'position2', header: 'II° Squadra'});
            } else {
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
        }

        if(this.selectedEliminatoryLevel.direction != Direction.OneWay) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }

        this.eliminatoryRows = [];
        for(let i=0; i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime  = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let position1       = this.getPosition1(e);
            let fromRound1      = this.isAutomatic ? "" : e.rule1.fromRound.round.label
            let fromPlayoff1    = e.rule1.fromPlayoff.round.label

            let position2       = this.getPosition2(e);
            let fromRound2      = this.isAutomatic ? "" : e.rule2.fromRound.round.label
            let fromPlayoff2    = e.rule2.fromPlayoff.round.label

            let roundtripDatetime = this.dateFormatPipe.transform(e.round.roundtripMeetings[0].datetime);

            let evo: EliminatoryVO = {eliminatory:e
                , rowNumber: i+1
                , teamName1: ""
                , teamName2: ""
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
            this.eliminatoryRows.push(evo);
        }
    }

    getPosition1(e: Eliminatory): string {

        let pos1 = this.isAutomatic 
            ? e.rule1.fromRound.relativePosition + "° delle " + e.rule1.fromRound.position.value + "°" 
            : e.rule1.fromRound.position.value + "°";

        return pos1;
    }
    
    getPosition2(e: Eliminatory): string {

        let rule = e.rule2.fromRound.relativePosition + "° delle " + e.rule2.fromRound.position.value + "°" ;
        if( e.rule2.fromRound.position.value == 0 ) {
            rule = "";
        }

        let pos2 = this.isAutomatic 
            ? rule 
            : e.rule2.fromRound.position.value + "°";

        return pos2;
    }

     /**
     * Prepare the meeting list GUI found in the received list of rounds
     * 
     * @param rounds the list of round containg the meetings
     */
    protected prepareCalendarGui(rounds: Round[] ): any[] {
        this.eliminatoryLevelCols = [
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
                    let len = this.eliminatoryLevelCols.length;
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
