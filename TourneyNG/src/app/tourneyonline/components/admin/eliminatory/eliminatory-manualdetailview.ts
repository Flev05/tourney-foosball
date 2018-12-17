import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Message } from 'app/components/common/api';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';

@Component({
    templateUrl: './eliminatory-manualdetailview.html',
})
export class ManualEliminatoryDetailView extends AbstractDetailView {
    
    msgs: Message[] = [];

    eliminatoryFormGroup: FormGroup;

    selectedEliminatoryLevel: EliminatoryLevel;

    fullAddress1: string;
    fullAddress2: string;
    meetingName: string;

    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];

    selectedEliminatory: Eliminatory;

    eliminatories: Eliminatory[];  

    private isOneway: boolean;
    isPlayoff: boolean;
    isTopLevel: boolean;
    isStandalone: boolean;
    availableTeams: Combobox[];
    isDoubleSelection: boolean;

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
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.playoffs = this.tourneyService.playoffsCombobox;
        this.isStandalone = this.tourneyService.isStandalone;

        let m1: Meeting = this.selectedEliminatory.round.meetings[0];
        m1.datetime = new Date(m1.datetime);
        if(m1.country!=undefined) {
            this.fullAddress1 = m1.address + " - " 
                + m1.country.zipCode + " " + m1.country.city
                + " (" + m1.country.provinceCode +")";
        }
 
        let m2: Meeting = m1;
        if(!this.isOneway) {
            m2 = this.selectedEliminatory.round.meetings[1];
            m2.datetime = new Date(m2.datetime);
            if(m2.country!=undefined) {
                this.fullAddress2 = m2.address + " - " 
                    + m2.country.zipCode + " " + m2.country.city
                    + " (" + m2.country.provinceCode +")";
            }
            if(m2.datetime.getTime() < m1.datetime.getTime()) {
                m2.datetime = m1.datetime;
            }
        }

        let team1CB = {label:"", value: 0};
        let team2CB = {label:"", value: 0};
        if(this.isStandalone) {
            this.availableTeams = [{label:"", value: 0}];
            
            for(let t of this.tourneyService.selectedTeams) {
                let cb = {label: t.teamName, value: t.id};
                this.availableTeams.push(cb);
            }
    
            team1CB = {label:m1.team1.teamName, value: m1.team1.id};
            team2CB = {label:m1.team2.teamName, value: m1.team2.id};
        }

        this.isDoubleSelection = false;

        let p1 = this.selectedEliminatory.rule1.fromRound.position.value > 0 ?
            this.selectedEliminatory.rule1.fromRound.position : this.selectedEliminatory.rule1.fromPlayoff.position;

        let p2 = this.selectedEliminatory.rule2.fromRound.position.value > 0 ?
            this.selectedEliminatory.rule2.fromRound.position : this.selectedEliminatory.rule2.fromPlayoff.position;

        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1':  new FormControl(m1.datetime),
            'address1':  new FormControl(m1.address),
            'country1':  new FormControl(m1.country),

            'meetingDate2':  new FormControl(m2.datetime),
            'address2':  new FormControl(m2.address),
            'country2':  new FormControl(m2.country),    

            'positions':  new FormControl(this.positions),
            'rounds':  new FormControl(this.rounds),
            'playoffs':  new FormControl(this.playoffs),

            'position1':  new FormControl(p1),
            'round1':  new FormControl(this.selectedEliminatory.rule1.fromRound.round),
            'playoff1':  new FormControl(this.selectedEliminatory.rule1.fromPlayoff.round),

            'position2':  new FormControl(p2),            
            'round2':  new FormControl(this.selectedEliminatory.rule2.fromRound.round),
            'playoff2':  new FormControl(this.selectedEliminatory.rule2.fromPlayoff.round),            

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

        let p1: Combobox = this.eliminatoryFormGroup.get('position1').value;
        let p2: Combobox = this.eliminatoryFormGroup.get('position2').value;

        let r1: Combobox  = this.eliminatoryFormGroup.get('round1').value;
        let po1: Combobox = this.eliminatoryFormGroup.get('playoff1').value;
        this.isDoubleSelection = false;
        if(r1.value > 0 && po1.value > 0) {
            this.isDoubleSelection = true;
            return;
        }

        if(r1.value > 0) {
            this.selectedEliminatory.rule1.fromRound.position = p1;
            this.selectedEliminatory.rule1.fromPlayoff.position = {label:"", value: 0};
        } else {
            this.selectedEliminatory.rule1.fromRound.position = {label:"", value: 0};
            this.selectedEliminatory.rule1.fromPlayoff.position = p1;
        }

        this.selectedEliminatory.rule1.fromRound.round   = r1;
        this.selectedEliminatory.rule1.fromPlayoff.round = po1;

        let r2: Combobox  = this.eliminatoryFormGroup.get('round2').value;
        let po2: Combobox = this.eliminatoryFormGroup.get('playoff2').value;
       
        this.isDoubleSelection = false;
        if(r2.value > 0 && po2.value > 0) {
            this.isDoubleSelection = true;
            return;
        }

        if(r2.value > 0) {
            this.selectedEliminatory.rule2.fromRound.position = p2;
            this.selectedEliminatory.rule2.fromPlayoff.position = {label:"", value: 0};
        } else {
            this.selectedEliminatory.rule2.fromRound.position = {label:"", value: 0};
            this.selectedEliminatory.rule2.fromPlayoff.position = p2;
        }
        
        this.selectedEliminatory.rule2.fromRound.round   = r2;
        this.selectedEliminatory.rule2.fromPlayoff.round = po2;

        if(this.isStandalone) {
            let team1CB: Combobox= this.eliminatoryFormGroup.get('team1').value;
            let team2CB: Combobox = this.eliminatoryFormGroup.get('team2').value;
            m1.team1 = this.getTeam(team1CB);
            m1.team2 = this.getTeam(team2CB);

            m1.name = m1.team2.teamName + " - " + m1.team1.teamName;
        }

        this.tourneyService.updateMeetingDb(m1, this.selectedTourney.id, 0, 0, this.selectedEliminatory.id);

        if(!this.isOneway) {
            let m2 = this.selectedEliminatory.round.meetings[1];
            m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            m2.address = this.eliminatoryFormGroup.get('address2').value;
            m2.country = this.eliminatoryFormGroup.get('country2').value;

            this.tourneyService.updateMeetingDb(m2, this.selectedTourney.id, 0, 0, this.selectedEliminatory.id);
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    doubleSelection() {
        return this.isDoubleSelection;
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
