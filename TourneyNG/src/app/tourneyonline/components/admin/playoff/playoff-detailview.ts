import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Playoff } from '../../../domain/playoff';
import { RoundType } from '../../../domain/roundType';
import { Team } from '../../../domain/team';
import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';


@Component({
    templateUrl: './playoff-detailview.html',
})
export class PlayoffDetailView extends AbstractDetailView {
    selectedPlayoff: Playoff;

    msgs: Message[] = [];

    playoffFormGroup: FormGroup;
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
        console.log("PlayoffDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedPlayoff = this.tourneyService.selectedPlayoff;

        if(this.tourneyService.newPlayoff) {
            this.selectedPlayoff.name = "";
            this.selectedPlayoff.id = this.tourneyService.getSequenceNumber(); 
            this.selectedPlayoff.teams = [];
            this.selectedPlayoff.type = RoundType.P;
        }

        this.targetTeams = this.selectedPlayoff.teams;
        this.availableTeams = [];

        let usedTeams: Team[] = [];
        for(let i=0; i<this.selectedTourney.playoffs.length; i++ ) {
            let t = this.selectedTourney.playoffs[i];
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

        this.playoffFormGroup = this.fb.group({
            'name': new FormControl(this.selectedPlayoff.name, Validators.compose([Validators.required])),
            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),
        });
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedPlayoff.name);
        let popup = 'Sicuro di voler rimuovere il playoff: ';

        if(confirm(popup + this.selectedPlayoff.name + "?")) {
            let index: number = this.selectedTourney.playoffs.indexOf(this.selectedPlayoff);
            if(index > -1) {
                this.selectedTourney.playoffs.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }

    onSubmit(value: string) {

        this.selectedPlayoff.name = this.playoffFormGroup.get('name').value;
        this.selectedPlayoff.teams = this.playoffFormGroup.get('targetTeams').value;

        if(this.tourneyService.newPlayoff) {
            this.selectedTourney.playoffs.push(this.selectedPlayoff);
            this.selectedTourney.playoffNo = this.selectedTourney.playoffs.length;
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newPlayoff) {
            msgerr = 'Creazione nuovo playoff fallita';
        } else {
            msgerr = 'Modifica playoff fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
