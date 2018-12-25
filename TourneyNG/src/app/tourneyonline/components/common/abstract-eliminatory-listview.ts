import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { EliminatoryMode, Direction, PhaseType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Team } from 'app/tourneyonline/domain/team';
import { DateFormatPipe } from './date-format-pipe';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';

export abstract class AbstractEliminatoryListView extends AbstractListView {
         
    cols: any[];
    rows: any[];
    selectedRow: any;

    eliminatoryRows: any[] = [];

    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;
    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;
    isManual: boolean;

    isTopLevel: boolean;

    isOneway: string;
    isStandalone: boolean;
    
    meetingMap: Map<number, MeetingDb[]>;
    httpCounter: number;
    eliminatoryRoundMap: Map<number, Round>;

    isModeEnabled: boolean;

    selectedLevelCombobox: Combobox;
    selectedTeamsNumCombobox: Combobox;
    teamsCombobox: Combobox[];
    isAutomatic: boolean;
    incompleteConfiguration: boolean;
    eliminatoryCols: { field: string; header: string; }[];
    eliminatoryLevelRows: any[];

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

        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
    
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
        
        this.teamsCombobox = this.tourneyService.teamsCombobox;
        this.selectedTeamsNumCombobox = this.selectedTourney.selectedTeamsNumCombobox;
  
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
        this.isAutomatic = ! this.isManual;
                
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

    protected loadRounds() {
        let rounds = this.selectedTourney.rounds;
        this.roundMap = new Map<number, Round>();
        for (let r of rounds) {
            r.meetings = [];
            this.roundMap.set(r.id, r);
            const subscr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, r.id);
            subscr.subscribe(ms => this.roundMeetings = ms, e => this.onError(e), () => this.onLoadRoundMeetingComplete());
        }
    }

    private onLoadRoundMeetingComplete(): void {
        for(let mdb of this.roundMeetings) {
            let r: Round = this.roundMap.get(mdb.roundId);           
            let m: Meeting = JSON.parse(mdb.json);
            r.meetings.push(m);
        }

        for(let round of this.selectedTourney.rounds) {
            round.classification = this.createClassification(round);
        }

        this.roundRows = this.prepareRoundsGui(this.selectedTourney.rounds);
    }
    protected prepareEliminatoryRound(rounds: Round[]): any[] {

        for(let round of rounds) {
            round.classification = this.createClassification(round);
        }

        return this.prepareRoundsGui(rounds);
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

        for(let m of round.meetings) {

            let t1 = m.team1;

            let key1 = t1.teamName;
            if(!classificationMap.has(key1)) {
                let c = this.newClassification(t1, 0);
                classificationMap.set(key1, c);
            }
            let c1 = classificationMap.get(key1);            
 
            let t2 = m.team2;
            let key2 = t2.teamName;
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
            classificationList.push(c);            
        }

        classificationList = this.sortDesc(classificationList);

        round.classification = classificationList;

        return classificationList;
    }

    private sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        let sortedClassification: Array<Classification>  = unsortedClassification.sort((c1, c2) => {

            if (c1.points > c2.points) {
                return 1;
            }
            if (c1.points < c2.points) {
                return -1;
            }
        
            if( c1.goalsDiff > c2.goalsDiff ) {
                return 1;
            }
            if( c1.goalsDiff < c2.goalsDiff ) {
                return -1;
            }

            if( c1.goalsDone > c2.goalsDone ) {
                return 1;
            }
            if( c1.goalsDone < c2.goalsDone ) {
                return -1;
            }

            if( c1.goalsConceded < c2.goalsConceded ) {
                return 1;
            }
            if( c1.goalsConceded > c2.goalsConceded ) {
                return -1;
            }

            return 0;
        });

        return sortedClassification;
    } 

    protected loadPlayoffs(): any {
        
        let playoffs = this.selectedTourney.playoffs;

        this.playoffRoundMap = new Map<number, Playoff>();
        for(let po of playoffs) {
            if(po.playoffRules == null || po.playoffRules.length==0) {
                continue;
            }
            let r = po.round;
            r.meetings = [];
            this.playoffRoundMap.set(po.id, po);
            const subscr = this.tourneyService.loadPlayoffMeeting(this.selectedTourney.id, po.id);
            subscr.subscribe(ms => this.playoffMeetings = ms, e => this.onError(e), () => this.onLoadPlayoffMeeting() );       
        }
    } 

    /**
     * Call back method to process the Playoff meetings selected from the database
     */
    onLoadPlayoffMeeting(): void {
        if(this.playoffMeetings.length==0) {
            return;
        }

        for(let mdb of this.playoffMeetings) {
            
            let po = this.playoffRoundMap.get(mdb.playoffId);
            
            let r = po.round;
            let m: Meeting = JSON.parse(mdb.json);
            
            r.meetings.push(m);

            this.resolvePlayoffRules(po, this.selectedTourney.rounds);
        }
        
        this.playoffRows = this.preparePlayoffClassification(this.selectedTourney.playoffs);
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
                this.resolvePlayoffRule(po.round.meetings, pr, team);
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
        <th>N°</th>
        <th>Squadra</th>
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
    protected prepareRoundsGui(rounds: Round[]): any[] {
        this.cols = [
            { field: 'rowNumber',   header: 'N°'},
            { field: 'teamName',    header: 'Squadra'},
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

                let len = round.meetings.length;

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
    private preparePlayoffClassification(playoffs: Playoff[]): any[] {

        let playoffRounds: Round[] = this.makePlayoffRounds(playoffs);

        for(let round of playoffRounds) {
            round.classification = this.createClassification(round);
        }

        let rows: any[] = this.preparePlayoffGui(playoffs);

        return rows;
    }

    protected makePlayoffRounds(playoffs: Playoff[]) {
        let playoffRounds: Round[] = [];
        for (let p of playoffs) {
            playoffRounds.push(p.round);
        }
        return playoffRounds;
    }

    protected preparePlayoffGui(playoffs: Playoff[]): any[] {
        let rounds: Array<Round> = new Array<Round>();

        for(let p of playoffs) {
            rounds.push(p.round);
        }
        return this.prepareRoundsGui(rounds);
    }

    /**
        <th>N°</th>
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

        this.httpCounter = 0;
        this.eliminatoryLevelRows = [];
        
        this.eliminatoryCols = this.prepareELCols();

        for (let rowNumber=0; rowNumber<this.eliminatoryLevels.length; rowNumber++) {

            let topElimLevel = this.eliminatoryLevels[rowNumber];

            let level = topElimLevel.level == -1 ? 2 : this.pow2(topElimLevel.level);
            
            this.eliminatoryLevelRows.push({e: topElimLevel, rowNumber: rowNumber+1 , level: level, name: topElimLevel.name});

            for (let e of topElimLevel.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                this.httpCounter++;
                let abs = this.tourneyService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(mdbs), e => this.onError(e));
            }
        }
    }
    
    protected prepareELCols(): any[] {
       let eliminatoryCols = [
           { field: 'name',        header: 'Livello' },
           { field: 'level',       header: 'Squadre' },
        ];
        return eliminatoryCols;
    }
    
    private addToMeetingMap(mdbs: MeetingDb[]): void {
        let elid = mdbs[0].eliminatoryId;
        this.meetingMap.set(elid, mdbs);

        this.httpCounter--;

        if(this.httpCounter == 0) {

            for(let key of this.eliminatoryRoundMap.keys()) {
                let eid: number = +key;
                let round = this.eliminatoryRoundMap.get(eid);
                let meetingsDb: MeetingDb[] = this.meetingMap.get(eid);
                let meetings: Array<Meeting> = new Array<Meeting>();
                for(let mdb of meetingsDb) {
                    let m = JSON.parse(mdb.json);
                    meetings.push(m);
                }
                round.meetings = meetings;
            }

            this.processEliminationTree();
        }
    }

    protected processEliminationTree(): void {
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
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

    protected onClickManageMeeting(isOneway: boolean) {

        for(let e of this.eliminatories) {
            if(isOneway) {
                if(e.round.meetings.length == 2) {
                    this.tourneyService.deleteMeeting(e.round.meetings[1]);
                    e.round.meetings.splice(1, 1);
                }
            } else {
                let m = this.createMeeting(e.round.meetings[0].team2, e.round.meetings[0].team1, null, null, Direction.RoundTrip);
                e.round.meetings.push(m);

                this.tourneyService.addMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);
            }
        }
        this.processEliminationTree();

        this.prepareGui();
    }

    protected newDummyTeam() : Team {
        let dummy: Team = {id: this.tourneyService.getSequenceNumber(), teamName: ""};
        return dummy;
    }

     /**
        <th>N°</th>
        <th *ngIf="isTopLevel">Squadra 1</th>
        <th *ngIf="isTopLevel">Vs</th>
        <th *ngIf="isTopLevel">Squadra 2</th>
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
            { field: 'rowNumber',   header: 'N°' },
        ];

        if(this.isTopLevel) {
            this.cols.push({ field: 'teamName1', header: 'Squadra 1'});
            this.cols.push({ field: 'versus',    header: 'Vs' });
            this.cols.push({ field: 'teamName2', header: 'Squadra 2'});
        }

        this.cols.push({ field: 'onewayDatetime', header: 'Andata' });
        if(!this.selectedEliminatoryLevel.isOneway) {
            this.cols.push({ field: 'roundtripDatetime', header: 'Ritorno' });
        }
        this.rows = [];
        for(let i=0;i<this.eliminatories.length; i++) {
            let e = this.eliminatories[i];

            let onewayDatetime    = this.dateFormatPipe.transform(e.round.meetings[0].datetime);
            let roundtripDatetime = this.dateFormatPipe.transform(e.round.meetings[1].datetime);

            this.rows.push({e:e
                , rowNumber: i+1 
                , teamName1: e.round.meetings[0].team1.teamName
                , versus: " - "
                , teamName2: e.round.meetings[0].team2.teamName
                , onewayDatetime: onewayDatetime
                , roundtripDatetime: roundtripDatetime
            });
        }
    }

    /**
        <th>N°</th>
        <th>Andata</th>
        <th *ngIf="isTopLevel">C°</th>
        <th *ngIf="isTopLevel">Girone</th>
        <th *ngIf="isPlayoff && isTopLevel">Playoff</th>
        <th *ngIf="isTopLevel">Vs</th>
        <th *ngIf="isTopLevel">C°</th>
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
            { field: 'rowNumber',   header: 'N°'},
            { field: 'onewayDatetime', header: 'Andata'}
        ];

        if(this.isTopLevel) {
            this.cols.push({ field: 'position1', header: 'C°'});
            this.cols.push({ field: 'fromRound1', header: 'Girone' });
            if(this.isPlayoff) {
                this.cols.push({ field: 'fromPlayoff1', header: 'Playoff'});
            }

            this.cols.push({ field: 'versus',    header: 'Vs' });

            this.cols.push({ field: 'position2', header: 'C°'});
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

            let onewayDatetime  = this.dateFormatPipe.transform(e.round.meetings[0].datetime);
            let position1       = this.getPosition1(e);
            let fromRound1      = e.rule1.fromRound.round.label
            let fromPlayoff1    = e.rule1.fromPlayoff.round.label

            let position2       = this.getPosition2(e);
            let fromRound2      = e.rule2.fromRound.round.label
            let fromPlayoff2    = e.rule2.fromPlayoff.round.label

            let roundtripDatetime = this.dateFormatPipe.transform(e.round.meetings[1].datetime);

            this.rows.push({e:e
                , rowNumber: i+1
                , onewayDatetime: onewayDatetime
                , position1: position1
                , fromRound1: fromRound1
                , fromPlayoff1: fromPlayoff1
                , versus: " - "
                , position2: position2
                , fromRound2: fromRound2
                , fromPlayoff2: fromPlayoff2
                , roundtripDatetime: roundtripDatetime
            });
        }
    }

    getPosition1(e: Eliminatory): string {
        return "";
    }
    
    getPosition2(e: Eliminatory): string{
        return "";
    }
}

