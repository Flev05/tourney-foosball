import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Meeting } from 'app/tourneyonline/domain/meeting';


@Component({
    templateUrl: './meeting-detailview.html',
})
export class MeetingDetailView extends AbstractDetailView {

    msgs: Message[] = [];

    meetingFormGroup: FormGroup;
    toggleable: boolean = false;

    selectedMeeting: Meeting;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("MeetingDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedMeeting = this.tourneyService.selectedMeeting;

        let dateAndTime: Date = new Date(this.selectedMeeting.dateInMillis);

        this.meetingFormGroup = this.fb.group({
            'name':    new FormControl(this.selectedMeeting.name),
            
            'dateAndTime':    new FormControl(dateAndTime),

            'address': new FormControl(this.selectedMeeting.address),
            'country': new FormControl(this.selectedMeeting.country),
        });
    }

    onSubmit(value: string) {

        let dateAndTime: Date = this.meetingFormGroup.get('dateAndTime').value;

        this.selectedMeeting.dateInMillis = dateAndTime.getTime();

        this.selectedMeeting.address = this.meetingFormGroup.get('address').value;
        this.selectedMeeting.country = this.meetingFormGroup.get('country').value;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica meeting fallita';
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
