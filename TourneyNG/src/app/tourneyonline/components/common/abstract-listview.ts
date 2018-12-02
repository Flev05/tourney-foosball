import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { Team } from 'app/tourneyonline/domain/team';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { PhaseType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
 
export abstract class AbstractListView extends AbstractView {
    roundMap: Map<number, Round>;
    playoffRoundMap: Map<number, Playoff>;

    roundRows: any[] = [];
    playoffRows: any[] = [];
    eliminatoryRows: any[] = [];

    roundMeetings: MeetingDb[];
    playoffMeetings: MeetingDb[];
    eliminatoryMeetings: MeetingDb[][];
    levelMap: Map<number, Eliminatory[]>;
    totLevelLen: number;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , protected router: Router
        , protected location: Location) { 
            super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }
  
    protected gotoDetailView() {
        this.router.navigate([this.redirect]);
    }

    protected containsPhase(value: PhaseType, phases: PhaseType[]) : boolean{

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i] == value ) {
                return true;
            }
        }
        return false;
    }

    protected pow2(level : number) : number {
        return Math.pow(2, level);
    }

    protected containsPlayoff(): boolean {
        return this.containsPhase(PhaseType.P, this.selectedTourney.phases);
    }

    protected containsEliminatory(): boolean {
        return this.containsPhase(PhaseType.E, this.selectedTourney.phases);
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

    protected loadEliminatory(): any {
        
        let levels: Array<EliminatoryLevel> = this.selectedTourney.eliminatoryLevels;

        this.levelMap = new Map<number, Array<Eliminatory>>();
        for(let l of levels) {
            if(l.isTopLevel) {
                this.totLevelLen = l.eliminatories.length;
                for(let i=0; i<this.totLevelLen; i++) {

                    let mdbArray: Array<MeetingDb> = new Array<MeetingDb>();
                    this.eliminatoryMeetings.push(mdbArray);
                    let e = l.eliminatories[i];
    
                    let elArray = new Array<Eliminatory>();
                    this.levelMap.set(l.id, elArray);

                    const subscr = this.tourneyService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                    subscr.subscribe(em => this.eliminatoryMeetings[i] = em, e => this.onError(e), () => this.onLoadEliminatoryMeeting() );       
                }
                break;
            }
        }
    }
    
    /**
     * Call back method to process the Eliminatory meetings selected from the database
     */
    onLoadEliminatoryMeeting(): void {
        if(this.eliminatoryMeetings.length==0) {
            return;
        }
        for(let i=0; i<this.totLevelLen; i++) {

            let topLevelMeetings: MeetingDb[] = this.eliminatoryMeetings[i];

            // let r = po.round;
            // let m: Meeting = JSON.parse(mdb.json);
            // r.meetings.push(m);
            // this.resolveEliminaotoryRules(po, this.selectedTourney.rounds);
        }
        // this.eliminatoryRows = this.prepareEliminatoryGui(this.selectedTourney.eliminatoryLevels);
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

    protected prepareRoundsGui(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        let classificationMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            
            for (let c of round.classification) {
                
                rows.push(c);
                rows[row].roundName = round.name;    
                rows[row].teamName = c.team.teamName;    
                rows[row].points = c.points;    
                rows[row].played = c.played;    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDone = c.goalsDone;    
                rows[row].goalsConceded = c.goalsConceded;    
                rows[row].goalsDiff = c.goalsDiff;    

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

    protected preparePlayoffGui(playoffs: Playoff[]): any[] {
        let rounds: Array<Round> = new Array<Round>();

        for(let p of playoffs) {
            rounds.push(p.round);
        }
        return this.prepareRoundsGui(rounds);
    }

    protected makePlayoffRounds(playoffs: Playoff[]) {
        let playoffRounds: Round[] = [];
        for (let p of playoffs) {
            playoffRounds.push(p.round);
        }
        return playoffRounds;
    }

    goBack(): void {
        this.location.back();
    }
    onError(e:any) {
        console.log(e);
    }
}
