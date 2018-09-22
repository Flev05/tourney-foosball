import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Round } from '../../../domain/round';
import { RoundType } from '../../../domain/roundType';
import { Team } from '../../../domain/team';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';


@Component({
    templateUrl: './round-detailview.html',
})
export class RoundDetailView extends AbstractDetailView {
    selectedRound: Round;

    msgs: Message[] = [];

    roundFormGroup: FormGroup;
    toggleable: boolean = false;

    availableTeams: Team[] = [];
    targetTeams: Team[] = [];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("RoundDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;

        if(this.tourneyService.newRound) {
            this.selectedRound.id = this.tourneyService.getSequenceNumber(); 
            this.selectedRound.teams = [];
            this.selectedRound.type = RoundType.R;
        }

        this.targetTeams = this.selectedRound.teams;
        this.availableTeams = [];

        let usedTeams: Team[] = [];
        for(let i=0; i<this.selectedTourney.rounds.length; i++ ) {
            let t = this.selectedTourney.rounds[i];
            let p = t.teams;
            for(let j=0; j<p.length; j++ ) {
                usedTeams.push(p[j]);
            }
        }

        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            let ut = this.selectedTourney.teams[i];
            let index: number = usedTeams.indexOf(ut);
            if(index == -1) {
                this.availableTeams.push(ut);
            }
        }

        this.roundFormGroup = this.fb.group({
            'name': new FormControl(this.selectedRound.name, Validators.compose([Validators.required])),
            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),
        });
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedRound.name);
        let popup = 'Sicuro di voler rimuovere il girone: ';

        if(confirm(popup + this.selectedRound.name + "?")) {
            let index: number = this.selectedTourney.rounds.indexOf(this.selectedRound);
            if(index > -1) {
                this.selectedTourney.rounds.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }

    onSubmit(value: string) {

        this.selectedRound.name = this.roundFormGroup.get('name').value;
        this.selectedRound.teams = this.roundFormGroup.get('targetTeams').value;

        if(this.tourneyService.newRound) {
            this.selectedTourney.rounds.push(this.selectedRound);
            this.selectedTourney.roundNo = this.selectedTourney.rounds.length;
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newRound) {
            msgerr = 'Creazione nuovo girone fallita';
        } else {
            msgerr = 'Modifica girone fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
