import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { AbstractListView } from './abstract-listview';
import { MeetingRoundService } from '../admin/round/meeting-round-service';
import { MeetingPlayoffService } from '../admin/playoff/meeting-playoff-service';
import { DateFormatPipe } from './date-format-pipe';
import { LevelService } from '../admin/eliminatory/level-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Injectable } from '@angular/core';
import { Meeting } from 'app/tourneyonline/domain/meeting';

@Injectable()
export abstract class AbstractTabResultListView extends AbstractListView {
    cols: TableCols[] ;

    roundCols: TableCols[] = TourneyService.roundCols;
    roundRows: Round[];
    roundCount: number;
 
    selectedRound: Round;

    playoffCols: TableCols[] = TourneyService.playoffCols;
    playoffRows: Playoff[];
    playoutRows: Playoff[];
    playoffCount: number;
    playoutCount: number;
    selectedPlayoff: Playoff;
    selectedPlayout: Playoff;
    mdbList: MeetingDb[];

    eliminatoryCount: number;
    eliminatoryBCount: number;
    eliminatoryLevelCols: TableCols[];
    eliminatoryLevelRows: EliminatoryLevelVO[];
    eliminatoryBLevelRows: EliminatoryLevelVO[];
    selectedEliminatoryLevel: EliminatoryLevelVO;
    selectedEliminatoryBLevel: EliminatoryLevelVO;

    constructor(
        protected redirect: string,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected meetingRoundService: MeetingRoundService,
        protected meetingPlayoffService: MeetingPlayoffService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe,
        protected levelService: LevelService,
        protected clientService: ClientService,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        
        this.tourneyService.selectedEliminatoryLevelIndex = -1;
        this.tourneyService.selectedEliminatoryIndex = -1;

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.meetingPlayoffService.selectedTourney = this.selectedTourney;

        this.roundCount = 0;
        if(super.containsRound()) {
            let roundIds: number[] = [];
            for(let round of this.selectedTourney.roundVO.rounds) {
                roundIds.push(round.id);
                round.teamNo = "" + round.teamNames.length;
            }
            this.roundRows = this.selectedTourney.roundVO.rounds;
            for( let r of this.roundRows ) {
                r.classification = this.tourneyService.sortTeamsDesc(r.classification);
                r.classificatedTeamNames = [];
                for(let i=0;i<r.teamNames.length; i++) {
                    let tn = r.teamNames[i];
                    tn = tn.replace(/\(\d+\)/g, '');
                    if( r.classification.length > 0 && i < r.classification.length) {
                        tn = tn + "(" + r.classification[i].points+ ")";
                    }
                    r.classificatedTeamNames.push(tn);
                }
            }
            this.roundCount = this.roundRows.length;
            const subsbr = this.meetingRoundService.loadRoundMeetings(this.selectedTourney.id, roundIds, e => this.serverUnreachableHandler(e));
            subsbr.subscribe(t => this.onRoundCompleteLoad(t), e => this.onError(e) );            
        } else {
            this.prepareEliminatoryLevels();
            this.prepareEliminatoryBLevels();
        }
    }
    
    private onRoundCompleteLoad(t: MeetingDb[]): void {
        this.mdbList = t;
        for(let round of this.selectedTourney.roundVO.rounds) { 
            this.meetingRoundService.extractRoundMeetings(round, this.mdbList);
            this.tourneyService.createClassification(round, true);
        }
 
        this.playoffCount = 0;
        this.mdbList = [];
        if(super.containsPlayoff()) {
            this.playoffRows = this.selectedTourney.playoffVO.playoffs;
            this.playoffCount = this.playoffRows.length;
            let playoffIds: number[] = [];
            for(let p of this.selectedTourney.playoffVO.playoffs) {
                playoffIds.push(p.id);
                p.teamNames = "";
                for( let tn of p.round.teamNames) {
                    if( tn == MeetingService.SKIPING_TEAM) {
                        continue;
                    }
                    p.teamNames += tn + ", ";
                }
                p.teamNames = p.teamNames.substring(0, p.teamNames.length-1);
                p.teamNo = "" + p.round.teamNames.length;
            }

            const subsbr = this.meetingPlayoffService.loadPlayoffMeetings(this.selectedTourney.id, playoffIds, e => this.serverUnreachableHandler(e));
            subsbr.subscribe(t => this.onPlayoffCompleteLoad(t), e => this.onError(e));

            if(super.containsPlayout()) {
                this.playoutRows = this.selectedTourney.playoutVO.playoffs;
                this.playoutCount = this.playoutRows.length;
                let playoutIds: number[] = [];                
                for(let p of this.selectedTourney.playoutVO.playoffs) {
                    playoutIds.push(p.id);
                    p.teamNames = "";
                    for( let tn of p.round.teamNames) {
                        if( tn == MeetingService.SKIPING_TEAM) {
                            continue;
                        }
                        p.teamNames += tn + ", ";
                    }
                    p.teamNames = p.teamNames.substring(0, p.teamNames.length-1);
                    p.teamNo = "" + p.round.teamNames.length;
                }
                const subsbr = this.meetingPlayoffService.loadPlayoutMeetings(this.selectedTourney.id, playoutIds, e => this.serverUnreachableHandler(e));
                subsbr.subscribe(t => this.onPlayoutCompleteLoad(t), e => this.onError(e));
            }
        } else {
            this.prepareEliminatoryLevels();
            this.prepareEliminatoryBLevels();
        }
    }

    private prepareEliminatoryLevels() {
        if( !this.containsEliminatory() ) {
            return;
        }
            
        this.levelService.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        this.levelService.eliminatoryLevelRows = this.levelService.prepareEliminatoryLevelsGui(this.levelService.eliminatoryLevels);
        this.eliminatoryLevelCols = this.levelService.eliminatoryLevelCols;
        this.eliminatoryLevelRows = this.levelService.eliminatoryLevelRows;
        this.eliminatoryCount = this.levelService.eliminatoryLevelRows.length;
    }

    private prepareEliminatoryBLevels() {
        if( !this.containsEliminatoryB() ) {
            return;
        }
            
        this.levelService.eliminatoryBLevels = this.selectedTourney.eliminatoryBLevels;
        this.levelService.eliminatoryBLevelRows = this.levelService.prepareEliminatoryLevelsGui(this.levelService.eliminatoryBLevels);
        this.eliminatoryBLevelRows = this.levelService.eliminatoryBLevelRows;
        this.eliminatoryBCount = this.levelService.eliminatoryBLevelRows.length;
    }

    private onPlayoffCompleteLoad(mdbList: MeetingDb[]) {
        this.mdbList = mdbList;
        for(let playoff of this.selectedTourney.playoffVO.playoffs) { 
            this.meetingPlayoffService.extractPlayoffMeetings(playoff, this.mdbList);
    
            if( this.selectedTourney.playoffVO.isPlayoffAutoGen == "true") {
                this.meetingPlayoffService.resolveAutomaticTeams(playoff);
                this.meetingPlayoffService.resolveAutomaticMeetings(playoff, this.selectedTourney.roundVO.rounds);
            } else {
                this.meetingPlayoffService.resolveManualTeams(playoff);
                this.meetingPlayoffService.resolveManualMeetings(playoff, this.selectedTourney.roundVO.rounds);
            }

            this.tourneyService.createClassification(playoff.round, true);
        }
        this.prepareEliminatoryLevels();
        this.prepareEliminatoryBLevels();
    }

    private onPlayoutCompleteLoad(mdbList: MeetingDb[]) {
        this.mdbList = mdbList;
        for(let playout of this.selectedTourney.playoutVO.playoffs) { 
            this.meetingPlayoffService.extractPlayoffMeetings(playout, this.mdbList);
            if( this.selectedTourney.playoffVO.isPlayoffAutoGen == "true") {
                this.meetingPlayoffService.resolveAutomaticTeams(playout);
                this.meetingPlayoffService.resolveAutomaticMeetings(playout, this.selectedTourney.roundVO.rounds);
            } else {
                this.meetingPlayoffService.resolveManualTeams(playout);
                this.meetingPlayoffService.resolveManualMeetings(playout, this.selectedTourney.roundVO.rounds);
            }
            this.tourneyService.createClassification(playout.round, true);
        }
    }
 
    onChangeTab(e : any) {
        var index = e.index;
        console.log("Entering onChangeTab(" +index+ ")");
        this.meetingService.selectedResultTabIndex = index;
        let elIndex = 0;
        if( this.containsRound() && this.containsPlayoff() && this.containsPlayout() ) {
            elIndex = 3;
        } else if( this.containsRound() && this.containsPlayoff() ) {
            elIndex = 2;
        } else if( this.containsRound()  ) {
            elIndex = 1;
        } 
        if( index === elIndex ) {
            console.log("index === elIndex");
        }
        // let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        // const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Update Tourney operation'));
        // subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => {});
    }

    protected prepareRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Meeting> = new Map<string, Meeting>();

        for (let round of rounds) {
            row = this.prepareRoundPlayoffMeetingGui(null, round, rows, row, classificationMap);
        }

        return rows;
    }

    protected preparePlayoffGui(playoffs: Playoff[]): any[] {
        let row : number = 0;
        let rows: any[] = [];

        let meetingMap: Map<string, Meeting> = new Map<string, Meeting>();

        for (let p of playoffs) {
            row = this.prepareRoundPlayoffMeetingGui(p, p.round, rows, row, meetingMap);
        }

        return rows;
    }

    /**
        <th>N°</th>
        <th>Squadra 1</th>
        <th>Squadra 2</th>
        <th>Pt.1</th>
        <th>Pt.2</th>

        <td>{{rowData.roundNo}}</td>                
        <td>{{rowData.teamName1}}</td>
        <td>{{rowData.teamName2}}</td>
        <td>{{rowData.points1}}</td>
        <td>{{rowData.points2}}</td>        
     * @param rounds 
     */
    private prepareRoundPlayoffMeetingGui(p: Playoff, round: Round, rows: any[], row: number, meetingMap: Map<string, Meeting>) {
        
        this.cols = this.levelService.prepareResultRoundPlayoffColums();

        let rowNumber : number=0;

        for (let m of round.onewayMeetings) {
            rows.push(m);

            rowNumber++;
            rows[row].id = m.id;
            rows[row].dateAndTime = this.dfp.transform(m.datetime);
            rows[row].rowNumber = rowNumber;
            rows[row].roundtrip = round.direction == Direction.OneWay ? "A" : "R";
            rows[row].roundId = round.id;
            rows[row].eliminatoryId = 0;    
            rows[row].playoffId = 0;
            if(p!=null) {
                rows[row].playoffId = p.id;
            }
            rows[row].roundName = round.name;
            rows[row].teamName1 = m.teamName1;
            rows[row].teamName2 = m.teamName2;
            rows[row].points1 = m.points1;
            rows[row].points2 = m.points2;

            rows[row].goals1 = 0;
            rows[row].goals2 = 0;
            for(let ma of m.matches) {
                rows[row].goals1 += ma.score1;
                rows[row].goals2 += ma.score2;
            }

            let currentKey = round.name;
            if (!meetingMap.has(currentKey)) {
                let len = round.onewayMeetings.length;
                meetingMap.set(currentKey, m);
                rows[row].rowspanSize = len;
            } else {
                rows[row].rowspanSize = undefined;
            }
            row++;
        }
        return row;
    }
}

