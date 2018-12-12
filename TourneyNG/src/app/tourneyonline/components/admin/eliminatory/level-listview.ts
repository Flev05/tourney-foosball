import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { RoundType, EliminatoryMode, PhaseType, Direction, TeamSortType } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Component({
    templateUrl: './level-listview.html'
})
export class LevelListView extends AbstractListView {
    static autoRedirect: string = '/admineliminatory/levelLv/eliminatoryAutoLv';
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryManualLv';

    msgs: Message[] = [];
   
    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;

    isStandalone: boolean;
    isModeEnabled: boolean;
    isManual: boolean;

    selectedLevelCombobox: Combobox;
    selectedTeamsNumCombobox: Combobox;
    teamsCombobox: Combobox[];
    isAutomatic: boolean;
    meetingMap: Map<number, MeetingDb[]>;
    httpCounter: number;
    eliminatoryRoundMap: Map<number, Round>;
    
    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(LevelListView.autoRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.selectedTourney = this.tourneyService.selectedTourney; 

        this.teamsCombobox = this.tourneyService.teamsCombobox;
        this.selectedTeamsNumCombobox = this.selectedTourney.selectedTeamsNumCombobox;
  
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
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
        
        this.loadMeetings();
    }

    private loadMeetings(): any {

        if(this.eliminatoryLevels.length == 0) {
            this.processEliminationTree();
            return;
        }

        this.meetingMap = new Map<number, MeetingDb[]>();        
        this.eliminatoryRoundMap = new Map<number, Round>();        
        this.httpCounter = 0;

        for(let topElimLevel of this.eliminatoryLevels) {
            for(let e of topElimLevel.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                this.httpCounter++;

                let abs = this.tourneyService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(mdbs), e => this.onError(e));
            }
        }
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

    private processEliminationTree() {
        
        this.prepareEliminationTree(this.selectedTeamsNumCombobox.value);

        if (this.selectedTourney.phases.length == 1 &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
        }
        else {
            this.isStandalone = false;
        }
        this.tourneyService.isStandalone = this.isStandalone;
        if (this.isStandalone) {
            this.processStandalone();
        }
        else if (this.isAutomatic) {
            this.prepateAutoEliminatories(this.selectedTourney.rounds);
        }
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
     * Always aligns the teams in the local round to the user selected teams
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

        if(round.teams.length != this.tourneyService.selectedTeams.length) {

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
        }    

        let rounds : Round[] = [round];
        this.prepateAutoEliminatories(rounds);
    } 
    
    private prepareDefaultClassification(r: Round) {
        r.classification = [];
        for (let t of r.teams) {
            let c: Classification = this.newClassification(t, 0);
            r.classification.push(c);
        }
    }

    /**
     * For each round, adds the correct dummy classifictions, having points=-1, so the total number 
     * of teams will be equal to the next nearest power of 2.
     * 
     * Sorts by firsts classificated teams in each round, then the second in each round, and so on.
     * 
     * Create a full list of each so sorted classificated teams and prepare 2 new lists:
     * an ascendent list starting from the first to the half and a descendent list starting from 
     * the ast team to the half.
     * 
     * So prepare the elemintories list by using the smart put algorithm
     */
    private prepateAutoEliminatories(rounds : Round[]): void  {
        
        for(let r of rounds) {
            this.prepareDefaultClassification(r);
        }

        this.paddingRound(rounds);

        let bestOfMap: Map<string, Array<Classification>> = new Map<string, Array<Classification>>();
        for(let i=0; i<rounds.length; i++) {
            let r = rounds[i];

            let orderedClassification: Array<Classification> = this.teamSort(r.classification);

            for(let j=0; j < orderedClassification.length; j++) {
                let c: Classification = orderedClassification[j];
                let key = "" + (j + 1);
                if(!bestOfMap.has(key)) {
                    let list: Array<Classification> = new Array<Classification>();
                    bestOfMap.set(key, list);
                }

                let list: Array<Classification> = bestOfMap.get(key);

                list.push(c);
            }
        }

        let allSortedClassification: Array<Classification> = new Array<Classification>();
        for(let key of bestOfMap.keys()) {
            
            let unsortedClassification: Array<Classification> = bestOfMap.get(key);

            let sortedClassification: Array<Classification> = this.teamSort(unsortedClassification);
            bestOfMap.set(key, sortedClassification);

            allSortedClassification = allSortedClassification.concat(sortedClassification);
        }

        let ascClassification: Array<Classification> = new Array<Classification>();
        for(let i=0; i<allSortedClassification.length/2; i++) {
            let c: Classification = allSortedClassification[i];
            ascClassification.push(c);
        }
        let descClassification: Array<Classification> = new Array<Classification>();
        for(let i=allSortedClassification.length-1; i>=allSortedClassification.length/2; i--) {
            let c: Classification = allSortedClassification[i];
            descClassification.push(c);
        }

        let sequenzialEliminatories: Array<Eliminatory> = new Array<Eliminatory>();

        const topLevel = this.eliminatoryLevels[0];
        let topLevelEliminatories = topLevel.eliminatories;
        for(let i=0; i<ascClassification.length; i++) {

            let c1: Classification = ascClassification[i];
            let c2: Classification = descClassification[i];

            let e: Eliminatory = topLevelEliminatories[i];

            let m = e.round.meetings[0];
            m.team1 = c1.team;
            m.team2 = c2.team;
            
            this.tourneyService.updateMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);

            sequenzialEliminatories.push(e);
        }

        let N: number = ascClassification.length;
        let p: number=0;
        for (let step = N; step >= 1; step = step / 2) {

            for (let i = 0; i < N; i += step) {
                if(topLevelEliminatories[i].round.meetings.length != 0) {
                    continue;
                }
                let e = sequenzialEliminatories[p];
                topLevelEliminatories[i] = e;
                p++;
            }
        }
        console.log("Eliminatories.size=" + topLevelEliminatories.length);
    }

    /**
     * The padding process is for align the round classification length to the
     * nearest upper power of 2 elimination level containing the teams in each round.
     * 
     * For example, if you have 3 rounds of length 4, 11 and 7 teams rispectively, you need
     * 4, 16 and 8 initial elimination levels ripectively.
     * 
     * So we first need to compute the max team count of each round and
     * next append the dummy teams to align all the round to the max length.
     * 
     * The dummy teams are teams having points = -1
     */
    private paddingRound(rounds : Round[]): any {

        let maxDeep: number = 0;

        for(let i=0; i<rounds.length; i++) {
            let r = rounds[i];

            if(r.classification.length > maxDeep ) {
                maxDeep = r.classification.length;
            }
        }

        let power2 = this.tourneyService.power2Padding(maxDeep);

        for(let i=0; i<rounds.length; i++) {
            let r = rounds[i];
            for(let i=r.classification.length; i < power2; i++ ) {
                let t: Team = {id: this.tourneyService.getSequenceNumber(), teamName: ""};
                let dummy = this.newClassification(t, -1);
                r.classification.push(dummy);
            }
        }
    }

    /**
     * Team ordering, first sort the teams on the points basis so the dummy team having points=-1
     * will be the last in the team list. Next, order the team list in function of team sort type 
     * chosen by the user
     * 
     * @param unsortedClassification the unsorted team list
     */
    private teamSort(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
            if (t1.points > t2.points) {
                return -1;
            }
        
            if (t1.points < t2.points) {
                return 1;
            }
        
            return 0;
        });

        if( this.selectedTourney.teamSortType==TeamSortType.O) {
            return sortedClassification;
        }
        if( this.selectedTourney.teamSortType==TeamSortType.R) {
            sortedClassification = sortedClassification.sort((t1, t2) =>{
                let rand = Math.random();
                if(rand < 0.33) {
                    return 0;
                }
                if(rand > 0.66) {
                    return 1;
                }
                return -1;
            });
            return sortedClassification;
        }

        sortedClassification = sortedClassification.sort((c1, c2) =>{
            if(c1.team.teamName > c2.team.teamName) {
                return 1;
            }
            if(c1.team.teamName < c2.team.teamName) {
                return -1;
            }

            return 0;
        });

        return sortedClassification;
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

        let m: Meeting = this.createMeeting(null, null, null, null, Direction.OneWay);

        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            round:{id: this.tourneyService.getSequenceNumber()
                , name: "" + index
                , type: RoundType.E
                , teams:[
                     {id:0, teamName:""}
                    ,{id:1, teamName:""}
                ]
                ,classification: []
                ,meetings: [m]
            },
            rule1: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            },
            rule2: {
                id: this.tourneyService.getSequenceNumber(),
                fromRound:   { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                },
                fromPlayoff: { id: this.tourneyService.getSequenceNumber()
                    , position: { label: "1°", value: 0 }
                    , round: { label: "", value: 0 } 
                }
            }
        };

        this.tourneyService.addMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);

        return e;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.teamsCombobox = this.teamsCombobox;
        
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        let redirect: string = LevelListView.autoRedirect;
        if(this.isManual) {
            redirect = LevelListView.manualRedirect;
        } 
        this.router.navigate([redirect]);
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode=EliminatoryMode.M;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = true;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
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
        }
    }
 
    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);

        let N: number = this.selectedTeamsNumCombobox.value;
        this.prepareEliminationTree(N);

        if (this.isStandalone) {
            this.processStandalone();
        }
        else if (this.isAutomatic) {
            this.prepateAutoEliminatories(this.selectedTourney.rounds);
        }

        this.selectedTourney.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    }
}

