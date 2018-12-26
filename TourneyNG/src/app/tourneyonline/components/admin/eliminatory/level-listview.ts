import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { RoundType, EliminatoryMode, Direction } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { EliminatoryManualListView } from './eliminatory-manuallistview';
import { EliminatoryAutoListView } from './eliminatory-autolistview';

@Component({
    templateUrl: './level-listview.html'   
})
export class LevelListView extends AbstractEliminatoryListView {

    cols: any[];
    rows: any[];
    selectedRow: any;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
        protected dfp: DateFormatPipe
    ) {
        super(EliminatoryAutoListView.autoRedirectLV, tourneyService, router, location, dfp);
    }

    ngOnInit() {
        super.ngOnInit();

        this.loadMeetings();

        this.prepareConfigELGui();
    }

    private prepareConfigELGui() {
        this.cols = super.prepareELCols();
        
        this.rows = [];
        for (let i = 0; i < this.eliminatoryLevels.length; i++) {
            let el = this.eliminatoryLevels[i];
            this.rows.push({ el: el, rowNumber: i + 1, level: el.level == -1 ? 2 : this.pow2(el.level), name: el.name });
        }
    }

    private loadMeetings(): any {

        if(this.eliminatoryLevels.length == 0) {
            this.processEliminationTree();
            return;
        }

        this.loadEliminatoryLevels();
    }

    processEliminationTree(): void {

        this.prepareEliminationTree(this.selectedTeamsNumCombobox.value);

        if (this.isStandalone) {
            this.processStandalone();
        } else if (this.isAutomatic) {
            this.processAutomaticEliminatories(this.selectedTeamsNumCombobox.value);
        }

        super.processEliminationTree();
    }

    /**
     * Prepares elimination tree of the desired levels in function of the user selected 
     * number of teams to begin the minimum top elimination phase containing the selected
     * teams.
     * 
     * @param teamsNo the number of teams to allocate on the top eliminatory level
     */
    private prepareEliminationTree(teamsNo: number): any {
        console.log("Entering prepareEliminationTree("+teamsNo+")");

        let levelsCombobox: Combobox[] =  this.tourneyService.prepareLevelCombobox(teamsNo);

        if(this.eliminatoryLevels.length==0) {
            for(let i=0; i<levelsCombobox.length; i++ ) {
                let lcb = levelsCombobox[i];
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, i);
                this.eliminatoryLevels.push(el);
            }
            this.addOptionalLevel();  
            return;
        }     
        
        let selectedLevel = levelsCombobox[0].value;
        let maxCurrentLevel = this.eliminatoryLevels[0].level;

        if(selectedLevel > maxCurrentLevel) {
            let tempElimList: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();

            let i = 0;
            let lcb = levelsCombobox[i];
            while( lcb.value > maxCurrentLevel ) {        

                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, i);
                tempElimList.push(el);
                i++;
                lcb = levelsCombobox[i];
            }

            let el: EliminatoryLevel = this.eliminatoryLevels[0];
            el.isTopLevel = false;

            tempElimList =  tempElimList.concat(this.eliminatoryLevels);
            this.eliminatoryLevels = tempElimList;
        }

        if(selectedLevel < maxCurrentLevel) {

            let deleted: EliminatoryLevel[] = this.eliminatoryLevels.splice(0, maxCurrentLevel - selectedLevel);
            for(let d of deleted) {
                for(let e of d.eliminatories) {
                    for(let m of e.round.meetings) {
                        this.tourneyService.deleteMeeting(m);
                    }
                }
            }

            let el: EliminatoryLevel = this.eliminatoryLevels[0];
            el.isTopLevel = true;
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
    }    

    /**
     * Processes the standalone use case, when the tourney is configured as the only Eliminatory type,
     * no rounds and no playoffs.
     */
    private processStandalone() {

        let topElimLevel = this.eliminatoryLevels[0];

        let round = topElimLevel.standaloneRound;
        if(round==undefined) {
            round = {id:this.tourneyService.getSequenceNumber()
                , name:""
                , type: RoundType.E
                , teams: []
                , meetings:[]
                , classification:[]                
            };
            topElimLevel.standaloneRound = round;
        }

        let teamMap: Map<number, Team> = new Map<number, Team>();
        for(let t of this.tourneyService.selectedTeams) {
            teamMap.set(t.id, t);
        }

        for(let t of round.teams) {
            if(!teamMap.has(t.id)) {
                for(let m of round.meetings) {
                    if(m.team1.id == t.id || m.team2.id == t.id) {
                        this.tourneyService.deleteMeeting(m);
                    }
                }
            }
        }

        round.teams = this.tourneyService.selectedTeams;
        let tmpTeams: Array<Team> = this.sortAndPad(round.teams);

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

        const topLevel = this.eliminatoryLevels[0];
        let topLevelEliminatories = topLevel.eliminatories;

        for(let i=0; i<ascTeam.length; i++) {

            let t1: Team = ascTeam[i];
            let t2: Team = descTeam[i];
            
            let e: Eliminatory = topLevelEliminatories[i];
            e.round.teams[0] = t1;
            e.round.teams[1] = t2;
            
            let m = e.round.meetings[0];
            m.team1 = t1;
            m.team2 = t2;
            this.tourneyService.updateMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);
            
            m = e.round.meetings[1];
            m.team1 = t2;
            m.team2 = t1;
            
            this.tourneyService.updateMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);
        }
    } 

    /**
     * First sorts the received array of teams in a random way then padds, with dummy teams, the array 
     * to the nearest power of 2 teams containg all the teams
     * 
     * @param teams the array of teams to sort and padd
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

        if( this.tourneyService.regenerateStandaloneTopLevel ) {
            tmpTeams.sort((t1, t2) =>{
                let rand = Math.random();
                if(rand < 0.5) {
                    return 1;
                }
                return -1;
            });
        }
        this.tourneyService.regenerateStandaloneTopLevel = false;

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
    private processAutomaticEliminatories(selectedTeamsNo: number) {
        
        let roundsNo = this.selectedTourney.rounds.length;
        if(roundsNo == 0) {
            return;
        }

        let padTeamList: Array<Combobox> = new Array<Combobox>();
 
        let power2 = this.tourneyService.power2Padding(selectedTeamsNo);
        let position: number = 0;
        let R: number  = this.selectedTourney.rounds.length;
        for(let i=0; i<power2; i++) {
            let mod: number = i % R;
            if(mod == 0) {
                position++;
            }

            let cb : Combobox = {label: "", value: 0};
            if(i<selectedTeamsNo) {
                let round = this.selectedTourney.rounds[mod];
                cb = {label: round.name, value: position};
            }
            padTeamList.push(cb);
        }

        const topLevel = this.eliminatoryLevels[0];
        let topLevelEliminatories = topLevel.eliminatories;
        let lastIndex = power2; 
        
        for(let i=0; i<topLevelEliminatories.length; i++) {

            let e: Eliminatory = topLevelEliminatories[i];

            let up = padTeamList[i];
            e.rule1.fromRound.id = this.tourneyService.getSequenceNumber();
            let label = up.value == 0 ? "" : up.value  + "°";
            e.rule1.fromRound.position = {label:"" + label, value: up.value};
            e.rule1.fromPlayoff.position = {label:"" + label, value: 1};
            e.rule1.fromRound.round = {label:up.label, value: up.value};
            e.rule1.fromPlayoff.round = {label:"" + label, value: 1};

            let down = padTeamList[--lastIndex];
            e.rule2.fromRound.id = this.tourneyService.getSequenceNumber();
            label = down.value == 0 ? "" : down.value  + "°";
            e.rule2.fromRound.position = {label:"" + label, value: down.value};
            e.rule2.fromPlayoff.position = {label:"" + label, value: 1};
            e.rule2.fromRound.round = {label:down.label, value: down.value};
            e.rule2.fromPlayoff.round = {label:"" + label, value: 1};
        }
    }
    
    private addOptionalLevel() {
        let lcb: Combobox = { label: "Finalina 3° e 4° posto", value: 1 };
        let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, -1);
        el.level = -1;
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
            , isOneway: true
            , eliminatories: els
        };

        return el;
    }

    private newEliminatory(index : number): Eliminatory {
        let meetings : Array<Meeting> = new Array<Meeting>();

        let t1: Team = this.newDummyTeam();
        let t2: Team = this.newDummyTeam();

        let m1: Meeting = this.createMeeting(t1, t2, null, null, Direction.OneWay);
        meetings.push(m1);

        let m2: Meeting = this.createMeeting(t2, t1, null, null, Direction.RoundTrip);
        meetings.push(m2);

        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            round:{id: this.tourneyService.getSequenceNumber()
                , name: "" + index
                , type: RoundType.E
                , teams:[t1, t2]
                ,classification: []
                ,meetings: meetings
            },
            rule1: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            },
            rule2: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            }
        };

        this.tourneyService.addMeetingDb(m1, this.selectedTourney.id, 0, 0, e.id);
        this.tourneyService.addMeetingDb(m2, this.selectedTourney.id, 0, 0, e.id);

        return e;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.teamsCombobox = this.teamsCombobox;
        
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.tourneyService.selectedEliminatoryLevel = this.selectedRow.el;

        let redirect: string = EliminatoryAutoListView.autoRedirectLV;
        if(this.isManual) {
            redirect = EliminatoryManualListView.manualRedirectLV;
        } 
        this.router.navigate([redirect]);
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode=EliminatoryMode.M;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = true;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
        this.tourneyService.regenerateStandaloneTopLevel = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        let popup = 'Sicuro di voler passare alla modalità automatica?';
        popup += 'Se si, il sistema rimuoverà tutte le impostazioni che avete inserito nel modo manuale';

        if(confirm(popup)) {
            this.eliminatoryMode=EliminatoryMode.A;
            this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
            this.isManual = false;

            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
            this.tourneyService.regenerateStandaloneTopLevel = true;
        }
    }
 
    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);

        let N: number = this.selectedTeamsNumCombobox.value;
        this.prepareEliminationTree(N);

        this.tourneyService.regenerateStandaloneTopLevel = true;
        if (this.isStandalone) {
            this.processStandalone();
        }
        else if (this.isAutomatic) {
            this.processAutomaticEliminatories(N);
        }

        this.selectedTourney.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));

        this.prepareConfigELGui();
    }
}

