import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder, Validators} from '@angular/forms';

import { Eliminatory } from '../../../domain/eliminatory';
import { Meeting } from '../../../domain/meeting';
import { EliminatoryLevel } from '../../../domain/eliminatory-level';
import { TourneyService } from '../../../service/tourney-service';
import { AbstractDetailView } from '../../../components/common/abstract-detailview';
import { MeetingService } from '../../../service/meeting-service';
import { MeetingDb } from '../../../domain/meeting-db';
import { Direction } from '../../../domain/enumerations';
import { CountryService } from '../../../service/country-service';
import { LevelService } from './level-service';
import { Country } from '../../../domain/country';

@Component({
    templateUrl: './eliminatory-standalone-detailview.html',
})
export class StandaloneEliminatoryDetailView extends AbstractDetailView {
    
    eliminatoryFormGroup: FormGroup;

    fullAddress1: string = "";
    fullAddress2: string = "";

    selectedEliminatory: Eliminatory = new Eliminatory();

    eliminatories: Eliminatory[] = [];  

    selectedEliminatoryLevel: EliminatoryLevel = new EliminatoryLevel();
    isTopLevel: boolean = true;
    isOneway: boolean = true;

    isStandalone: boolean = false;
    m1: Meeting = new Meeting();
    m2: Meeting = new Meeting();

    constructor(
        private fb: FormBuilder,
        protected override location: Location,
        public override tourneyService: TourneyService,
        protected meetingService: MeetingService,
        protected countryService: CountryService,
        protected levelService: LevelService,
    ) { 
        super(tourneyService, location);
        this.eliminatoryFormGroup = this.fb.group({
            username: [''],
            password: ['']
        });
    }

    override ngOnInit() {
        console.log("EliminatoryDetailView.ngOnInit() ");

        super.ngOnInit();
        
        this.countryService.loadAllCountries(() => this.onLoadAllCountriesComplete());

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.isOneway = this.selectedEliminatoryLevel.abstractRoundVO.direction == Direction.OneWay;
        this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;

        this.m1 = this.selectedEliminatory.round.onewayMeetings[0];

        this.isStandalone = this.levelService.isStandAlone(this.selectedTourney);

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

        let efg = this.eliminatoryFormGroup.get('meetingDate1');
        this.m1.datetime = efg == null ? new Date() : efg.value;

        efg = this.eliminatoryFormGroup.get('address1');
        this.m1.address = efg == null ? "" : efg.value;
        
        efg = this.eliminatoryFormGroup.get('country1');
        this.m1.country = efg == null ? new Country() : efg.value;

        let observer = this.meetingService.saveEliminatoryMeetingDb(this.m1, this.selectedTourney.id, this.selectedEliminatory.id, ee => this.serverUnreachableHandler(ee));
        observer.subscribe( mdb => this.saveMeetingNext(mdb, this.m1));
        
        this.m2 = this.selectedEliminatory.round.roundtripMeetings[0];
        efg = this.eliminatoryFormGroup.get('meetingDate2');
        this.m2.datetime = efg == null ? new Date() : efg.value;

        if(this.m2.datetime < this.m1.datetime) {
            this.m2.datetime = this.m1.datetime;
        }
        efg = this.eliminatoryFormGroup.get('address2');
        this.m2.address = efg == null ? "" : efg.value;

        efg = this.eliminatoryFormGroup.get('country2');
        this.m2.country = efg == null ? new Country() : efg.value;

        observer = this.meetingService.saveEliminatoryMeetingDb(this.m2, this.selectedTourney.id, this.selectedEliminatory.id, ee => this.serverUnreachableHandler(ee));
        observer.subscribe( mdb => this.saveMeetingNext(mdb, this.m2));    
  
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
    
    override onError(n:any) {
        let msgerr : string = 'Modifica eliminazione diretta fallita';
        console.error(msgerr);
    }
}
