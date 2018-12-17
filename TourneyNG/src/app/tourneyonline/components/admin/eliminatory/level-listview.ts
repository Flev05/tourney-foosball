import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { RoundType, EliminatoryMode, Direction, TeamSortType } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';
import { AbstractEliminatoryListView } from '../../common/abstract-eliminatory-listview';

@Component({
    templateUrl: './level-listview.html'
})
export class LevelListView extends AbstractEliminatoryListView {
    static autoRedirect: string = '/admineliminatory/levelLv/eliminatoryAutoLv';
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryManualLv';

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(LevelListView.autoRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.loadMeetings();
    }

    private loadMeetings(): any {

        if(this.eliminatoryLevels.length == 0) {
            this.processEliminationTree();
            return;
        }

        this.loadEliminatoryMeetings();
    }

    processEliminationTree(): void {

        this.prepareEliminationTree(this.selectedTeamsNumCombobox.value);

        if (this.isStandalone) {
            this.processStandalone();
        }
        else if (this.isAutomatic) {
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

        tmpTeams.sort((t1, t2) =>{
            let rand = Math.random();
            if(rand < 0.5) {
                return 1;
            }
            return -1;
        });

        for(let i=tmpTeams.length; i < power2; i++ ) {
            let t: Team = this.newDummyTeam();
            tmpTeams.push(t);
        }

        return tmpTeams;
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
    private processAutomaticEliminatories(selectedTeamsNo: number) {
        
        let roundsNo = this.selectedTourney.rounds.length;
        if(roundsNo == 0) {
            return;
        }

        let cblist:Array<Combobox> = new Array<Combobox>();
 
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
            cblist.push(cb);
        }

        const topLevel = this.eliminatoryLevels[0];
        let topLevelEliminatories = topLevel.eliminatories;
        let lastIndex = power2; 
        
        for(let i=0; i<topLevelEliminatories.length; i++) {

            let e: Eliminatory = topLevelEliminatories[i];

            let cb = cblist[i];
            e.rule1.fromRound.id = this.tourneyService.getSequenceNumber();
            let label = cb.value == 0 ? "" : cb.value  + "°";
            e.rule1.fromRound.position = {label:"" + label, value: cb.value};
            e.rule1.fromRound.round = {label:cb.label, value: cb.value};

            let desccb = cblist[--lastIndex];
            e.rule2.fromRound.id = this.tourneyService.getSequenceNumber();
            label = desccb.value == 0 ? "" : desccb.value  + "°";
            e.rule2.fromRound.position = {label:"" + label, value: desccb.value};
            e.rule2.fromRound.round = {label:desccb.label, value: desccb.value};
        }
    }
    
    // private prepareDefaultClassification(r: Round) {
    //     r.classification = [];
    //     for (let t of r.teams) {
    //         let c: Classification = this.newClassification(t, 0);
    //         r.classification.push(c);
    //     }
    // }

    // private prepateAutoEliminatories(rounds : Round[]): void  {
        
    //     for(let r of rounds) {
    //         this.prepareDefaultClassification(r);
    //     }

    //     this.paddingRounds(rounds);

    //     let bestOfMap: Map<string, Array<Classification>> = new Map<string, Array<Classification>>();
    //     for(let i=0; i<rounds.length; i++) {
    //         let r = rounds[i];

    //         let orderedClassification: Array<Classification> = this.teamSort(r.classification);

    //         for(let j=0; j < orderedClassification.length; j++) {
    //             let c: Classification = orderedClassification[j];
    //             let key = "" + (j + 1);
    //             if(!bestOfMap.has(key)) {
    //                 let list: Array<Classification> = new Array<Classification>();
    //                 bestOfMap.set(key, list);
    //             }

    //             let list: Array<Classification> = bestOfMap.get(key);

    //             list.push(c);
    //         }
    //     }

    //     let allSortedClassification: Array<Classification> = new Array<Classification>();
    //     for(let key of bestOfMap.keys()) {
            
    //         let unsortedClassification: Array<Classification> = bestOfMap.get(key);

    //         let sortedClassification: Array<Classification> = this.teamSort(unsortedClassification);
    //         bestOfMap.set(key, sortedClassification);

    //         allSortedClassification = allSortedClassification.concat(sortedClassification);
    //     }

    //     let ascClassification: Array<Classification> = new Array<Classification>();
    //     for(let i=0; i<allSortedClassification.length/2; i++) {
    //         let c: Classification = allSortedClassification[i];
    //         ascClassification.push(c);
    //     }
    //     let descClassification: Array<Classification> = new Array<Classification>();
    //     for(let i=allSortedClassification.length-1; i>=allSortedClassification.length/2; i--) {
    //         let c: Classification = allSortedClassification[i];
    //         descClassification.push(c);
    //     }

    //     let sequenzialEliminatories: Array<Eliminatory> = new Array<Eliminatory>();

    //     const topLevel = this.eliminatoryLevels[0];
    //     let topLevelEliminatories = topLevel.eliminatories;
    //     for(let i=0; i<ascClassification.length; i++) {

    //         let c1: Classification = ascClassification[i];
    //         let c2: Classification = descClassification[i];

    //         let e: Eliminatory = topLevelEliminatories[i];

    //         let m = e.round.meetings[0];
    //         m.team1 = c1.team;
    //         m.team2 = c2.team;
            
    //         this.tourneyService.updateMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);

    //         sequenzialEliminatories.push(e);
    //     }

    //     let N: number = ascClassification.length;
    //     let p: number=0;
    //     for (let step = N; step >= 1; step = step / 2) {

    //         for (let i = 0; i < N; i += step) {
    //             if(topLevelEliminatories[i].round.meetings.length != 0) {
    //                 continue;
    //             }
    //             let e = sequenzialEliminatories[p];
    //             topLevelEliminatories[i] = e;
    //             p++;
    //         }
    //     }
    //     console.log("Eliminatories.size=" + topLevelEliminatories.length);
    // }

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
    // private paddingRounds(rounds : Round[]): any {

    //     let maxDeep: number = 0;

    //     for(let i=0; i<rounds.length; i++) {
    //         let r = rounds[i];

    //         if(r.classification.length > maxDeep ) {
    //             maxDeep = r.classification.length;
    //         }
    //     }

    //     let power2 = this.tourneyService.power2Padding(maxDeep);

    //     for(let i=0; i<rounds.length; i++) {
    //         let r = rounds[i];
    //         for(let i=r.classification.length; i < power2; i++ ) {
    //             let t: Team = {id: this.tourneyService.getSequenceNumber(), teamName: ""};
    //             let dummy = this.newClassification(t, -1);
    //             r.classification.push(dummy);
    //         }
    //     }
    // }

    /**
     * Team ordering, first sort the teams on the points basis so the dummy team having points=-1
     * will be the last in the team list. Next, order the team list in function of team sort type 
     * chosen by the user
     * 
     * @param unsortedClassification the unsorted team list
     */
    // private teamSort(unsortedClassification: Array<Classification> ): Array<Classification>  {
    //     var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
    //         if (t1.points > t2.points) {
    //             return -1;
    //         }
        
    //         if (t1.points < t2.points) {
    //             return 1;
    //         }
        
    //         return 0;
    //     });

    //     if( this.selectedTourney.teamSortType==TeamSortType.O) {
    //         return sortedClassification;
    //     }
    //     if( this.selectedTourney.teamSortType==TeamSortType.R) {
    //         sortedClassification = sortedClassification.sort((t1, t2) =>{
    //             let rand = Math.random();
    //             if(rand < 0.33) {
    //                 return 0;
    //             }
    //             if(rand > 0.66) {
    //                 return 1;
    //             }
    //             return -1;
    //         });
    //         return sortedClassification;
    //     }

    //     sortedClassification = sortedClassification.sort((c1, c2) =>{
    //         if(c1.team.teamName > c2.team.teamName) {
    //             return 1;
    //         }
    //         if(c1.team.teamName < c2.team.teamName) {
    //             return -1;
    //         }

    //         return 0;
    //     });

    //     return sortedClassification;
    // }
  
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
                , teams:[
                     {id:0, teamName:""}
                    ,{id:1, teamName:""}
                ]
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
            this.processAutomaticEliminatories(N);
        }

        this.selectedTourney.selectedTeamsNumCombobox = this.selectedTeamsNumCombobox;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    }
}

