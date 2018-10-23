import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/roundType';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Team } from 'app/tourneyonline/domain/team';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { PhaseType, EliminatoryMode } from 'app/tourneyonline/domain/phase-type';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    static autoRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/dv';
    static manualRedirect: string = '/admineliminatory/levelLv/eliminatoryLv/manualdv';

    msgs: Message[] = [];
    position1: number;
    round1: string;
    playoffName1: string;

    position2: number;
    round2: string;
    playoffName2: string;
   
    selectedEliminatoryLevel: EliminatoryLevel;

    eliminatoryLevel: number;
    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];
    meetings: Meeting[];
    selectedMeeting: Meeting;

    isPlayoff: boolean;
    isStandalone: boolean;
    isModeEnabled: boolean;
    isManual: boolean;

    isOneway: boolean;
    isTopLevel: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(EliminatoryListView.autoRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;

        this.isOneway = this.selectedEliminatoryLevel.isOneway ;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;

        this.prepareLevel();

        this.isStandalone = false;
        
        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            !this.containsPhase(PhaseType.P, this.selectedTourney.phases) && 
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = true;
        } else {
             this.isModeEnabled = false;
        }

        if( this.selectedTourney.phases.length == 1 && 
                this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
            this.isManual = false;
            this.processStandalone();
        } else {
            this.isManual = true;
        }

        if(!this.isManual && this.isStandalone) {
            this.prepateAutoEliminatories();
        } else {
            this.prepateManualEliminatories();
        }
    }

    prepateManualEliminatories(): any {
        // throw new Error("Method not implemented.");
    }

    prepareLevel(): any {
        
        if(this.selectedEliminatoryLevel.eliminatories.length == 0) {
            if(this.selectedEliminatoryLevel.level > 0) {
                let pow = Math.pow(2, this.selectedEliminatoryLevel.level);
                for(let i=0; i<pow; i++){
                    let e: Eliminatory = this.newEliminatory();
                    this.selectedEliminatoryLevel.eliminatories.push(e);
                }
            } else {
                let e: Eliminatory = this.newEliminatory();
                this.selectedEliminatoryLevel.eliminatories.push(e);
            }
            this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
        }
    }

    /**
     * Processes the standalone use case, when the tourney is configured as the only Eliminatory type,
     * no rounds and no playoffs
     */
    private processStandalone() {

        let round: Round;
        if(this.selectedTourney.rounds.length==0) {           
            round = {id:this.tourneyService.getSequenceNumber()
                , name:""
                , type: RoundType.E
                , teams: this.selectedTourney.teams
                , meetings:[]
                , classification:[]
                , matrix:[]
            };
            this.selectedTourney.rounds.push(round);
            for(let t of round.teams) {
                let c: Classification = this.newClassification(t, 0)
                round.classification.push(c);
            }
        } else {
            this.alignToNewTeams();
        }
    } 

    /**
     * Verifies if there are new teams added to the tourney and aligns the
     * teams and classifications in the each rounds
     */
    private alignToNewTeams() {
        for (let r of this.selectedTourney.rounds) {
            for (let t of this.selectedTourney.teams) {
                let index: number = r.teams.indexOf(t);
                if (index == -1) {
                    r.teams.push(t);
                    let c: Classification = this.newClassification(t, 0);
                    r.classification.push(c);
                }
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

        this.paddingRound();

        let bestOfMap: Map<string, Array<Classification>> = new Map<string, Array<Classification>>();
        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];

            let orderedClassification: Array<Classification> = this.sortAsc(r.classification);

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

            let sortedClassification: Array<Classification> = this.sortAsc(unsortedClassification);
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

        let N: number = ascClassification.length;

        let sequenzialEliminatories: Array<Eliminatory> = new Array<Eliminatory>();

        for(let i=0; i<ascClassification.length; i++) {

            let c1: Classification = ascClassification[i];
            let c2: Classification = descClassification[i];

            let e: Eliminatory = this.newEliminatory();

            let m: Meeting = this.newMeeting(c1, c2)

            e.round.meetings.push(m);
            if(!this.selectedEliminatoryLevel.isOneway) {
                let m: Meeting = this.newMeeting(c2, c1)
                e.round.meetings.push(m);  
            }

            sequenzialEliminatories.push(e);
        }

        this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
        let p: number=0;
        for (let step = N; step >= 1; step = step / 2) {

            for (let i = 0; i < N; i += step) {
                if(this.eliminatories[i].round.meetings.length != 0) {
                    continue;
                }
                let e = sequenzialEliminatories[p];
                this.eliminatories[i] = e;
                p++;
            }
        }
        console.log("Eliminatories.size=" + this.eliminatories.length);

    }

    private newMeeting(c2: Classification, c1: Classification): Meeting {
        return {
        id: this.tourneyService.getSequenceNumber(),
            name: c2.team.teamName + " - " + c1.team.teamName,
            dateInMillis: this.selectedTourney.dateInMillis,
            date: this.selectedTourney.dateAsString,
            time: this.selectedTourney.timeAsString,
            team1: c2.team,
            team2: c1.team,
            address: this.selectedTourney.address,
            country: this.selectedTourney.country,
            score1: 0,
            score2: 0
        };
    }

    /**
     * Padds each classification round to the next upper power of 2 teams by adding
     * the dummies teams with points = -1
     */
    private paddingRound(): any {

        let maxDeep: number = 0;
        let N: number = 0;

        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];
            N+=r.classification.length;

            if(r.classification.length > maxDeep ) {
                maxDeep = r.classification.length;
            }
        }

        let diff = this.tourneyService.power2Padding(N) - N;
        if( diff <= 0) {
            return;
        }

        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];
            while(r.classification.length < maxDeep && diff > 0 ) {
                let t: Team = {id: 0, teamName: ""};
                let dummy = this.newClassification(t, -1);
                r.classification.push(dummy);
                diff--;
            }
        }

        while( diff > 0 ) {
            for(let i=0; i<this.selectedTourney.rounds.length; i++) {
                let r = this.selectedTourney.rounds[i];
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

    sortAsc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
            if (t1.points > t2.points) {
                return -1;
            }
        
            if (t1.points < t2.points) {
                return 1;
            }
        
            if(t1.team.teamName > t2.team.teamName) {
                return -1;
            }
            if(t1.team.teamName < t2.team.teamName) {
                return 1;
            }

            return 0;
        });

        return sortedClassification;
    }

    sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
            if (t1.points > t2.points) {
                return 1;
            }
        
            if (t1.points < t2.points) {
                return -1;
            }
        
            return 0;
        });

        return sortedClassification;
    }

    private newClassification(t: Team, initialPoints: number): Classification {
        return {
            id: this.tourneyService.getSequenceNumber(),
            team: t,
            points: initialPoints,
            played: 0,
            won: 0,
            lost: 0,
            penalty: 0,
            goalsDone: 0,
            goalsConceded: 0,
            goalsDiff: 0
        };
    }
 
    private newEliminatory(): Eliminatory {

        let meetings = new Array<Meeting>();
        let m = {id:this.tourneyService.getSequenceNumber()                    
            ,name: ""
            ,dateInMillis:this.selectedTourney.dateInMillis
            ,date: this.selectedTourney.dateAsString
            ,time: this.selectedTourney.timeAsString
            ,address: this.selectedTourney.address
            ,country: this.selectedTourney.country
            ,team1: {}
            ,team2: {}
        };
        meetings.push(m);

        if(!this.isOneway) {
            m = {id:this.tourneyService.getSequenceNumber()                    
                ,name: ""
                ,dateInMillis:this.selectedTourney.dateInMillis
                ,date: this.selectedTourney.dateAsString
                ,time: this.selectedTourney.timeAsString
                ,address: this.selectedTourney.address
                ,country: this.selectedTourney.country
                ,team1: {}
                ,team2: {}
            };
            meetings.push(m);
        }

        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.E
                , isOneway: this.isOneway
                , teams:[
                     {id:0, teamName:""}
                    ,{id:1, teamName:""}
                ]
                ,classification: []
                ,meetings: meetings
                ,matrix: []
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

    onAutoEliminatoryRowSelect(event) {
        console.log("Entering onAutoEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryListView.autoRedirect]);
    }

    onManualEliminatoryRowSelect(event) {
        console.log("Entering onManualEliminatoryRowSelect()");

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
        this.router.navigate([EliminatoryListView.manualRedirect]);
    }

}

