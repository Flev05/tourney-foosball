import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryMode } from '../../../domain/enumerations';
import { Team } from 'app/tourneyonline/domain/team';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { TourneyDb } from 'app/tourneyonline/domain/tourney.db';


@Component({
    templateUrl: './eliminatory-autodetailview.html',
})
export class AutoEliminatoryDetailView extends AbstractDetailView {
    
    msgs: Message[] = [];

    eliminatoryFormGroup: FormGroup;
    toggleable: boolean = false;

    fullAddress1: string;
    fullAddress2: string;

    selectedEliminatory: Eliminatory;

    eliminatoryMode: EliminatoryMode;
    eliminatories: Eliminatory[];  

    selectedEliminatoryLevel: EliminatoryLevel;
    isTopLevel: boolean;
    private isOneway: boolean;

    availableTeams: Combobox[];

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
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.isOneway = this.selectedEliminatoryLevel.isOneway;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        let m1: Meeting = this.selectedEliminatory.round.meetings[0];

        if(m1.country!=undefined) {
            this.fullAddress1 = m1.address + " - " 
                + m1.country.zipCode + " " + m1.country.city
                + " (" + m1.country.provinceCode +")";
        }

        let m2: Meeting = m1;
        if(!this.isOneway) {
            m2 = this.selectedEliminatory.round.meetings[1];
            if(m2.country!=undefined) {
                this.fullAddress2 = m2.address + " - " 
                    + m2.country.zipCode + " " + m2.country.city
                    + " (" + m2.country.provinceCode +")";
            }
        }

        this.availableTeams = [{label:"", value: 0}];
        
        for(let t of this.tourneyService.selectedTeams) {
            let cb = {label: t.teamName, value: t.id};
            this.availableTeams.push(cb);
        }

        let team1CB = {label:m1.team1.teamName, value: m1.team1.id};
        let team2CB = {label:m1.team2.teamName, value: m1.team2.id};

        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1': new FormControl(new Date(m1.datetime)),
            'address1': new FormControl(m1.address),
            'country1': new FormControl(m1.country),

            'meetingDate2': new FormControl(new Date(m2.datetime)),
            'address2': new FormControl(m2.address),
            'country2': new FormControl(m2.country),    
            'availableTeams': new FormControl(this.availableTeams),    
            'team1': new FormControl(team1CB),    
            'team2': new FormControl(team2CB),    
        });
    }

    onSubmit(value: string) {

        let m1 = this.selectedEliminatory.round.meetings[0];

        m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        m1.address = this.eliminatoryFormGroup.get('address1').value;
        m1.country = this.eliminatoryFormGroup.get('country1').value;

        let team1CB: Combobox= this.eliminatoryFormGroup.get('team1').value;
        let team2CB: Combobox = this.eliminatoryFormGroup.get('team2').value;
        m1.team1 = this.getTeam(team1CB);
        m1.team2 = this.getTeam(team2CB);

        m1.name = m1.team2.teamName + " - " + m1.team1.teamName;
        this.tourneyService.updateMeeting(m1);

        if(!this.isOneway) {
            let m2 = this.selectedEliminatory.round.meetings[1];
            m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            m2.address = this.eliminatoryFormGroup.get('address2').value;
            m2.country = this.eliminatoryFormGroup.get('country2').value;

            m2.team1 = m1.team2;
            m2.team2 = m1.team1;
    
            m2.name = m2.team1.teamName + " - " + m2.team2.teamName;
            this.tourneyService.updateMeeting(m2);
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private getTeam(teamName: Combobox) : Team {

        for(let t of this.tourneyService.selectedTeams) {
            if(t.teamName == teamName.label) {
                return t;
            }
        }

        let empty: Team = {
            id:0, teamName: ""
        };
        return empty;
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
