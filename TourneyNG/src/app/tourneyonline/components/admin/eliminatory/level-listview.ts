import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { PhaseType, EliminatoryMode, TeamSortType, Direction, MeetingStatus } from '../../../domain/enumerations';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Team } from 'app/tourneyonline/domain/team';

@Component({
    templateUrl: './level-listview.html'
})
export class LevelListView extends AbstractListView {
    static redirect: string = '/admineliminatory/levelLv/eliminatoryLv';

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
    localRounds: Round[];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(LevelListView.redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        let teamsNo = this.tourneyService.prepareEliminatoriesComboBoxes();

        this.selectedTourney = this.tourneyService.selectedTourney; 

        this.teamsCombobox = this.tourneyService.teamsCombobox;

        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
                
        this.isStandalone = false;

        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            this.containsPhase(PhaseType.P, this.selectedTourney.phases) &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = false;
        } else {
             this.isModeEnabled = true;
        }

        this.prepareEliminatoryLevels(teamsNo);

        if( this.selectedTourney.phases.length == 1 && 
                this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
            this.isManual = false;
            this.tourneyService.availableTeams = [];
            this.processStandalone();
        }
        
        if(!this.isManual || this.isStandalone) {
            this.loadLocalRounds();
            this.prepateAutoEliminatories();
        }
    }

    /**
     * Processes the standalone use case, when the tourney is configured as the only Eliminatory type,
     * no rounds and no playoffs.
     * Always aligns the teams in the local round to the user selected teams
     */
    private processStandalone() {

        if(this.localRounds == undefined) {
            this.localRounds = [];
            let round: Round = {id:this.tourneyService.getSequenceNumber()
                , name:""
                , type: RoundType.E
                , teams: this.tourneyService.selectedTeams
                , meetings:[]
                , classification:[]                
            };
            this.localRounds.push(round);
        }

        let r = this.localRounds[0];

        this.removeFromLocalRound(r, this.tourneyService.selectedTeams);
        this.addToLocalRound(r, this.tourneyService.selectedTeams);

        this.prepareDefaultClassification(r);
    } 

    private loadLocalRounds(): any {
        if(this.localRounds == undefined ) {
            for(let r of this.selectedTourney.rounds) {
                this.localRounds.push(r);
            }
        }

        this.removeFromLocalRounds();
        this.addToLocalRounds();

        this.alignRoundTeams();
    }

    private removeFromLocalRounds(){
        for(let i=0; i<this.localRounds.length; i++) {
            let r = this.localRounds[i];
            let found = false;
            for(let sr of this.selectedTourney.rounds) {
                if(r.name == sr.name) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.localRounds.splice(i, 1);
            }
        }
    }

    private addToLocalRounds(): any {
        for(let sr of this.selectedTourney.rounds) {
            let found = false;
            for(let r of this.localRounds) {
                if(r.name==sr.name) {
                    found = true;
                    break;
                }
            } 
            if(!found) {
                this.localRounds.push(sr);
            }
        }
    }

    private alignRoundTeams( ): any {
        for(let i=0; i<this.localRounds.length; i++) {
            let r = this.localRounds[i];
            for(let sr of this.selectedTourney.rounds) {
                if(r.name == sr.name) {
                    this.alignTeams(r, sr.teams);
                    break;
                }
            }
        }
    }
    
    private alignTeams(r: Round, st: Team[]) {
        let ts = this.removeFromLocalRound(r, st);
        ts = this.addToLocalRound(r, st);
    }

    private removeFromLocalRound(r: Round, selTeams: Team[])  {
        let localTeams: Team[] = r.teams;

        for(let i=0; i<localTeams.length; i++) {
            let found = false;
            let t = localTeams[i];
            for(let st of selTeams) {
                if(t.teamName == st.teamName) {
                    found = true;                    
                    break;
                }
            }
            if(!found) {
                localTeams.splice(i, 1);
            }
        }         
    }

    private addToLocalRound(r: Round, selTeams: Team[]): any {
        let localTeams: Team[] = r.teams;

        for(let st of selTeams) {
            let found = false;
            for(let i=0; i<localTeams.length; i++) {
                let t = localTeams[i];
                if(t.teamName == st.teamName) {
                    found = true;                    
                }
            }
            if(!found) {
                localTeams.push(st);
            }
        }
    }
    
    private prepareDefaultClassification(r: Round) {
        if(r.classification.length == 0) {
            for (let t of r.teams) {
                let c: Classification = this.newClassification(t, 0);
                r.classification.push(c);
            }
        }
    }

    /**
     * For each round, adds the correct dummy classifictions, having points=-1, so the total number 
     * of teams will be equal to the next neatest power of 2.
     * 
     * Sorts by firsts classificated teams in each round, then the second in each round, and so on.
     * 
     * Create a full list of each so sorted classificated teams and prepare 2 new lists:
     * an ascendent list starting from the first to the half and a descendent list starting from 
     * the ast team to the half.
     * 
     * So prepare the elemintories list by using the smart put algorithm
     */
    private prepateAutoEliminatories(): any  {
        let eliminatories = this.eliminatoryLevels[0].eliminatories;

        this.paddingRound();

        let bestOfMap: Map<string, Array<Classification>> = new Map<string, Array<Classification>>();
        for(let i=0; i<this.localRounds.length; i++) {
            let r = this.localRounds[i];

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

        for(let i=0; i<ascClassification.length; i++) {

            let c1: Classification = ascClassification[i];
            let c2: Classification = descClassification[i];

            let e: Eliminatory = eliminatories[i];

            let m: Meeting = this.createMeeting(c1.team, c2.team, null, null, Direction.RoundTrip);

            e.round.meetings[0] = m;

            sequenzialEliminatories.push(e);
        }

        let N: number = ascClassification.length;
        let p: number=0;
        for (let step = N; step >= 1; step = step / 2) {

            for (let i = 0; i < N; i += step) {
                if(eliminatories[i].round.meetings.length != 0) {
                    continue;
                }
                let e = sequenzialEliminatories[p];
                eliminatories[i] = e;
                p++;
            }
        }
        console.log("Eliminatories.size=" + eliminatories.length);
    }

    /**
     * Padds each classification round to the next upper power of 2 teams by adding
     * the dummies teams with points = -1
     */
    private paddingRound(): any {

        let maxDeep: number = 0;
        let N: number = 0;

        for(let i=0; i<this.localRounds.length; i++) {
            let r = this.localRounds[i];
            N+=r.classification.length;

            if(r.classification.length > maxDeep ) {
                maxDeep = r.classification.length;
            }
        }

        let diff = this.tourneyService.power2Padding(N) - N;
        if( diff <= 0) {
            return;
        }

        for(let i=0; i<this.localRounds.length; i++) {
            let r = this.localRounds[i];
            while(r.classification.length < maxDeep && diff > 0 ) {
                let t: Team = {id: 0, teamName: ""};
                let dummy = this.newClassification(t, -1);
                r.classification.push(dummy);
                diff--;
            }
        }

        while( diff > 0 ) {
            for(let i=0; i<this.localRounds.length; i++) {
                let r = this.localRounds[i];
                let t: Team = {
                    id: this.tourneyService.getSequenceNumber()
                    ,teamName:""
                };
                let dummy = this.newClassification(t, -1);
                r.classification.push(dummy);
                diff--;
                if(diff==0) {
                    break;
                }
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

        sortedClassification = sortedClassification.sort((t1, t2) =>{
            if(t1.team.teamName > t2.team.teamName) {
                return 1;
            }
            if(t1.team.teamName < t2.team.teamName) {
                return -1;
            }

            return 0;
        });

        return sortedClassification;
    }

    /**
     * Prepares the list view of the desired levels in function of the user selected 
     * number of teams to pass the qualification phase
     * 
     * @param teamsNo the number of teams to allocate on the eliminatory level
     */
    private prepareEliminatoryLevels(teamsNo: number): any {
        console.log("Entering prepareEliminatoryLevels("+teamsNo+")");

        let levelsCombobox =  this.tourneyService.prepareLevelCombobox(teamsNo);

        if(this.eliminatoryLevels.length==0) {
            for(let i=0; i<levelsCombobox.length; i++ ) {
                let lcb = levelsCombobox[i];
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, i);
                this.eliminatoryLevels.push(el);
            }
            this.addOptionaLevel();  
            return;
        }     
        
        let selectedLevel = levelsCombobox[0].value;
        let maxCurrentLevel = this.eliminatoryLevels[0].level;

        if(selectedLevel > maxCurrentLevel) {
            let tempElimList: Array<EliminatoryLevel> = new Array<EliminatoryLevel>();
            
            let i = 0;
            let lcb : Combobox = levelsCombobox[i];
            while( lcb.value > maxCurrentLevel ) {        
                let el: EliminatoryLevel = this.newEliminatoryLevel(lcb, i);
                tempElimList.push(el);
                i++;
                lcb = levelsCombobox[i];
            }

            tempElimList =  tempElimList.concat(this.eliminatoryLevels);
            this.eliminatoryLevels = tempElimList;
        }

        if(selectedLevel < maxCurrentLevel) {
            this.eliminatoryLevels.splice(0, maxCurrentLevel - selectedLevel);
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
                this.addOptionaLevel();            
            }
        }
    }    
            
    private addOptionaLevel() {
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

        let m: Meeting = this.createMeeting(null, null, null, null, Direction.RoundTrip);

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
            tc1: {
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
            tc2: {
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

        return e;
    }

    onRowSelect(event) {
        console.log("Entering onRowSelect()");

        this.tourneyService.teamsCombobox = this.teamsCombobox;
        
        this.selectedTourney.eliminatoryLevels = this.eliminatoryLevels;
        this.tourneyService.selectedEliminatoryLevel = this.selectedEliminatoryLevel;

        this.selectedTourney.eliminatoryMode = this.isManual ? EliminatoryMode.M : EliminatoryMode.A;

        this.router.navigate([LevelListView.redirect]);
    }

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode=EliminatoryMode.M;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        this.eliminatoryMode=EliminatoryMode.A;
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.isManual = false;
        this.tourneyService.availableTeams = [];

        for(let r of this.localRounds) {
            this.prepareDefaultClassification(r);
        }

        this.prepateAutoEliminatories();
    }
 
    onTeamNumChange(event) {
        console.log("Entering onTeamNumChange(): " + this.selectedTeamsNumCombobox);

        let N: number = this.selectedTeamsNumCombobox.value;
        
        this.prepareEliminatoryLevels(N);
    }

    onOriginalClick() {
        console.log("Entering onOriginalClick()");
        this.selectedTourney.teamSortType = TeamSortType.O;
    }

    onAlphabeticalClick() {
        console.log("Entering onAlphabeticalClick()");
        this.selectedTourney.teamSortType = TeamSortType.A;
    }

    onRandomClick() {
        console.log("Entering onRandomClick()");
        this.selectedTourney.teamSortType = TeamSortType.R;
    }
}

