import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Message } from 'primeng/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import {  PhaseType, Direction } from 'app/tourneyonline/domain/enumerations';
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
    eliminatoryLevelBSelectedRow: EliminatoryLevelVO;
    
    eliminatoryCols: TableCols[] ;
    eliminatoryLevelRows: EliminatoryLevelVO[];
    eliminatoryBLevelRows: EliminatoryLevelVO[];
 
    eliminatoryRows: EliminatoryVO[];
    eliminatorySelectedRow: EliminatoryVO;

    msgs: Message[] = [];
   
    eliminatoryLevels: Array<EliminatoryLevel>;
    eliminatoryBLevels: Array<EliminatoryLevel>;
    
    eliminatories: Eliminatory[];

    isPlayoff: boolean;

    isAutomatic: boolean;

    isOneway: string;
    private isStandalone: boolean;

    selectedLevelCombobox: Combobox;
  
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

        this.isAutomatic   = this.tourneyService.selectedTourney.isEliminatoryAutoGen=="true" ? true : false;

        this.isPlayoff = this.containsPlayoff();
          
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        if (this.isStandAlone(this.selectedTourney)) {
            this.isStandalone = true;
        } else {
            this.isStandalone = false;
        }
    }

    public isStandAlone(tourney : Tourney ): boolean {
        return tourney.phases.length == 1 && this.containsPhase(PhaseType.E, tourney.phases);
    }

    public prepareGui(): void {
        this.ngOnInit();

        this.prepareEliminatoryGui();
    }
    
    protected prepareEliminatoryGui() {
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        this.isOneway =  this.tourneyService.selectedEliminatoryLevel.abstractRoundVO.direction == Direction.OneWay ? "true" : "false"
        if (this.isStandalone) {
            this.prepareStandaloneGui();
        }
        else {
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
 
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.tourneyService.selectedEliminatoryLevel.abstractRoundVO.direction=Direction.OneWay;
        this.isOneway = "true";
        this.prepareGui();
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.tourneyService.selectedEliminatoryLevel.abstractRoundVO.direction=Direction.RoundTrip;
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
        if (this.selectedTourney.roundVO.maxMatchesPerMeeting == 1 || this.selectedTourney.playoffVO.maxMatchesPerMeeting == 1) {
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

        let isTopLevel = this.tourneyService.selectedEliminatoryLevel.isTopLevel;
        if(isTopLevel) {
            this.eliminatoryCols.push({ field: 'teamName1', header: 'Team 1'});
            this.eliminatoryCols.push({ field: 'teamName2', header: 'Team 2'});
        }

        this.eliminatoryCols.push({ field: 'onewayDatetime', header: 'Andata' });
        if(this.tourneyService.selectedEliminatoryLevel.abstractRoundVO.direction != Direction.OneWay) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }
        
        this.eliminatoryRows = [];
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;

        for(let i=0; i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime    = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let roundtripDatetime = this.dateFormatPipe.transform(e.round.roundtripMeetings[0].datetime);

            let evo: EliminatoryVO = {eliminatory:e
                , rowNumber: i+1
                , teamName1: e.round.teamNames[0]
                , teamName2: e.round.teamNames[1]
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

        let isTopLevel = this.tourneyService.selectedEliminatoryLevel.isTopLevel;
        if(isTopLevel) {
            if( this.isAutomatic ) {
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

        if(this.tourneyService.selectedEliminatoryLevel.abstractRoundVO.direction != Direction.OneWay) {
            this.eliminatoryCols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }

        this.eliminatoryRows = [];
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
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
        let pos1 = "";
        if(this.containsPlayoff()) {
            let rule = e.rule1.fromPlayoff.bandPosition + "° delle migliori " + e.rule1.fromPlayoff.position.value + "°";
            if( this.selectedTourney.playoffVO.playoffs.length == 1 ) {
                rule = e.rule1.fromPlayoff.position.value + "°";
            }
            pos1 = this.isAutomatic 
                ? rule
                : e.rule1.fromPlayoff.position.value + "°";
        } else {
            let rule = e.rule1.fromRound.bandPosition + "° delle migliori " + e.rule1.fromRound.position.value + "°";
            if( this.selectedTourney.roundVO.rounds.length == 1 ) {
                rule = e.rule1.fromRound.position.value + "°";
            }
            pos1 = this.isAutomatic 
                ? rule
                : e.rule1.fromRound.position.value + "°";
        }   
        return pos1;
    }
    
    getPosition2(e: Eliminatory): string {
        let pos2 = "";
        if(this.containsPlayoff()) {
            let rule = e.rule2.fromPlayoff.bandPosition + "° delle migliori " + e.rule2.fromPlayoff.position.value + "°";
            if( this.selectedTourney.playoffVO.playoffs.length == 1 ) {
                rule = e.rule2.fromPlayoff.position.value + "°";
            }
            let pos = e.rule2.fromPlayoff.position.value + "°";
            if( e.rule2.fromPlayoff.position.value == 0 ) {
                rule = "";
                pos  = "";
            }
            pos2 = this.isAutomatic ? rule : pos;
        } else {
            let rule = e.rule2.fromRound.bandPosition + "° delle migliori " + e.rule2.fromRound.position.value + "°" ;
            if( this.selectedTourney.roundVO.rounds.length == 1 ) {
                rule = e.rule2.fromRound.position.value + "°" ;
            }
            let pos = e.rule2.fromRound.position.value + "°";

            if( e.rule2.fromRound.position.value == 0 ) {
                rule = "";
                pos  = "";
            }
            pos2 = this.isAutomatic ? rule : pos;
        }
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
                rows[row].teamName1 = m.teamName1;    
                rows[row].teamName2 = m.teamName2;    

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
}
