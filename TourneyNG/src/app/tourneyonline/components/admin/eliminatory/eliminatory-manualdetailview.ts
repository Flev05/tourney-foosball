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

            'position1':  new FormControl(this.selectedEliminatory.rule1.fromRound.position),
            'round1':  new FormControl(this.selectedEliminatory.rule1.fromRound.round),
            'playoff1':  new FormControl(this.selectedEliminatory.rule1.fromPlayoff.round),

            'position2':  new FormControl(this.selectedEliminatory.rule2.fromRound.position),            
            'round2':  new FormControl(this.selectedEliminatory.rule2.fromRound.round),
            'playoff2':  new FormControl(this.selectedEliminatory.rule2.fromPlayoff.round),            
        });
    }
    
    onSubmit(value: string) {

        let m1 = this.selectedEliminatory.round.meetings[0];

        m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        m1.address = this.eliminatoryFormGroup.get('address1').value;
        m1.country = this.eliminatoryFormGroup.get('country1').value;

        this.tourneyService.updateMeeting(m1);

        this.selectedEliminatory.rule1.fromRound.position = this.eliminatoryFormGroup.get('position1').value;
        this.selectedEliminatory.rule1.fromRound.round = this.eliminatoryFormGroup.get('round1').value;
        this.selectedEliminatory.rule1.fromPlayoff.round = this.eliminatoryFormGroup.get('playoff1').value;

        this.selectedEliminatory.rule2.fromRound.position = this.eliminatoryFormGroup.get('position2').value;
        this.selectedEliminatory.rule2.fromRound.round = this.eliminatoryFormGroup.get('round2').value;
        this.selectedEliminatory.rule2.fromPlayoff.round = this.eliminatoryFormGroup.get('playoff2').value;

        if(!this.isOneway) {
            let m2 = this.selectedEliminatory.round.meetings[1];
            m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            m2.address = this.eliminatoryFormGroup.get('address2').value;
            m2.country = this.eliminatoryFormGroup.get('country2').value;
                                            
            m2.name = m2.team2.teamName + " - " + m2.team1.teamName;
            this.tourneyService.updateMeeting(m2);
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
