import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';

import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { CountryService } from 'app/tourneyonline/service/country-service';

@Component({
    templateUrl: './eliminatory-autodetailview.html',
})
export class AutoEliminatoryDetailView extends AbstractDetailView {
    
    eliminatoryFormGroup: FormGroup;
    toggleable: boolean = false;

    fullAddress1: string;
    fullAddress2: string;

    selectedEliminatory: Eliminatory;

    eliminatories: Eliminatory[];  

    selectedEliminatoryLevel: EliminatoryLevel;
    isTopLevel: boolean;
    isOneway: boolean;

    isStandalone: boolean;
    m1: Meeting;
    m2: Meeting;

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
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];

        this.isStandalone = this.tourneyService.isStandalone;

        if(this.m1.country!=undefined) {
            this.fullAddress1 = this.m1.address + " - " 
                + this.m1.country.zipCode + " " + this.m1.country.city
                + " (" + this.m1.country.provinceCode +")";
        }

        this.m2 = this.m1;
        if(!this.isOneway) {
            this.m2 = this.selectedEliminatory.round.roundtripMeetings[0];
            if(this.m2.country!=undefined) {
                this.fullAddress2 = this.m2.address + " - " 
                    + this.m2.country.zipCode + " " + this.m2.country.city
                    + " (" + this.m2.country.provinceCode +")";
            }
        }

        this.eliminatoryFormGroup = this.fb.group({

            'meetingDate1': new FormControl(new Date(this.m1.datetime)),
            'address1': new FormControl(this.m1.address, Validators.compose([Validators.required])),
            'country1': new FormControl(this.m1.country),

            'meetingDate2': new FormControl(new Date(this.m2.datetime)),
            'address2': new FormControl(this.m2.address, Validators.compose([Validators.required])),
            'country2': new FormControl(this.m2.country),    
        });
    }

    private onLoadAllCountriesComplete(): void {
        this.countries = this.countryService.countries;
    }

    private save() {

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];

        this.m1.datetime = this.eliminatoryFormGroup.get('meetingDate1').value;
        this.m1.address = this.eliminatoryFormGroup.get('address1').value;
        this.m1.country = this.eliminatoryFormGroup.get('country1').value;

        let observer = this.meetingService.saveEliminatoryMeetingDb(this.m1, this.selectedTourney.id, this.selectedEliminatory.id);
        observer.subscribe( mdb => this.saveMeetingNext(mdb, this.m1));
        
        if(!this.isOneway) {
            this.m2 = this.selectedEliminatory.round.roundtripMeetings[0];
            this.m2.datetime = this.eliminatoryFormGroup.get('meetingDate2').value;
            if(this.m2.datetime < this.m1.datetime) {
                this.m2.datetime = this.m1.datetime;
            }
            this.m2.address = this.eliminatoryFormGroup.get('address2').value;
            this.m2.country = this.eliminatoryFormGroup.get('country2').value;

            let observer = this.meetingService.saveEliminatoryMeetingDb(this.m2, this.selectedTourney.id, this.selectedEliminatory.id);
            observer.subscribe( mdb => this.saveMeetingNext(mdb, this.m2));    
        }

        this.tourneyService.selectedEliminatory = this.selectedEliminatory;
    }
 
    private saveMeetingNext(mdb:  MeetingDb, m: Meeting): void {
        console.log("saveMeetingNext()");
        console.log(mdb);
        m.id = mdb.id;
    }

    done(): void {
        this.save();
        super.goBack();
    }
    
    onError(n:any) {
        let msgerr : string = 'Modifica eliminazione diretta fallita';
        console.error(msgerr);
    }
}
