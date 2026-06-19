import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { RoundType, Direction } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { Round } from 'app/tourneyonline/domain/round';
import { PlayoffRule } from 'app/tourneyonline/domain/playoff-rule';
import { AbstractRoundVO } from 'app/tourneyonline/domain/abstract-round-vo';
import { RoundVO } from "app/tourneyonline/domain/round-vo";

@Injectable({
  providedIn: 'root'
})
export class LevelService extends AbstractEliminatoryListView {
    static manualRedirectDV: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';
    static manualRedirectLV: string = '/admineliminatory/levelLv/eliminatoryManualLv';

    static autoRedirect:   string = '/admineliminatory/levelLv/eliminatoryLv/autodv';
    static autoRedirectLV: string = '/admineliminatory/levelLv/eliminatoryAutoLv';
    private selectedTeams:  Team[] = [];
    public roundsB: Round[] = [];

    constructor(
        protected override tourneyService: TourneyService,
        protected override meetingService: MeetingService,
        protected teamService: TeamService,
        protected override router: Router,
        protected override location: Location,
        protected dfp: DateFormatPipe
    ) {
        super("", tourneyService, meetingService, router, location, dfp);
    }

    override ngOnInit() {
        super.ngOnInit();
    }
 
    public onEliminatoryTeamNumChange(teamNo : number) : EliminatoryLevelVO[] {
        this.cleanEliminatoryMeetings( );        
        this.processEliminatoryTeams(teamNo);
        return this.eliminatoryLevelRows;
    } 
    
    private processEliminatoryTeams(teamCount: number): void {
        if( teamCount < 2 ) {
            this.eliminatoryLevels = [];
            return;
        }
        this.eliminatoryLevels = this.prepareEliminationTree(teamCount);
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.eliminatoryLevelRows = this.prepareEliminatoryLevelsGui(this.eliminatoryLevels, teamCount);
    }

    /**
     * Prepares elimination tree of the desired levels in function of the user selected 
     * number of teams to begin the minimum top elimination phase containing the selected
     * teams.
     * 
     * @param teamsNo the number of teams to allocate on the top eliminatory level
     */
    private prepareEliminationTree(topLevelTeamNo: number ): Array<EliminatoryLevel> {
        console.log("Entering prepareEliminationTree("+topLevelTeamNo+")");
        this.isOneway = "false";
        let levelsCombobox: Combobox[] =  this.prepareLevelCombobox(topLevelTeamNo );
        let eliminatoryLevels: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();
        for(let i = 0; i < levelsCombobox.length; i++ ) { // from 0 to 5...
            let lcb = levelsCombobox[i]; // levelsCombobox[i].value: from 5 to 1
            const topLevel : boolean = i == 0 ? true : false; // top level when i=0
            let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, topLevel, topLevelTeamNo);   
            eliminatoryLevels.push(el);
        }
        if ( topLevelTeamNo >= 4 ) { // if we have at least 4 teams we can create a match for 3° and 4° position
            this.addOptionalLevel(eliminatoryLevels);            
        }
        return eliminatoryLevels;
    }    

    private newEliminatoryLevel(lcb: Combobox, isTopLevel : boolean, topLevelTeamNo : number): EliminatoryLevel {
        const pow2LE : number =  this.highestPowerOf2LE(topLevelTeamNo); // if 18, pow2 = 16
        const playoffNo = topLevelTeamNo - pow2LE; // 18 - 16 = 2
        
        let els = new Array<Eliminatory>();
        if( isTopLevel ) {
            if( playoffNo > 0 ) { 
                for( let i = 0; i < playoffNo; i++ ) {
                    let e: Eliminatory = this.newEliminatory("P." + (i+1));
                    els.push(e);
                }
            } else {
                const pow2 = Math.pow(2, lcb.value == null ? 1 : lcb.value-1); // the minimum value of pow2 is 2^(lcb.value-1)=2^(1-1)=2^0=1
                for(let i=0; i<pow2; i++ ) {
                    let e: Eliminatory = this.newEliminatory( "E." + (i+1));
                    els.push(e);
                }
            }
        } else {
            const pow2 = Math.pow(2, lcb.value == null ? 1 : lcb.value-1); // the minimum value of pow2 is 2^(lcb.value-1)=2^(1-1)=2^0=1
            for(let i=0; i<pow2; i++ ) {
                let e: Eliminatory = this.newEliminatory( "E." + (i+1));
                els.push(e);
            }
        }

        const arVO = this.newAbstractRoundVO();
        let el : EliminatoryLevel = new EliminatoryLevel();        
        el.id = lcb.value;
        el.name = lcb.label;
        el.level = lcb.value == null ? 0 : lcb.value;
        el.isTopLevel = isTopLevel;
        el.direction = Direction.OneWay;
        el.eliminatories = els;
        el.isOptional = false;
        el.topLevelTeamNo = topLevelTeamNo;
        el.abstractRoundVO = arVO;
        return el;
    }

    private prepareLevelCombobox(teamsNo: number ) : Array<Combobox> {
        this.selectedTeams = [];
        for(let i=0; i<teamsNo; i++) {
            let t = this.selectedTourney.teams[i];
            this.selectedTeams.push(t);
        }
        return this.prepareCombobox(teamsNo );
    }

    private prepareCombobox(topLevelTeamNo: number) : Array<Combobox> {
        let levelNo = Math.ceil(Math.log2(topLevelTeamNo)); // minimum value of levelNo is 1 when teamsNo = 2
        let levelsCombobox = new Array<Combobox>();
        const pow2LE : number =  this.highestPowerOf2LE(topLevelTeamNo);
        const isPlayoff : boolean = topLevelTeamNo != pow2LE ? true : false;
        if( isPlayoff ) {
            let si: Combobox = { label: "Playoff", value: levelNo };
            levelsCombobox.push(si);
            levelNo--;
        }
        for (let l = levelNo; l > 0 ; l--) { // range from 5 to 1, never it is 0 neither -1
            let label = "";
            if (l >= 5) {
                label = Math.pow(2, l-1) + "-esimi di finale";
            }
            if (l == 4) {
                label = "Ottavi di finale";
            }
            if (l == 3) {
                label = "Quarti di finale";
            }
            if (l == 2) {
                label = "Semi finale";
            }
            if (l == 1) {
                label = "Finalissima 1° e 2° posto";
            }
            let si: Combobox = { label: label, value: l };
            levelsCombobox.push(si);
        }
        return levelsCombobox;
    }

    /**
     * Resets the received level by clearing the teams and all configurated meetings
     * found in its list of eliminatories
     * 
     * @param el eliminatory level to reset
     */
    private cleanExTopLevel(el: EliminatoryLevel) {
        console.log("Entering cleanExTopLevel()");
        for (let e of el.eliminatories) {
            e.round.teamNames = [];
            e.round.onewayMeetings = [];
            e.round.roundtripMeetings = [];
        }
    }
  
    /**
     * Computes the differences from the team list in the selected torney against the team 
     * list inside the receives eliminatories
     * 
     * @param topLevel the level to check
     * @returns true if both the team list are the same, false otherwise
     */
    private isSomeTeamsChanged(topLevel : EliminatoryLevel): boolean {
        for( let team of this.selectedTourney.teams ) {
            for( let el of topLevel.eliminatories ) {
                if(el.round.teamNames.find(t => t == team.teamName) == undefined)  {
                    return true;
                }
            }
        }
        for( let el of topLevel.eliminatories ) {
            for( let team of el.round.teamNames ) {
                if(this.selectedTourney.teams.find(t => t.teamName == team) == undefined)  {
                    return true;
                }
            }
        }
        return false;
    }
 
    private addOptionalLevel(els: Array<EliminatoryLevel>) {
        let lcb: Combobox = { label: "Finalina 3° e 4° posto", value: 1 };
        let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, false, 4);
        el.level = 1;
        el.isOptional = true;
        els.push(el);
    }

    private newAbstractRoundVO(overrides: Partial<AbstractRoundVO> = {}): AbstractRoundVO {
        const d = new AbstractRoundVO();
        d.direction = Direction.OneWay;
        d.matchBalanceScores = 1;
        d.matchWinnerScores = 3;
        d.pointsNeededToWin = 9;
        d.pointsGoldenGoalTieBreakWin = 2;
        d.pointsGoldenGoalTieBreakDefeat = 1;
        d.maxMatchesPerMeeting = 1;
        d.isAllMatches = "true";
        d.allMatchesEnabled = true; 
        
        // This merges defaults with any specific values you pass in
        return { ...d, ...overrides };
    }

    /**
     * A RoundVO factory
     * 
     * @param teamsForPlayoff how many teams for playoff we have
     * @param overrides if any, override the some attributes
     * @returns the new RoundVO instance 
     */
    private newRoundVO(  overrides: Partial<RoundVO> = {}): RoundVO {
        const arVO = this.newAbstractRoundVO();
        const d  = new RoundVO();
        d.direction = arVO.direction;
        d.matchBalanceScores = arVO.matchBalanceScores;
        d.matchWinnerScores = arVO.matchWinnerScores;
        d.pointsNeededToWin = arVO.pointsNeededToWin;
        d.pointsGoldenGoalTieBreakWin = arVO.pointsGoldenGoalTieBreakWin;
        d.pointsGoldenGoalTieBreakDefeat = arVO.pointsGoldenGoalTieBreakDefeat;
        d.maxMatchesPerMeeting = arVO.maxMatchesPerMeeting;
        d.isAllMatches = arVO.isAllMatches;
        d.isRoundAutoGen = "true";
        d.allMatchesEnabled = true;
        d.rounds = [];
        // This merges defaults with any specific values you pass in
        return { ...d, ...overrides };
    }
    
    public highestPowerOf2LE(n: number): number {
        if (n < 1) {
            return 0; // or throw, depending on your needs
        }
        return 1 << (31 - Math.clz32(n));
    }

    public newEliminatory(eName : string): Eliminatory {
        let t1: Team = this.newDummyTeam();
        let t2: Team = this.newDummyTeam();
        
        let fr1 : FromRound = new FromRound();
        let fr2 : FromRound = new FromRound();
        let pr1 : PlayoffRule = {
            id: 0,
            fromRound:  fr1,
            ruleName: "",
            isDummy: false
        }
        let pr2 : PlayoffRule = {
            id: 0,
            fromRound:  fr2,
            ruleName: "",
            isDummy: false
        }
        
        let e: Eliminatory = new Eliminatory();
        e.isSkiping = false;
        let elid = this.tourneyService.getSequenceNumber();
        e.id = elid;
        e.round.id = elid;
        e.round.name = eName;
        e.round.onewayCurrentDay = 1;
        e.round.roundtripCurrentDay = 1;
        e.round.type = RoundType.E;
        e.round.pageSize = 1;
        e.round.daysNo = 1;
        e.round.direction = Direction.OneWay;
        e.round.teamNames = [t1.teamName, t2.teamName];
        e.round.classification = [];
        e.round.onewayMeetings = [];
        e.round.roundtripMeetings = [];

        let m1: Meeting = this.meetingService.createMeeting(t1.teamName, t2.teamName, pr1, pr2, 1, Direction.OneWay, false);
        let m2: Meeting = this.meetingService.createMeeting(t2.teamName, t1.teamName, pr2, pr1, 2, Direction.RoundTrip, false);
        
        e.round.onewayMeetings.push(m1);
        e.round.roundtripMeetings.push(m2);
        e.round.classification.push(this.tourneyService.newClassification(t1.teamName,0));
        e.round.classification.push(this.tourneyService.newClassification(t2.teamName,0));

        return e;
    }

    /**
     * Loads all meetings belonging to all eliminatories level to can process al the levels
     * 
     * @param elList the list of the eliminatory levels
     * @param complete callback method called when load will finish
     */
    public loadAllEliminatoryMeetingByIdList(elList: EliminatoryLevel[], onComplete: () => void, error: (error: any) => void) {
        let idList: number [] = [];
        for( let el of elList) {
            for (let e of el.eliminatories) {
                if( e.id != null ) {
                    idList.push(e.id);
                }
            }
        }
        let abs = this.meetingService.loadEliminatoryMeetingByIdList(this.selectedTourney.id, idList, e => error(e) );
        abs.subscribe(meetingList => this.onLoadAllMeetingListNext(false, meetingList, elList, onComplete), e => error(e));
    }
       
    /**
     * Loads all meetings belonging to all eliminatories level to can process al the levels
     * 
     * @param elList the list of the eliminatory levels
     * @param complete callback method called when load will finish
     */
    public loadAllEliminatoryBMeetingByIdList(elList: EliminatoryLevel[], next: () => void, error: (error: any) => void) {
        let idList: number [] = [];

        for( let el of elList) {
            for (let e of el.eliminatories) {
                 if( e.id != null ) {
                    idList.push(e.id);
                }
            }
        }
        let abs = this.meetingService.loadEliminatoryBMeetingByIdList(this.selectedTourney.id, idList, e => error(e) );
        abs.subscribe(meetingList => this.onLoadAllMeetingListNext(true, meetingList, elList, next), e => error(e));
    }

    /**
     * Binds the load meeting to their corresponding eliminatory
     * 
     * @param elList the list of the eliminatory levels
     * @param complete callback methodo called when the load will finish
     */
    private onLoadAllMeetingListNext(isEb: boolean, meetingDbList: MeetingDb[], elList: EliminatoryLevel[], onComplete: () => void): void {
        for( let el of elList) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }

        let meetingList : Meeting [] = [];
        for( let  mdb of  meetingDbList) {
            let m : Meeting = JSON.parse(mdb.json);
            m.id = mdb.id;
            m.containerId = mdb.eliminatoryId == null ? 0 : mdb.eliminatoryId;
            if( isEb ) {
                m.containerId = mdb.eliminatoryBId == null ? 0 : mdb.eliminatoryBId;
            }
            meetingList.push(m);
        }

        for( let el of elList) {
            for (let e of el.eliminatories) {
                if( e.id != null ) {
                    let m1 : Meeting = this.findMeetingsOf(e.id, Direction.OneWay, meetingList);
                    e.round.onewayMeetings.push(m1);
                    let m2 : Meeting = this.findMeetingsOf(e.id, Direction.RoundTrip, meetingList);
                    e.round.roundtripMeetings.push(m2);
                }
            }
        }
        onComplete();
    }
   
    private findMeetingsOf(eliminatoryId : number, d : Direction, meetingList: Meeting[]): Meeting {
        let ms : Meeting[] = meetingList.filter( m => m.containerId === eliminatoryId &&  m.direction === d );
        return ms[0];
    }

    public onEliminatoryBTeamNumChange(teamNo : number) : EliminatoryLevelVO[] {
        this.cleanEliminatoryBMeetings();        
        this.processEliminatoryBTeams(teamNo);
        return this.eliminatoryBLevelRows;
    }

    private cleanEliminatoryMeetings() {
        for (let el of this.eliminatoryLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        for (let el of this.eliminatoryLevels) {
            el.eliminatories = [];
        }
        this.eliminatoryLevels = [];
        this.eliminatoryLevelRows = [];
    }

    private cleanEliminatoryBMeetings() {
        if( !this.eliminatoryBLevels ) {
            return;
        }
        for (let el of this.eliminatoryBLevels) {
            for (let e of el.eliminatories) {
                e.round.onewayMeetings = [];
                e.round.roundtripMeetings = [];
            }
        }
        for (let el of this.eliminatoryBLevels) {
            el.eliminatories = [];
        }
        this.eliminatoryBLevels = [];
        this.eliminatoryBLevelRows = [];
    }

    private processEliminatoryBTeams(teamCount: number): void {
        console.log("Entering processEliminatoryBTeams()");
        if( teamCount < 2 ) {
            return;
        }
        // let teamNo: number = this.selectedTourney.teams.length - teamCount;
        if( teamCount < 2 ) {
            return;
        }
        this.eliminatoryBLevels = this.prepareEliminationTree(teamCount);
        this.selectedTourney.eliminatoryBLevels = this.eliminatoryBLevels;
        // We would to skip it unless configured to have the unique big classification on all rounds... like the new champions league
        // this.prepareAutomaticEliminatoryRules(this.eliminatoryBLevels, teamNo, startPosition);
        this.eliminatoryBLevelRows = this.prepareEliminatoryLevelsGui(this.eliminatoryBLevels, teamCount);
    }
    
    public prepareEliminatoryLevelsGui(eliminatoryLevels: Array<EliminatoryLevel>, topLevelTeamNo : number ): EliminatoryLevelVO[]  {
        this.eliminatoryLevelCols = super.prepareELCols();
        const pow2LE : number =  this.highestPowerOf2LE(topLevelTeamNo); // if 18, pow2 = 16
        const playoffNo = topLevelTeamNo - pow2LE; // 18 - 16 = 2; 35 - 32 = 3
        const isPlayoff = playoffNo > 0;

        let eliminatoryLevelRows :EliminatoryLevelVO [] = [];
        for (let i = 0; i < eliminatoryLevels.length; i++) {
            let el = eliminatoryLevels[i];
            let teams : string = "";
            for( let e of el.eliminatories ) {
                teams = teams + e.round.teamNames + ", ";
            }
            teams = teams.substring(0, teams.length-1);
            let elvo : EliminatoryLevelVO =  {
                eliminatoryLevel : el
                ,rowNumber: i+1
                ,name: el.name
                ,level: isPlayoff && el.isTopLevel ? playoffNo*2 : this.pow2(el.level)
                ,teams: teams
            }
            eliminatoryLevelRows.push(elvo);
        }
        return eliminatoryLevelRows;
    }

    /**
     * Distributes a pre-sorted array into Left and Right arrays using the tournament tree pattern:
     * 1st -> Left Top, 2nd -> Right Top, 3rd -> Left Middle/Bottom, 4th -> Right Middle/Bottom...
     */
    public distributeSeeding(sortedMatches: Eliminatory[]): { left: Eliminatory[], right: Eliminatory[] } {
        // Temporary arrays to manage top-to-bottom filling sequences
        const totalCount = sortedMatches.length;
        const halfCount = totalCount / 2;
        
        const orderedLeft = new Array<Eliminatory>(halfCount);
        const orderedRight = new Array<Eliminatory>(halfCount);

        // This sequence generates the exact slot tracking index (0, 4, 2, 6, 1, 5, 3, 7...) 
        // ensuring items insert into the structural "middle" iteratively
        let leftIndexTracker = this.getBracketPositions(halfCount);
        let rightIndexTracker = this.getBracketPositions(halfCount);

        let leftIdx = 0;
        let rightIdx = 0;

        for (let i = 0; i < totalCount; i++) {
            if (i % 2 === 0) {
                // Even indexes (0, 2, 4...) go to the Left Wing
                const targetPos = leftIndexTracker[leftIdx++];
                orderedLeft[targetPos] = sortedMatches[i];
            } else {
                // Odd indexes (1, 3, 5...) go to the Right Wing
                const targetPos = rightIndexTracker[rightIdx++];
                orderedRight[targetPos] = sortedMatches[i];
            }
        }

        return {
            left: orderedLeft.filter(el => el !== undefined),
            right: orderedRight.filter(el => el !== undefined)
        };
    }

    // Helper generator to map standard index loops into balanced spatial tree positions
    private getBracketPositions(n: number): number[] {
        if (n === 1) return [0];
        
        let order = [0];
        while (order.length < n) {
            const nextOrder: number[] = [];
            for (let i = 0; i < order.length; i++) {
                nextOrder.push(order[i]);
                nextOrder.push(order[i] + order.length * 2); // Split calculation
            }
            order = nextOrder;
        }
        
        // Normalize order values to valid index arrays up to N items
        const sorted = [...order].sort((a,b) => a-b);
        return order.map(x => sorted.indexOf(x));
    }
}
