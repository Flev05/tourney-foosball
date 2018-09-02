import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';

import {Message} from '../../../../components/common/api';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';

@Component({
    templateUrl: './tourney-detailview.html',
    providers: [ConfirmationService],
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
    selectedTourney: Tourney;
    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    goldenGol: string = "yes";
    phase:     string = "round";
    isOnTime:  string = "yes";

    tourneyDate: Date;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private location: Location,
        private confirmationService: ConfirmationService,
        private tourneyService: TourneyService,
    ) {}

    ngOnInit() {

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.tourneyDate = new Date(this.selectedTourney.dateInMillis);

        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'date': new FormControl(this.tourneyDate),
        });
    }

    doDelete() {
        this.tourneyService.deleteTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
    }

    delete() {
        this.confirmationService.confirm({
            message: 'Vuoi rimuovere il torneo dal database?',
            header: 'Conferma la rimozione',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.doDelete();
                this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
            },
            reject: () => {
                this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
            }
        });
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
