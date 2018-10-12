import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import {Message} from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { RoundType } from 'app/tourneyonline/domain/roundType';
import { DoubleCombobox } from 'app/tourneyonline/domain/double-combobox';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Team } from 'app/tourneyonline/domain/team';
import { Round } from 'app/tourneyonline/domain/round';

@Component({
    templateUrl: './eliminatory-listview.html'
})
export class EliminatoryListView extends AbstractListView {
    msgs: Message[] = [];
    position1: number;
    round1: string;
    playoffName1: string;

    position2: number;
    round2: string;
    playoffName2: string;
   
    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];
    teams: Combobox[];

    levels: Combobox[];
    eliminatoryLevel: number;
    eliminatoryMode: string;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    row: Eliminatory;  
    displayDialogConfig: boolean;
    isPlayoff: boolean;
    isStandalone: boolean;
    isManual: boolean;

    combobox1Row: Combobox;
    combobox2Row: Combobox;

    availableTeams: Combobox[];

    // luckyTeamDisplayDialog: boolean;
    // luckyTeams: Combobox[];
    // selectedLuckyTeam: Combobox;
    // luckyTeamRow: Combobox;

    unluckyDisplayDialog: boolean;
    unluckyTeams: DoubleCombobox[];
    selectedUnluckyTeam: DoubleCombobox;
    unluckyTeamRow: Combobox;
    unluckyTeamDisplayDialog: boolean;

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super("", tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.updateRowGroupMetaData();
    }

    protected updateRowGroupMetaData() {
        this.tourneyService.prepareEliminatoriesComboBoxes();

        this.levels = this.tourneyService.levelsCombobox;
        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;
        this.teams = this.tourneyService.teamsCombobox;
        this.playoffs = this.tourneyService.playoffsCombobox;

        this.eliminatories = this.selectedTourney.eliminatories;
        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;

        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode=="manual" ? true : false;
        
        if( this.selectedTourney.phases.length == 1 && 
                this.containsPhase("eliminatory", this.selectedTourney.phases)) {
            this.processStandalone();
        }

        if(this.containsPhase("round", this.selectedTourney.phases)
                && this.containsPhase("eliminatory", this.selectedTourney.phases)
                && !this.containsPhase("playoff", this.selectedTourney.phases)) 
        {
            this.isStandalone = false;
            this.prepateEliminatories();
        }
    }

    /**
     * Processes the standalone use case, when the tourney is configured as the only Eliminatory type,
     * no round and no playoff
     */
    private processStandalone() {
        this.isStandalone = true;
        // this.luckyTeamRow = null;

        let round: Round;
        if(this.selectedTourney.rounds.length==0) {           
            round = {id:this.tourneyService.getSequenceNumber()
                , name:""
                , type: RoundType.E
                , isRoundTrip:false
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
            round = this.selectedTourney.rounds[0];
            for(let t of this.selectedTourney.teams) {
                let index: number = round.teams.indexOf(t);
                if(index > -1) {
                    round.teams.push(t);
                    let c: Classification = this.newClassification(t, 0)
                    round.classification.push(c);
                }
            }
        }

        let pow2 = this.tourneyService.power2Padding(round.teams.length);
        for(let r=round.teams.length; r<pow2; r++) {
            let t: Team = {
                id: this.tourneyService.getSequenceNumber()
                ,teamName:""
            };
            let c: Classification = this.newClassification(t, -1)
            round.classification.push(c);
        }
        round.classification = this.sortAsc(round.classification);

        let ascTeams :Array<Team> = new Array<Team>();
        for(let i=0; i<round.classification.length/2; i++) {
            let c = round.classification[i];
            ascTeams.push(c.team);
        }
        let descTeams :Array<Team> = new Array<Team>();
        for(let i=round.classification.length-1; i>=round.classification.length/2; i--) {
            let c = round.classification[i];
            descTeams.push(c.team);
        }

        let elims: Array<Eliminatory> = new Array<Eliminatory>();
        for(let i=0; i<ascTeams.length; i++) {
            let t1 = ascTeams[i];
            
            let e = this.newEliminatory();
            e.round.teams[0] = t1;

            let t2 = descTeams[i];
            e.round.teams[1] = t2;

            elims.push(e);
        }
        this.eliminatories = elims;
    } 

    sortAsc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
            if (t1.points > t2.points) {
                return 1;
            }
        
            if (t1.points < t2.points) {
                return -1;
            }
        
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

    sortDesc(unsortedClassification: Array<Classification> ): Array<Classification>  {
        var sortedClassification: Array<Classification>  = unsortedClassification.sort((t1, t2) => {
            if (t1.points > t2.points) {
                return -1;
            }
        
            if (t1.points < t2.points) {
                return 1;
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
     * 
     */
    private prepateEliminatories(): any  {

        this.paddingRound();

        let bestOfMap: Map<string, Array<Classification>> = new Map<string, Array<Classification>>();
        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];

            let orderedClassification: Array<Classification> = this.sortAsc(r.classification);

            for(let j=0; j < orderedClassification.length; j++) {
                let c:Classification = orderedClassification[j];
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
            
            let unsortedClassification = bestOfMap.get(key);

            let sortedClassification = this.sortAsc(unsortedClassification);
            bestOfMap.set(key, sortedClassification);

            allSortedClassification.concat(sortedClassification);
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

        let elims = new Array<Eliminatory>(N);

        for(let i=0; i<ascClassification.length; i++) {

            let c1: Classification = ascClassification[i];

            let e = this.newEliminatory();

            let t1: Team = c1.team;
            e.round.teams[0] = t1;

            elims.push(e);
        }

        this.eliminatories = new Array<Eliminatory>(N);
        let p: number=0;
        for (let step = N; step > 0; step = step / 2) {

            for (let i = 0; i < N; i += step) {
                if(this.eliminatories[i].round.teams[0] != null) {
                    continue;
                }
                let e = elims[p];
                this.eliminatories[i] = e;
                p++;
            }
        }

        for(let i=0; i<descClassification.length; i++) {

            let c2: Classification = descClassification[i];
           
            let t2: Team = c2.team;
            
            let e = elims[i];

            e.round.teams[1] = t2;
        }

        p =0;
        for (let step = N; step > 0; step = step / 2) {

            for (let i = 0; i < N; i += step) {
                if(this.eliminatories[i].round.teams[1] != null) {
                    continue;
                }
                let e = elims[p];
                this.eliminatories[i] = e;
                p++;
            }
        }
    }

    /**
     * Padds each classification round to the next upper power of 2 teams by adding
     * the dummies teams with points  = -1
     */
    private paddingRound(): any {

        let maxDeep: number = 0;

        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];
            if(r.classification.length > maxDeep ) {
                maxDeep = r.classification.length;
            }
        }

        let N: number = this.selectedTourney.teams.length;
        let diff = this.tourneyService.power2Padding(N) - N;

        for(let i=0; i<this.selectedTourney.rounds.length; i++) {
            let r = this.selectedTourney.rounds[i];
            while(r.classification.length < maxDeep && diff > 0 ) {
                let t: Team = {
                    id: this.tourneyService.getSequenceNumber()
                    ,teamName:""
                };
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

    onManualClick() {
        console.log("Entering onManualClick()");
        this.eliminatoryMode="manual";
        this.isManual = true;
    }

    onAutoClick() {
        console.log("Entering onAutoClick()");
        this.eliminatoryMode="auto";
        this.isManual = false;
    }

    onChange(event) {
        console.log(event);

        this.eliminatories = [];
        for(let i=0; i<=this.eliminatoryLevel; i++ ) {
            let se = this.newEliminatory();
    
            this.eliminatories.push(se);
        }
    }

    private newEliminatory(): Eliminatory {
        let e: Eliminatory = {
            id: this.tourneyService.getSequenceNumber(),
            enabled: false,
            round:{id: this.tourneyService.getSequenceNumber()
                , name: ""
                , type: RoundType.E
                , isRoundTrip: true
                , teams:[
                     {id:0, teamName:""}
                    ,{id:1, teamName:""}
                ]},
            level: this.tourneyService.levelsCombobox.length,
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

    // onLuckyTeamRowSelect(event) {
    //     this.luckyTeamRow = this.selectedLuckyTeam;
    //     this.luckyTeamDisplayDialog = true;
    // }   
    onUnluckyTeamRowSelect(event) {
        this.combobox1Row = {label: this.selectedUnluckyTeam.cb1.label, value: this.selectedUnluckyTeam.cb1.value};
        this.combobox2Row = null;

        this.unluckyDisplayDialog = true;
    }

    // luckyTeamDone() {
    //     this.luckyTeamDisplayDialog = false;
    //     if(this.luckyTeamRow.value == 0) {
    //         this.availableTeams.push(this.selectedLuckyTeam);
    //         let index: number = this.luckyTeams.indexOf(this.selectedLuckyTeam);
    //         if(index > -1) {
    //             this.luckyTeams.splice(index, 1);
    //         }
    //     } else {
    //         let index: number = this.availableTeams.indexOf(this.luckyTeamRow);
    //         if(index > -1) {
    //             this.availableTeams.splice(index, 1);
    //         }
    
    //         index  = this.luckyTeams.indexOf(this.selectedLuckyTeam);
    //         if(index > -1) {
    //             this.luckyTeams[index] = this.luckyTeamRow;
    //         }
    //     }
        
    //     this.luckyTeamRow = null;
    // }

    unluckyTeamDone() {
        if(this.combobox1Row.value == 0) {
            this.availableTeams.push(this.selectedUnluckyTeam.cb1);
        }        
        if(this.combobox2Row.value == 0) {
            this.availableTeams.push(this.selectedUnluckyTeam.cb2);
        }
        if(this.combobox1Row.value == 0 && this.combobox2Row.value == 0) {
            let index: number = this.unluckyTeams.indexOf(this.selectedUnluckyTeam);
            if(index > -1) {
                this.unluckyTeams.splice(index, 1);
            }
        }

        if(this.combobox1Row.value != 0 && this.combobox2Row.value != 0) {
            this.selectedUnluckyTeam.cb1.label = this.combobox1Row.label;
            this.selectedUnluckyTeam.cb1.value = this.combobox1Row.value;

            this.selectedUnluckyTeam.cb2.label = this.combobox2Row.label;
            this.selectedUnluckyTeam.cb2.value = this.combobox2Row.value;
            let index: number = this.availableTeams.indexOf(this.combobox1Row);
            if(index > -1) {
                this.availableTeams.splice(index, 1);
            }
            index = this.availableTeams.indexOf(this.combobox2Row);
            if(index > -1) {
                this.availableTeams.splice(index, 1);
            }
        }

        this.combobox1Row = null;
        this.combobox2Row = null;

        this.unluckyDisplayDialog = false;
    }

    onCombobox1Change(event) {
        console.log(event);
        let index: number = this.availableTeams.indexOf(this.combobox1Row);
        if(index > -1) {
            this.availableTeams.splice(index, 1);
        }
        this.combobox2Row = {label: this.selectedUnluckyTeam.cb2.label, value: this.selectedUnluckyTeam.cb2.value};
    }
    onCombobox2Change(event) {
        console.log(event);
        let index: number = this.availableTeams.indexOf(this.combobox2Row);
        if(index > -1) {
            this.availableTeams.splice(index, 1);
        }
    }
    standaloneSave() {      
        this.eliminatories = [];
        // for(let cb of this.luckyTeams) {

        //     let e = this.newEliminatory();
        //     e.round.teams[0].teamName = cb.label;
        //     e.round.teams[0].id = cb.value;
        //     e.round.teams[1].teamName = "";
        //     e.round.teams[1].id = 0;
            
        //     this.eliminatories.push(e);
        // }
        for(let dcb of this.unluckyTeams) {

            let e = this.newEliminatory();
            e.round.teams[0].teamName = dcb.cb1.label;
            e.round.teams[0].id = dcb.cb1.value;
            e.round.teams[1].teamName = dcb.cb2.label;
            e.round.teams[1].id = dcb.cb2.value;
            
            this.eliminatories.push(e);
        }
        
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.selectedTourney.eliminatories = this.eliminatories;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    }

    onRowSelectConfig(event) {
        this.row = this.cloneObject(event.data);
        this.displayDialogConfig = true;
    }

    doneConfig() {
        this.eliminatories[this.eliminatories.indexOf(this.selectedEliminatory)] = this.row;

        this.row = null;
        this.unluckyDisplayDialog = false;
        this.displayDialogConfig = false;
    }

    save() {
        this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
        this.selectedTourney.eliminatories = this.eliminatories;
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica configurazione eliminatory fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}

