import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Player } from '../../../domain/player';
import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { DoubleCombobox } from 'app/tourneyonline/domain/double-combobox';
import { EliminatoryMode } from 'app/tourneyonline/domain/phase-type';
import { Team } from 'app/tourneyonline/domain/team';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';


@Component({
    templateUrl: './eliminatory-autodetailview.html',
})
export class AutoEliminatoryDetailView extends AbstractDetailView {
    selectedMeeting: Meeting;

    msgs: Message[] = [];

    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    fullAddress: string;
    meetingName: string;

    // combobox1Row: Combobox;
    // combobox2Row: Combobox;

    // unluckyTeams: DoubleCombobox[];
    // unluckyTeamRow: Combobox;

    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];

    // availableTeams: Combobox[];
    // selectedUnluckyTeam: DoubleCombobox;

    selectedEliminatory: Eliminatory;

    eliminatoryMode: EliminatoryMode;
    eliminatories: Eliminatory[];  

    availableTeams: Team[] = [];
    targetTeams: Team[] = [];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("EliminatoryDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;
        this.availableTeams = this.tourneyService.availableTeams;
        this.playoffs = this.tourneyService.playoffsCombobox;

        this.meetingName = this.selectedMeeting.name;

        this.targetTeams.push(this.selectedMeeting.team1);
        this.targetTeams.push(this.selectedMeeting.team2);

        if(this.selectedMeeting.country!=undefined) {
            this.fullAddress = this.selectedMeeting.address + " - " 
                + this.selectedMeeting.country.zipCode + " " + this.selectedMeeting.country.city
                + " (" + this.selectedMeeting.country.provinceCode +")";
        }

        // this.combobox1Row = {label: this.selectedMeeting.team1.teamName, value: this.selectedMeeting.team1.id};
        // let index=this.availableTeams.indexOf(this.combobox1Row);
        // if(index==-1) {
        //     this.availableTeams.push(this.combobox1Row);
        // }
        // this.combobox2Row = {label: this.selectedMeeting.team2.teamName, value: this.selectedMeeting.team2.id};
        // index=this.availableTeams.indexOf(this.combobox2Row);
        // if(index==-1) {
        //     this.availableTeams.push(this.combobox2Row);
        // }
        
        this.meetingFormGroup = this.fb.group({
            // 'combobox1Row': new FormControl(this.combobox1Row),
            // 'combobox2Row': new FormControl(this.combobox2Row),

            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),

            'address':  new FormControl(this.selectedMeeting.address ),
            'country':  new FormControl(this.selectedMeeting.country),
        });
    }
    
    // unluckyTeamDone() {
    //     if(this.combobox1Row.value == 0) {
    //         this.availableTeams.push(this.selectedUnluckyTeam.cb1);
    //     }        
    //     if(this.combobox2Row.value == 0) {
    //         this.availableTeams.push(this.selectedUnluckyTeam.cb2);
    //     }
    //     if(this.combobox1Row.value == 0 && this.combobox2Row.value == 0) {
    //         let index: number = this.unluckyTeams.indexOf(this.selectedUnluckyTeam);
    //         if(index > -1) {
    //             this.unluckyTeams.splice(index, 1);
    //         }
    //     }

    //     if(this.combobox1Row.value != 0 && this.combobox2Row.value != 0) {
    //         this.selectedUnluckyTeam.cb1.label = this.combobox1Row.label;
    //         this.selectedUnluckyTeam.cb1.value = this.combobox1Row.value;

    //         this.selectedUnluckyTeam.cb2.label = this.combobox2Row.label;
    //         this.selectedUnluckyTeam.cb2.value = this.combobox2Row.value;
    //         let index: number = this.availableTeams.indexOf(this.combobox1Row);
    //         if(index > -1) {
    //             this.availableTeams.splice(index, 1);
    //         }
    //         index = this.availableTeams.indexOf(this.combobox2Row);
    //         if(index > -1) {
    //             this.availableTeams.splice(index, 1);
    //         }
    //     }

    //     this.combobox1Row = null;
    //     this.combobox2Row = null;
    // }

    // onCombobox1Change(event) {
    //     console.log(event);
    //     let cc: Combobox = this.meetingFormGroup.get('combobox1Row').value;
        // if(cc.value == 0) {
        //     this.availableTeams.push(this.combobox1Row);
        // }
        // this.combobox1Row = cc;

        // let index: number = this.availableTeams.indexOf(this.combobox1Row);
        // if(index > 0) {
        //     this.availableTeams.splice(index, 1);
        // }
        // this.combobox2Row = {label: this.selectedMeeting.team2.teamName, value: this.selectedMeeting.team2.id};
    // }
    // onCombobox2Change(event) {
    //     console.log(event);
    //     let cc: Combobox = this.meetingFormGroup.get('combobox2Row').value;
    //     if(cc.value == 0) {
    //         this.availableTeams.push(this.combobox2Row);
    //     }
    //     this.combobox2Row = cc;

    //     let index: number = this.availableTeams.indexOf(this.combobox2Row);
    //     if(index > 0) {
    //         this.availableTeams.splice(index, 1);
    //     }
    // }

    onSubmit(value: string) {

        // this.combobox1Row = this.meetingFormGroup.get('combobox1Row').value;
        // this.selectedMeeting.team1.teamName = this.combobox1Row.label;
        // this.selectedMeeting.team1.id = this.combobox1Row.value;

        // this.combobox2Row = this.meetingFormGroup.get('combobox2Row').value;
        // this.selectedMeeting.team2.teamName = this.combobox1Row.label;
        // this.selectedMeeting.team2.id = this.combobox1Row.value;

        // this.selectedMeeting.team1.teamName = "";
        // this.selectedMeeting.team1.id = 0;
        // this.selectedMeeting.team2.teamName = "";
        // this.selectedMeeting.team2.id = 0;
        // this.selectedMeeting.name = "";

        let teams: Team[] = this.meetingFormGroup.get('targetTeams').value;
        if(teams.length == 1) {
            this.selectedMeeting.team1.teamName = teams[0].teamName;
            this.selectedMeeting.team1.id = teams[0].id;
            this.selectedMeeting.name = this.selectedMeeting.team1.teamName + " - ";
        }
        if(teams.length == 2) {
            this.selectedMeeting.team2.teamName = teams[1].teamName;
            this.selectedMeeting.team2.id = teams[1].id;
            this.selectedMeeting.name = this.selectedMeeting.team1.teamName + " - " + this.selectedMeeting.team2.teamName;
        }

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    // standaloneSave() {      
    //     this.eliminatories = [];
    //     for(let dcb of this.unluckyTeams) {

    //         let e = this.newEliminatory();
    //         e.round.teams[0].teamName = dcb.cb1.label;
    //         e.round.teams[0].id = dcb.cb1.value;
    //         e.round.teams[1].teamName = dcb.cb2.label;
    //         e.round.teams[1].id = dcb.cb2.value;
            
    //         this.eliminatories.push(e);
    //     }
        
    //     this.selectedTourney.eliminatoryMode = this.eliminatoryMode;
    //     this.selectedTourney.eliminatories = this.eliminatories;
    //     this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack() );
    // }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
