import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';

import {Message,SelectItem} from '../../../../components/common/api';

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

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private location: Location,
        private confirmationService: ConfirmationService,
        private tourneyService: TourneyService,
    ) {}

    ngOnInit() {

        this.selectedTourney = this.tourneyService.selectedTourney;

        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'date': new FormControl(this.selectedTourney.date, Validators.compose([Validators.required])),
            'time': new FormControl(this.selectedTourney.time, Validators.compose([Validators.required])),
        });
    }

    doDelete() {
        this.tourneyService.deleteTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.date = this.tourneyFormGroup.get('date').value;
        this.selectedTourney.time = this.tourneyFormGroup.get('time').value;

        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
        }
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
