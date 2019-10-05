import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Message } from 'app/components/common/api';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { CountryService } from 'app/tourneyonline/service/country-service';

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

    isOneway: boolean;
    isPlayoff: boolean;
    isTopLevel: boolean;
    isStandalone: boolean;
    availableTeams: Combobox[];
    isDoubleSelection: boolean;

    m1: Meeting ;
    m2: Meeting ;
    position1: Combobox;
    position2: Combobox;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService,
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("EliminatoryDetailView.ngOnInit() ");

        super.ngOnInit();

        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;

        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.isOneway = this.selectedEliminatoryLevel.direction == Direction.OneWay;
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;

        this.playoffs = this.tourneyService.playoffsCombobox;
        this.isStandalone = this.tourneyService.isStandalone;

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];
        this.m1.datetime = new Date(this.m1.datetime);
        if(this.m1.country!=undefined) {
            this.fullAddress1 = this.m1.address + " - " 
                + this.m1.country.zipCode + " " + this.m1.country.city
                + " (" + this.m1.country.provinceCode +")";
        }
 
        this.m2 = this.m1;
        if(!this.isOneway) {
            this.m2 = this.selectedEliminatory.round.roundtripMeetings[0];
            this.m2.datetime = new Date(this.m2.datetime);
            if(this.m2.country!=undefined) {
                this.fullAddress2 = this.m2.address + " - " 
                    + this.m2.country.zipCode + " " + this.m2.country.city
                    + " (" + this.m2.country.provinceCode +")";
            }
            if(this.m2.datetime.getTime() < this.m1.datetime.getTime()) {
                this.m2.datetime = this.m1.datetime;
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
    
            team1CB = {label:this.m1.team1.teamName, value: this.m1.team1.id};
            team2CB = {label:this.m1.team2.teamName, value: this.m1.team2.id};
        }

        this.isDoubleSelection = false;

        this.position1 = this.selectedEliminatory.rule1.fromRound.position.value > 0 ?
            this.selectedEliminatory.rule1.fromRound.position : this.selectedEliminatory.rule1.fromPlayoff.position;

        this.position2 = this.selectedEliminatory.rule2.fromRound.position.value > 0 ?
            this.selectedEliminatory.rule2.fromRound.position : this.selectedEliminatory.rule2.fromPlayoff.position;


        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1':  new FormControl(this.m1.datetime),
            'address1':  new FormControl(this.m1.address),
            'country1':  new FormControl(this.m1.country),

            'meetingDate2':  new FormControl(this.m2.datetime),
            'address2':  new FormControl(this.m2.address),
            'country2':  new FormControl(this.m2.country),    

            'positions':  new FormControl(this.positions),
            'rounds':  new FormControl(this.rounds),
            'playoffs':  new FormControl(this.playoffs),

            'position1':  new FormControl(this.position1),
            'round1':  new FormControl(this.selectedEliminatory.rule1.fromRound.round),
            'playoff1':  new FormControl(this.selectedEliminatory.rule1.fromPlayoff.round),

            'position2':  new FormControl(this.position2),            
            'round2':  new FormControl(this.selectedEliminatory.rule2.fromRound.round),
            'playoff2':  new FormControl(this.selectedEliminatory.rule2.fromPlayoff.round),            

            'availableTeams': new FormControl(this.availableTeams),    

            'team1': new FormControl(team1CB),    
            'team2': new FormControl(team2CB),    
        });
    }
    
    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    done(): void {
        if(this.save()) {
            super.goBack();
        }
    }

    private save() : boolean {

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];

        this.m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        this.m1.address = this.eliminatoryFormGroup.get('address1').value;
        this.m1.country = this.eliminatoryFormGroup.get('country1').value;

        let p1: Combobox = this.eliminatoryFormGroup.get('position1').value;
        let p2: Combobox = this.eliminatoryFormGroup.get('position2').value;

        let r1: Combobox  = this.eliminatoryFormGroup.get('round1').value;
        let po1: Combobox = this.eliminatoryFormGroup.get('playoff1').value;
        this.isDoubleSelection = false;
        if(this.isPlayoff && r1.value > 0 && po1.value > 0) {
            this.isDoubleSelection = true;
            return false;
        }

        this.selectedEliminatory.rule1.fromRound.position = p1;
        this.selectedEliminatory.rule1.fromRound.round   = r1;
        this.selectedEliminatory.rule1.fromPlayoff.round = po1;

        let r2: Combobox  = this.eliminatoryFormGroup.get('round2').value;
        let po2: Combobox = this.eliminatoryFormGroup.get('playoff2').value;
       
        this.isDoubleSelection = false;
        if(this.isPlayoff && r2.value > 0 && po2.value > 0) {
            this.isDoubleSelection = true;
            return false;
        }
        
        this.selectedEliminatory.rule2.fromRound.position = p2;
        this.selectedEliminatory.rule2.fromRound.round   = r2;
        this.selectedEliminatory.rule2.fromPlayoff.round = po2;

        if(this.isStandalone) {
            let team1CB: Combobox= this.eliminatoryFormGroup.get('team1').value;
            let team2CB: Combobox = this.eliminatoryFormGroup.get('team2').value;
            this.m1.team1 = this.getTeam(team1CB);
            this.m1.team2 = this.getTeam(team2CB);

            this.m1.name = this.m1.team2.teamName + " - " + this.m1.team1.teamName;
        }

        let observer = this.meetingService.saveEliminatoryMeetingDb(this.m1, this.selectedTourney.id, this.selectedEliminatory.id);
        observer.subscribe( n => this.saveMeetingNext(n, this.m1));

        if(!this.isOneway) {
            this.m2 = this.selectedEliminatory.round.roundtripMeetings[0];
            this.m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            if(this.m2.datetime < this.m1.datetime) {
                this.m2.datetime = this.m1.datetime;
            }
            this.m2.address = this.eliminatoryFormGroup.get('address2').value;
            this.m2.country = this.eliminatoryFormGroup.get('country2').value;

            let observer = this.meetingService.saveEliminatoryMeetingDb(this.m2, this.selectedTourney.id, this.selectedEliminatory.id);
            observer.subscribe( n => this.saveMeetingNext(n, this.m2));    
        }

        return true;
    }

    private saveMeetingNext(n:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(n);
        m.id = n.id;
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
