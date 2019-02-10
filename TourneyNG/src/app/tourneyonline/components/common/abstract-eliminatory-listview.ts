import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import {  Direction, PhaseType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Team } from 'app/tourneyonline/domain/team';
import { DateFormatPipe } from './date-format-pipe';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

export abstract class AbstractEliminatoryListView extends AbstractListView {
         
    cols: TableCols[] ;
    rows: any[];
    selectedRow: any;

    eliminatoryRows: any[] = [];

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;

    isTopLevel: boolean;

    isOneway: string;
    isStandalone: boolean;
    
    isModeEnabled: boolean;

    selectedLevelCombobox: Combobox;
    selectedTeamsNumCombobox: Combobox;
    teamsCombobox: Combobox[];
    incompleteConfiguration: boolean;
    eliminatoryCols: { field: string; header: string; }[];
    eliminatoryLevelRows: any[];
    
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
        protected router: Router,
        protected location: Location,
        protected dateFormatPipe: DateFormatPipe
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();
 
        if(this.tourneyService.selectedEliminatoryLevel!=undefined) {
            this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
            this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
            this.isOneway = this.selectedEliminatoryLevel.isOneway ? "true" : "false" ;
            this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
        }

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        
        this.teamsCombobox = this.tourneyService.teamsCombobox;
        this.selectedTeamsNumCombobox = this.selectedTourney.selectedTeamsNumCombobox;
  
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            this.containsPhase(PhaseType.P, this.selectedTourney.phases) &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = false;
        } else {
             this.isModeEnabled = true;
        }

        if (this.selectedTourney.phases.length == 1 &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
        } else {
            this.isStandalone = false;
        }
        this.tourneyService.isStandalone = this.isStandalone;
    }

    protected prepareGui() {
        if (this.isStandalone) {
            this.prepareStandaloneGui();
        } else {
            this.prepareNotStandaloneGui();
        }
    }

    protected loadRounds(isOneway: boolean) {
        let rounds = this.selectedTourney.rounds;

        this.roundMap = new Map<number, Round>();
        this.roundHttpCounter = 0;
        this.roundMeetingMap = new Map<number, Meeting[]>();

        for (let r of rounds) {
            r.onewayMeetings = [];
            this.roundHttpCounter++;
            this.roundMap.set(r.id, r);
            const subscr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, r.id);
            subscr.subscribe(ms => this.onLoadRoundMeetings(ms, isOneway), e => this.onError(e));
        }
    }

    private onLoadRoundMeetings(roundMeetings: MeetingDb[], isOneway: boolean): void {
        let rid = roundMeetings[0].roundId;
        this.roundMeetingMap.set(rid, roundMeetings);

        this.roundHttpCounter--;

        if(this.roundHttpCounter == 0) {
            for(let key of this.roundMeetingMap.keys()) {
                let mdbs = this.roundMeetingMap.get(key);
                for(let mdb of mdbs) {
                    let r: Round = this.roundMap.get(mdb.roundId);           

                    let m = JSON.parse(mdb.json);
                    r.onewayMeetings.push(m);

                    r.onewayMeetings  = this.sortMeetings(r.onewayMeetings)
                }
                
                for(let round of this.selectedTourney.rounds) {
                    round.classification = this.createClassification(round);
                }
                
                this.roundRows = this.prepareRoundsGui(this.selectedTourney.rounds, isOneway);
            }
        }
    }
    
    protected prepareEliminatoryRound(rounds: Round[], isOneway: boolean): any[] {

        for(let round of rounds) {
            round.classification = this.createClassification(round);
        }

        return this.prepareRoundsGui(rounds, isOneway);
    }

    private findByName(rn: string, rounds: Round[]): Round {
        for(let r of rounds) {
            if(r.name == rn) {
                return r;
            }
        }    
        return null;
    }
    
    private createClassification(round: Round): Classification[] {
        let classificationMap : Map<string, Classification> = new Map<string, Classification>();

        for(let m of round.onewayMeetings) {

            let t1 = m.team1;
            let t2 = m.team2;
            let key1 = t1.teamName;
            let key2 = t2.teamName;

            if(!classificationMap.has(key1)) {
                let c = this.newClassification(t1, 0);
                classificationMap.set(key1, c);
            }
            let c1 = classificationMap.get(key1);            
 
            if(!classificationMap.has(key2)) {
                let c2 = this.newClassification(t2, 0);
                classificationMap.set(key2, c2);
            }
            
            if(m.status == MeetingStatus.ToPlay) {
                continue;
            }
            
            let c2 = classificationMap.get(key2);

            c1.played++;
            c2.played++;

            c1.points += m.points1;
            c2.points += m.points2;

            if (m.points1 > m.points2) {
                c1.won++;
                c2.lost++;
            }
            if (m.points2 > m.points1) {
                c2.won++;
                c1.lost++;
            }
            if (m.points1 == m.points2) {
                c1.balanced++;
                c2.balanced++;
            }
            for (let ma of m.matches) {
                c1.goalsDone += ma.score1;
                c1.goalsConceded += ma.score2;

                c2.goalsDone += ma.score2;
                c2.goalsConceded += ma.score1;
            }
            c1.goalsDiff = c1.goalsDone - c1.goalsConceded;        
            c2.goalsDiff = c2.goalsDone - c2.goalsConceded;        
        }

        let classificationList: Classification[] = [];
        for( let c of classificationMap.values()) {
            if(c.team.teamName == "") {
                continue;
            }
            classificationList.push(c);            
        }

        classificationList = this.sortDesc(classificationList);

        round.classification = classificationList;

        return classificationList;
    }

    private sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        let sortedClassification: Array<Classification>  = unsortedClassification.sort((c1, c2) => {

            if (c1.points > c2.points) {
                return -1;
            }
            if (c1.points < c2.points) {
                return 1;
            }
        
            if( c1.goalsDiff > c2.goalsDiff ) {
                return -1;
            }
            if( c1.goalsDiff < c2.goalsDiff ) {
                return 1;
            }

            if( c1.goalsDone > c2.goalsDone ) {
                return -1;
            }
            if( c1.goalsDone < c2.goalsDone ) {
                return 1;
            }

            if( c1.goalsConceded < c2.goalsConceded ) {
                return -1;
            }
            if( c1.goalsConceded > c2.goalsConceded ) {
                return 1;
            }

            return 0;
        });

        return sortedClassification;
    } 

    protected loadPlayoffs(isOneway: boolean): any {
        
        let playoffs = this.selectedTourney.playoffs;

        this.playoffHttpCounter = 0;

        this.playoffRoundMap = new Map<number, Playoff>();
        this.playoffMeetingMap = new Map<number, Meeting[]>();
        for(let po of playoffs) {
            if(po.playoffRules == null || po.playoffRules.length==0) {
                continue;
            }
            this.playoffHttpCounter++;
            let r = po.round;
            r.onewayMeetings = [];
            this.playoffRoundMap.set(po.id, po);
            const subscr = this.tourneyService.loadPlayoffMeeting(this.selectedTourney.id, po.id);
            subscr.subscribe(ms => this.onLoadPlayoffMeeting(ms, isOneway), e => this.onError(e));       
        }
    } 

    /**
     * Call back method to process the Playoff meetings selected from the database
     */
    private onLoadPlayoffMeeting(playoffMeetings: MeetingDb[], isOneway: boolean): void {
        if(playoffMeetings.length==0) {
            return;
        }
        let poid = playoffMeetings[0].playoffId;
        this.playoffMeetingMap.set(poid, playoffMeetings);

        this.playoffHttpCounter--;

        if(this.playoffHttpCounter == 0) {
            for(let key of this.playoffMeetingMap.keys()) {
                let mdbs = this.playoffMeetingMap.get(key);
                for(let mdb of mdbs) {
                    let po = this.playoffRoundMap.get(mdb.playoffId);
                    
                    let r = po.round;
                    
                    let m: Meeting = JSON.parse(mdb.json);
                    r.onewayMeetings.push(m);

                    r.onewayMeetings  = this.sortMeetings(r.onewayMeetings)

                    this.resolvePlayoffRules(po, this.selectedTourney.rounds);
                }
            }
            
            this.playoffRows = this.preparePlayoffClassification(this.selectedTourney.playoffs, isOneway);
        }
    }

    /**
     * Updates the teams of the received playoff in function of their configured rules
     * and their position in the classification from the received rounds
     * 
     * @param po the playoff to complete
     * @param rounds the rounds containing the classifications
     */
    private resolvePlayoffRules(po: Playoff, rounds: Round[]) {
        po.round.teams = [];
        for (let pr of po.playoffRules) {
            let pi: number = pr.fromRound.position.value;
            let rn = pr.fromRound.round.label;
            let round = this.findByName(rn, rounds);
            if (pi <= round.classification.length) {
                let c = round.classification[pi - 1];
                let team = c.team;
                po.round.teams.push(team);
                this.resolvePlayoffRule(po.round.onewayMeetings, pr, team);
            }
        }
    }
    
    private resolvePlayoffRule(meetings: Meeting[], pr: PlayoffRule, team: Team): any {
        for(let m of meetings) {
            if( m.rule1.id == pr.id) {
                m.team1 = team;
            }
            if( m.rule2.id == pr.id) {
                m.team2 = team;
            }
        }
    }

    /**
        <th>Team</th>
        <th>Pt.</th>
        <th>G</th>
        <th>V</th>
        <th>P</th>
        <th>N</th>
        <th>Gf:Gs</th>
        <th>D</th>
        <td>{{rowIndex + 1}}</td>
        <td>{{rowData.team.teamName}}</td>
        <td>{{rowData.points}}</td>
        <td>{{rowData.played}}</td>
        <td>{{rowData.won}}</td>
        <td>{{rowData.lost}}</td>
        <td>{{rowData.balanced}}</td>
        <td>{{rowData.goalsDone}}:{{rowData.goalsConceded}}</td>
        <td>{{rowData.goalsDiff}}</td>       
     */
    protected prepareRoundsGui(rounds: Round[], isOneway: boolean): any[] {
        this.cols = [
            { field: 'teamName',    header: 'Team'},
            { field: 'points',      header: 'Pt.'},
            { field: 'played',      header: 'G'},
            { field: 'won',         header: 'V'},
            { field: 'lost',        header: 'P'},
            { field: 'balanced',    header: 'N'},
            { field: 'goalsDone',   header: 'Gf:Gs'},
            { field: 'goalsDiff',   header: 'D'},
        ];

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            let r = 0;
            for (let c of round.classification) {

                rows.push(c);

                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName = c.team.teamName;    
                rows[row].points = c.points;    
                rows[row].played = c.played;    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDone = c.goalsDone;    
                rows[row].goalsConceded = c.goalsConceded;    
                rows[row].goalsDiff = c.goalsDone - c.goalsConceded;    

                let len = round.onewayMeetings.length;

                let currentKey = round.name;  
                if(!classificationMap.has(currentKey)) {
                    classificationMap.set(currentKey, c);
                    rows[row].rowspanSize = len;
                } else {
                    rows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }

        return rows;
    }

    private preparePlayoffClassification(playoffs: Playoff[], isOneway: boolean): any[] {

        let playoffRounds: Round[] = this.makePlayoffRounds(playoffs);

        for(let round of playoffRounds) {
            round.classification = this.createClassification(round);
        }

        let rows: any[] = this.preparePlayoffGui(playoffs, isOneway);

        return rows;
    }

    protected makePlayoffRounds(playoffs: Playoff[]) {
        let playoffRounds: Round[] = [];
        for (let p of playoffs) {
            playoffRounds.push(p.round);
        }
        return playoffRounds;
    }

    protected preparePlayoffGui(playoffs: Playoff[], isOneway: boolean): any[] {
        let rounds: Array<Round> = new Array<Round>();

        for(let p of playoffs) {
            rounds.push(p.round);
        }
        return this.prepareRoundsGui(rounds, isOneway);
    }

    /**
        <th>Squadre</th>
        <th>Nome</th>
        <td>{{rowIndex + 1}}</td>
        <td>{{rowData.level == -1 ? 2 : pow2(rowData.level)}}</td>
        <td>{{rowData.name}}</td>
     */
    protected loadEliminatoryLevels() {
        this.meetingMap = new Map<number, MeetingDb[]>();
        this.eliminatoryRoundMap = new Map<number, Round>();

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        this.incompleteConfiguration = true;
        if(this.eliminatoryLevels==undefined || this.eliminatoryLevels.length == 0) {
            return;
        }
        this.incompleteConfiguration = this.eliminatoryLevels.length > 0 ? false : true;

        this.elHttpCounter = 0;
        this.eliminatoryLevelRows = [];
        
        this.eliminatoryCols = this.prepareELCols();

        for (let rowNumber=0; rowNumber<this.eliminatoryLevels.length; rowNumber++) {

            let topElimLevel = this.eliminatoryLevels[rowNumber];

            let level = topElimLevel.level == -1 ? 2 : this.pow2(topElimLevel.level);
            
            this.eliminatoryLevelRows.push({e: topElimLevel, rowNumber: rowNumber+1 , level: level, name: topElimLevel.name});

            for (let e of topElimLevel.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                this.elHttpCounter++;
                let abs = this.tourneyService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(mdbs), e => this.onError(e));
            }
        }
    }
    
    protected prepareELCols(): TableCols[] {
       let eliminatoryCols = [
           { field: 'name',        header: 'Livello' },
           { field: 'level',       header: 'Squadre' },
        ];
        return eliminatoryCols;
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
                let round = this.eliminatoryRoundMap.get(eid);
                let meetingsDb: MeetingDb[] = this.meetingMap.get(eid);
                let meetings: Array<Meeting> = new Array<Meeting>();
                for(let mdb of meetingsDb) {
                    let m: Meeting = JSON.parse(mdb.json);
                    meetings.push(m);
                }
                round.onewayMeetings = meetings;
                round.onewayMeetings = this.sortMeetings(round.onewayMeetings)
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
        let dummy: Team = {id: this.tourneyService.getSequenceNumber(), teamName: ""};
        return dummy;
    }

    protected prepareResultColums(): any[] {
        return this.prepareColums(true);
    }

    protected prepareResultRoundPlayoffColums(): any[] {
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
        this.cols = [
        ];

        if(this.isTopLevel) {
            this.cols.push({ field: 'teamName1', header: 'Team 1'});
            this.cols.push({ field: 'teamName2', header: 'Team 2'});
        }

        this.cols.push({ field: 'onewayDatetime', header: 'Andata' });
        if(!this.selectedEliminatoryLevel.isOneway) {
            this.cols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }
        this.rows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime    = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let roundtripDatetime = this.dateFormatPipe.transform(e.round.onewayMeetings[1].datetime);

            this.rows.push({e:e
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
        this.cols = [
            { field: 'onewayDatetime', header: 'Andata'}
        ];

        if(this.isTopLevel) {
            this.cols.push({ field: 'position1', header: 'Classif.'});
            this.cols.push({ field: 'fromRound1', header: 'Girone' });
            if(this.isPlayoff) {
                this.cols.push({ field: 'fromPlayoff1', header: 'Playoff'});
            }

            this.cols.push({ field: 'versus', header: 'Vs'});

            this.cols.push({ field: 'position2', header: 'Classif.'});
            this.cols.push({ field: 'fromRound2', header: 'Girone' });
            if(this.isPlayoff) {
                this.cols.push({ field: 'fromPlayoff2', header: 'Playoff'});
            }
        }

        if(!this.selectedEliminatoryLevel.isOneway) {
            this.cols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }

        this.rows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime  = this.dateFormatPipe.transform(e.round.onewayMeetings[0].datetime);
            let position1       = this.getPosition1(e);
            let fromRound1      = e.rule1.fromRound.round.label
            let fromPlayoff1    = e.rule1.fromPlayoff.round.label

            let position2       = this.getPosition2(e);
            let fromRound2      = e.rule2.fromRound.round.label
            let fromPlayoff2    = e.rule2.fromPlayoff.round.label

            let roundtripDatetime = this.dateFormatPipe.transform(e.round.onewayMeetings[1].datetime);

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
            this.rows.push(fullList);
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
    protected prepareCalendarGui(rounds: Round[], isOneway: boolean): any[] {
        this.cols = [
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
                if(isOneway && m.direction == Direction.RoundTrip) {
                    continue;
                }

                rows.push(m);

                rows[row].rowNumber = ++r;    
                rows[row].roundName = round.name;    
                rows[row].teamName1 = m.team1.teamName;    
                rows[row].teamName2 = m.team2.teamName;    

                rows[row].dateAndTime = this.dateFormatPipe.transform(m.datetime);    

                let currentKey = round.name;  
                if(!raoundMap.has(currentKey)) {
                    raoundMap.set(currentKey, round);
                    let len = this.cols.length;
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

