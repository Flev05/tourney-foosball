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
import { DateFormatPipe } from '../../common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { EliminatoryLevelVO } from 'app/tourneyonline/domain/eliminatory-level.vo';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { FromRound } from 'app/tourneyonline/domain/from-round';
import { Round } from 'app/tourneyonline/domain/round';

@Injectable()
export class LevelService extends AbstractEliminatoryListView {
    static manualRedirectDV: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';
    static manualRedirectLV: string = '/admineliminatory/levelLv/eliminatoryManualLv';

    static autoRedirect:   string = '/admineliminatory/levelLv/eliminatoryLv/autodv';
    static autoRedirectLV: string = '/admineliminatory/levelLv/eliminatoryAutoLv';
    private meetingList: MeetingDb[];
    public selectedTeams:  Team[];

    constructor(
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected teamService: TeamService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super("", tourneyService, meetingService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();
    }
    
    // private prepareStandaloneEliminatory(teamNo: number): void {

    //     this.selectedTourney.selectedEliminatoryTeamsCB.value = teamNo;
    //     this.processEliminatoryTeams(teamNo);
    // }

    /**
     * @Override
     * Specializes the corresponding method of the base class because of the asynchrnous behabiour of the
     * http REST call to the BE to load the meetings from the database.
     */
    // processEliminationTree(): void {

    //     let teamNo: number  = this.selectedTourney.teams.length;
    //     if( !this.isStandAlone(this.selectedTourney)  ) {
    //         teamNo = this.selectedTourney.selectedEliminatoryTeamsCB.value;
    //         if(teamNo == 0) {
    //             return;
    //         }
    //     } else {
    //         this.selectedTourney.selectedEliminatoryTeamsCB.value = teamNo;
    //     }
        
    //     this.processEliminatoryTeams(teamNo);
    // }

    /**
     * Prepares elimination tree of the desired levels in function of the user selected 
     * number of teams to begin the minimum top elimination phase containing the selected
     * teams.
     * 
     * @param teamsNo the number of teams to allocate on the top eliminatory level
     */
    private prepareEliminationTree(teamsNo: number): void {
        console.log("Entering prepareEliminationTree("+teamsNo+")");

        let levelsCombobox: Combobox[] =  this.prepareLevelCombobox(teamsNo);
        let selectedLevel = levelsCombobox[0].value;
        let maxCurrentLevel : number = 0;

        if(selectedLevel == maxCurrentLevel) {
            if( this.isStandAlone(this.selectedTourney) ) {
                let topLevel: EliminatoryLevel = this.eliminatoryLevels[0];
                this.prepareStandaloneTopLevel(topLevel);
            }
        }

        if(selectedLevel > maxCurrentLevel) {
            if( this.eliminatoryLevels.length > 0 ) {
                let el: EliminatoryLevel = this.eliminatoryLevels[0];
                this.cleanExTopLevel(el);
                el.isTopLevel = false;
            }

            let tempElimList: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();
            
            for(let i = 0; i < levelsCombobox.length; i++ ) {
                let lcb = levelsCombobox[i];

                if( lcb.value <= maxCurrentLevel ) {
                    break;
                }

                let topLevel: EliminatoryLevel = this.newEliminatoryLevel(lcb, i);    
                tempElimList.push(topLevel);
            }

            if( this.eliminatoryLevels.length==0 ) {
                this.eliminatoryLevels = tempElimList;
            } else {
                this.eliminatoryLevels = tempElimList.concat(this.eliminatoryLevels);
            }
            if( this.isStandAlone(this.selectedTourney) ) {
                let topLevel: EliminatoryLevel = this.eliminatoryLevels[0];
                this.prepareStandaloneTopLevel(topLevel);
            }
        } 
        
        if(selectedLevel < maxCurrentLevel) {
            let lcb = levelsCombobox[0];
            let topLevel: EliminatoryLevel = this.newEliminatoryLevel(lcb, 0);
            if( this.isStandAlone(this.selectedTourney) ) {
                this.prepareStandaloneTopLevel(topLevel);
            }
            this.eliminatoryLevels[0] = topLevel;
        }

        if(selectedLevel == 1) {
            if(this.eliminatoryLevels.length == 2) {
                this.eliminatoryLevels.splice(1, 1);
            }
        } else {
            let found: boolean = false;
            for(let e of this.eliminatoryLevels) {
                if(e.level == -1) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.addOptionalLevel();            
            }
        }
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
    }    

    private prepareLevelCombobox(teamsNo: number) : Array<Combobox> {
        this.selectedTeams = [];
        for(let i=0; i<teamsNo; i++) {
            let t = this.selectedTourney.teams[i];
            this.selectedTeams.push(t);
        }

        let levelNo = Math.ceil(Math.log2(teamsNo));
        let levelsCombobox = new Array<Combobox>();
        for (let l = levelNo; l > 0 ; l--) {
            let lev = "";
            if (l >= 5) {
                lev = Math.pow(2, l-1) + "-esimi di finale";
            }
            if (l == 4) {
                lev = "Ottavi di finale";
            }
            if (l == 3) {
                lev = "Quarti di finale";
            }
            if (l == 2) {
                lev = "Semi finale";
            }
            if (l == 1) {
                lev = "Finalissima 1° e 2° posto";
            }
            let si: Combobox = { label: lev, value: l };
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
     * Processes the standalone use case, when the tourney is configured as the only Eliminatory type,
     * no rounds and no playoffs.
     * 
     * @param teamCount the number of teams to allocate on the top eliminatory level
     */
    private prepareStandaloneTopLevel(topLevel : EliminatoryLevel): void {
        console.log("Entering prepareStandaloneTopLevel()");

        if( !this.isSomeTeamsChanged(topLevel) ) {
            console.log("There are the same teams, nothing todo!");
            return;            
        }
        
        this.cleanExTopLevel(topLevel);

        let tmpTeams: Array<Team> = this.sortAndPad(this.selectedTourney.teams);

        let ascTeam: Array<Team> = new Array<Team>();
        for(let i=0; i<tmpTeams.length/2; i++) {
            let c: Team = tmpTeams[i];
            ascTeam.push(c);
        }
        let descTeam: Array<Team> = new Array<Team>();
        for(let i=tmpTeams.length-1; i>=tmpTeams.length/2; i--) {
            let c: Team = tmpTeams[i];
            descTeam.push(c);
        }

        let topLevelEliminatories = topLevel.eliminatories;

        for(let i=0; i<ascTeam.length; i++) {
            let t1: Team = ascTeam[i];
            let t2: Team = descTeam[i];
            
            let e: Eliminatory = topLevelEliminatories[i];
            e.round.teamNames = [t1.teamName, t2.teamName];
            
            let m1: Meeting = this.meetingService.createMeeting(t1.teamName, t2.teamName, null, null, 1, Direction.OneWay, false);
            e.round.onewayMeetings = [m1];
            
            let m2: Meeting = this.meetingService.createMeeting(t2.teamName, t1.teamName, null, null, 2, Direction.RoundTrip, false);
            e.round.roundtripMeetings = [m2];
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
                if(this.selectedTourney.teams.find(t => t == team) == undefined)  {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * If teams weight not enabled, before sorts the received array of teams in a random way, 
     * then padds, with dummy teams, the array to the nearest power of 2 teams containg all the teams
     * 
     * @param teams the array of teams to sort and padd
     * @returns the padded (and sorted if enabled) teams
     */
    private sortAndPad(teams : Array<Team>): Array<Team> {

        let maxDeep: number = 0;
        for(let i=0; i<teams.length; i++) {
            if(teams.length > maxDeep ) {
                maxDeep = teams.length;
            }
        }
        let power2 = this.tourneyService.power2Padding(maxDeep);

        let tmpTeams: Array<Team> = new Array<Team>();

        tmpTeams = [...teams];

        if( !this.selectedTourney.teamsWeightEnabled ) {
            tmpTeams.sort((t1, t2) =>{
                let rand = Math.random();
                if(rand < 0.5) {
                    return 1;
                }
                return -1;
            });
        }

        for(let i=tmpTeams.length; i < power2; i++ ) {
            let t: Team = this.newDummyTeam();
            tmpTeams.push(t);
        }

        return tmpTeams;
    }

    /**
     * Allocate a local list of teams padding the received number of teams, by adding dummy teams with -1 points,
     * to the next nearest power of 2 nedeed to contains all of them.
     * 
     * Next, iterates on the eliminatories list and updates the meetings with the first against the last 
     * team in the pad list
     */
    public prepareAutomaticEliminatoryRules(selectedTeamsNo: number, automatic : boolean) {
        console.log("Entering prepareAutomaticEliminatoryRules()");
        if( this.selectedTourney.rounds.length == 0) {
            return;
        }

        this.isAutomatic = automatic;

        let padTeamList: Array<FromRound> = new Array<FromRound>();
 
        let power2: number = this.tourneyService.power2Padding(selectedTeamsNo);
        let position: number = 0;

        let rounds : Array<Round> = new Array<Round>();
        if(this.containsPlayoff()) {
            for(let p of this.selectedTourney.playoffs ) {
                rounds.push(p.round);
            }
        } else {
            rounds = [...this.selectedTourney.rounds];
        }
        let R: number  = rounds.length;

        for(let i=0; i<power2; i++) {
            let mod: number = i % R;
            if(mod == 0) {
                position++;
            }

            let r: Combobox = {label: "", value: 0}; 
            let p: Combobox = {label: "", value: 0}; 
            let fr : FromRound = {id:0, isAutomatic: this.isAutomatic, round: r, position: p, bandPosition: 0};
            if( i < selectedTeamsNo ) {
                let round: Round;
                round = rounds[mod];
                r = {label: round.name, value: position};
                p = {label: "", value: position};
                fr = {id:0, isAutomatic: this.isAutomatic, round: r, position: p, bandPosition: 0};
            }
            padTeamList.push(fr);
        }

        const topLevel = this.eliminatoryLevels[0];
        let topLevelEliminatories = topLevel.eliminatories;
        let lastIndex = power2; 
        
        for(let i=0; i<topLevelEliminatories.length; i++) {
            let e: Eliminatory = topLevelEliminatories[i];

            let up = padTeamList[i];

            let label = up.round.value == 0 ? "" : up.round.value  + "°";
            
            e.rule1.fromRound.position   = {label: label, value: up.position.value};
            e.rule1.fromPlayoff.position = {label: label, value: up.position.value};

            let round1 = rounds.find(r => r.name == up.round.label);
            if(this.containsPlayoff()) {
                e.rule1.fromPlayoff.round = {label: up.round.label, value: round1.id};
                e.rule1.fromRound.round   = {label: "", value: 0};
            } else {
                e.rule1.fromRound.round   = {label: up.round.label, value: round1.id};
                e.rule1.fromPlayoff.round = {label: "", value: 0};
            }

            let down = padTeamList[--lastIndex];

            label = down.position.value == 0 ? "" : down.position.value  + "°";
            
            e.rule2.fromRound.position   = {label: label, value: down.position.value};            
            e.rule2.fromPlayoff.position = {label: label, value: down.position.value};            

            e.rule1.fromRound.bandPosition = 0;
            e.rule2.fromRound.bandPosition = 0;
            if(this.isAutomatic) {
                e.rule1.fromRound.bandPosition = i % R + 1;
                if( e.rule2.fromRound.position.value > 0 )  {
                    e.rule2.fromRound.bandPosition = lastIndex % R + 1;
                }    
            }

            let round2      = rounds.find(r => r.name == down.round.label);
            let round2Id    = round2==undefined ? 0 : round2.id;
            let round2Label = round2==undefined ? "" : down.round.label;

            if(this.containsPlayoff()) {
                e.rule2.fromPlayoff.round = {label: round2Label, value: round2Id};
                e.rule2.fromRound.round   = {label: "", value: 0};
            } else {
                e.rule2.fromRound.round   = {label: round2Label, value: round2Id};
                e.rule2.fromPlayoff.round = {label: "", value: 0};
            }
        }
    }
    
    private addOptionalLevel() {
        let lcb: Combobox = { label: "Finalina 3° e 4° posto", value: 1 };
        let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, -1);
        el.level = 1;
        this.eliminatoryLevels.push(el);
    }
 
    private newEliminatoryLevel(lcb: Combobox, top : number): EliminatoryLevel {
        let els = new Array<Eliminatory>();
        
        let pow2 = Math.pow(2, lcb.value-1);

        for(let i=0; i<pow2; i++ ) {
            let e: Eliminatory = this.newEliminatory(i+1);
            els.push(e);
        }

        let el : EliminatoryLevel = {
              id: lcb.value
            , name: lcb.label
            , level: lcb.value
            , isTopLevel: top == 0 ? true : false
            , direction: Direction.OneWay
            , eliminatories: els
        };

        return el;
    }

    private newEliminatory(index : number): Eliminatory {
        let t1: Team = this.newDummyTeam();
        let t2: Team = this.newDummyTeam();

        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            round:{id: this.tourneyService.getSequenceNumber()
                , name: "" + index
                , type: RoundType.E
                , pageSize: 1
                , daysNo: 1
                , direction: Direction.OneWay
                , teamNames:[t1.teamName, t2.teamName]
                , classification: []
                , onewayMeetings: []
                , roundtripMeetings: []
            },
            rule1: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound: { id: null
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                    , bandPosition: 0
                    , isAutomatic:true
                },
                fromPlayoff: { id: null
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                    , bandPosition: 0
                    , isAutomatic:true
                }
            },
            rule2: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound: { id: null
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                    , bandPosition: 0
                    , isAutomatic:true
                },
                fromPlayoff: { id: null
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                    , bandPosition: 0
                    , isAutomatic:true
                }
            }
        };

        let m1: Meeting = this.meetingService.createMeeting(t1.teamName, t2.teamName, null, null, 1, Direction.OneWay, false);
        let m2: Meeting = this.meetingService.createMeeting(t2.teamName, t1.teamName, null, null, 2, Direction.RoundTrip, false);

        e.round.onewayMeetings.push(m1);
        e.round.roundtripMeetings.push(m2);

        return e;
    }

    onEliminatoryLevelRowSelect(event, redirect: string): void  {
        console.log("Entering onEliminatoryLevelRowSelect()");
        this.eliminatoryLevelSelectedRow = event.data;

        this.tourneyService.eliminatoryTeamsCombobox = this.eliminatoryTeamsCombobox;
        this.tourneyService.selectedEliminatoryLevel = this.eliminatoryLevelSelectedRow.eliminatoryLevel;
        this.selectedEliminatoryLevel = this.eliminatoryLevelSelectedRow.eliminatoryLevel;

        this.loadEliminatoryMeetingByIdList(this.selectedEliminatoryLevel, redirect);
    }

    private loadEliminatoryMeetingByIdList(el: EliminatoryLevel, redirect: string) {
        let idList: number [] = [];
        for (let e of el.eliminatories) {
            idList.push(e.id);
        }
        let abs = this.meetingService.loadEliminatoryMeetingByIdList(this.selectedTourney.id, idList);
        abs.subscribe(mdbs => this.meetingList = mdbs, e => this.onError(e), () => this.loadMetingListComplete(el, redirect));
    }

    private loadMetingListComplete(el: EliminatoryLevel, redirect: string) {
        for (let e of el.eliminatories) {
            for( let mdb of this.meetingList ) {
                let m : Meeting = JSON.parse(mdb.json);
                m.id = mdb.id;
                if( m.direction == Direction.OneWay ) {
                    e.round.onewayMeetings.push(m);
                } else {
                    e.round.roundtripMeetings.push(m);
                }
            }
        }
        this.router.navigate([redirect]);
    }
   
    onEliminatoryTeamNumChange(teamNo : number) : EliminatoryLevelVO[] {
        this.cleanEliminatoryMeetings();        
        this.processEliminatoryTeams(teamNo);
        return this.eliminatoryLevelRows;
    }

    private cleanEliminatoryMeetings( ) {
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

    private processEliminatoryTeams(teamCount: number): void {
        this.prepareEliminationTree(teamCount);

        if( this.isStandAlone(this.selectedTourney) ) {
        } else {
            this.prepareAutomaticEliminatoryRules(teamCount, true);
        }

        this.prepareEliminatoryLevelsGui();
    }

    public prepareEliminatoryLevelsGui(): void  {
        this.eliminatoryLevelCols = super.prepareELCols();
        
        this.eliminatoryLevelRows = [];
        for (let i = 0; i < this.eliminatoryLevels.length; i++) {
            let el = this.eliminatoryLevels[i];
            let elvo =  {
                eliminatoryLevel : el
                ,rowNumber: i+1
                ,name: el.name
                ,level: this.pow2(el.level)
            }
            this.eliminatoryLevelRows.push(elvo);
        }
    }
}

