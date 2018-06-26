import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {Message,SelectItem} from '../../../components/common/api';

import { Tourney } from '../../domain/tourney';
import { TourneyService } from '../../service/tourneyservice';
import {CalendarModule} from 'primeng/calendar';

@Component({
    templateUrl: './tourney-detailview.html',
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .date-width {
            width: 30mm;
        }
        .time-width {
            width: 20mm;
        }
  `]
})
export class TourneyDetailView implements OnInit {
    en: any;
    invalidDates: Array<Date>
 
    selectedTourney: Tourney;

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tourneyService: TourneyService,
        private location: Location
    ) {}

    ngOnInit() {
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"],
            monthNames: [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
            monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
            today: 'Today',
            clear: 'Clear'
        };
 
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;

        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today,invalidDate];

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.tourneyFormGroup = this.fb.group({
            'name': new FormControl(this.selectedTourney.name, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'date': new FormControl(this.selectedTourney.date, Validators.compose([Validators.required])),
            'time': new FormControl(this.selectedTourney.time, Validators.compose([Validators.required])),
        });
    }

    delete() {
        this.tourneyService.deleteTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.name = this.tourneyFormGroup.get('name').value;
        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.date = this.tourneyFormGroup.get('date').value;
        this.selectedTourney.time = this.tourneyFormGroup.get('time').value;

        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
        }
    }

    next(n:any) {
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newTourney) {
            msgerr = 'Creazione nuovo torneo fallita';
        } else {
            msgerr = 'Modifica torneo fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }

    onComplete() {
        this.goBack();  
    }

    goBack(): void {
        this.location.back();
    }
}
