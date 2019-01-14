import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'primeng/api';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Player } from 'app/tourneyonline/domain/player';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {

    selectedTeam: Team;

    msgs: Message[] = [];

    teamFormGroup: FormGroup;
    toggleable: boolean = false;

    availablePlayers: Player[] = [];
    targetPlayers: Player[] = [];

    fullAddress: string;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        private   teamService: TeamService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedTeam = this.teamService.selectedTeam;

        if(this.teamService.newTeam) {
            this.selectedTeam.id = this.tourneyService.getSequenceNumber(); 
            this.selectedTeam.players = [];
        }

        this.targetPlayers = this.selectedTeam.players;
        this.availablePlayers = [];

        let alreadyInTeam: Player[] = [];
        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            let t = this.selectedTourney.teams[i];
            let p = t.players;
            for(let j=0; j<p.length; j++ ) {
                alreadyInTeam.push(p[j]);
            }
        }

        for(let i=0; i<this.selectedTourney.players.length; i++ ) {
            let ap = this.selectedTourney.players[i];

            let found: boolean = false;
            for(let j=0; j<alreadyInTeam.length; j++ ) {
                let tp = alreadyInTeam[j];
        
                if(ap.id == tp.id) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.availablePlayers.push(ap);
            }
        }

        if(this.selectedTeam.country!=undefined) {
            this.fullAddress = this.selectedTeam.address + " - " 
                + this.selectedTeam.country.zipCode + " " + this.selectedTeam.country.city
                + " (" + this.selectedTeam.country.provinceCode +")";
        }

        this.teamFormGroup = this.fb.group({
            'teamName': new FormControl(this.selectedTeam.teamName, Validators.compose([Validators.required])),
            'address':  new FormControl(this.selectedTeam.address ),

            'country':          new FormControl(this.selectedTeam.country),
            'availablePlayers': new FormControl(this.availablePlayers),
            'targetPlayers':    new FormControl(this.targetPlayers),
        });
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedTeam.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + this.selectedTeam.teamName;

        if(confirm(popup + this.selectedTeam.teamName + "?")) {
            let index: number = this.selectedTourney.teams.indexOf(this.selectedTeam);
            if(index > -1) {
                this.selectedTourney.teams.splice(index, 1);
            }

            for(let r of this.selectedTourney.rounds) {
                let index: number = r.teams.indexOf(this.selectedTeam);
                if(index > -1) {
                    r.teams.splice(index, 1);
                }    
                 index = r.classification.indexOf(this.selectedTeam);
                if(index > -1) {
                    r.classification.splice(index, 1);
                }    
            }

            this.teamService.updateTeam(this.selectedTeam).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
        }
    }

    onSubmit(value: string) {

        this.selectedTeam.teamName = this.teamFormGroup.get('teamName').value;
        this.selectedTeam.address = this.teamFormGroup.get('address').value;
        this.selectedTeam.country = this.teamFormGroup.get('country').value;
        this.selectedTeam.players = this.teamFormGroup.get('targetPlayers').value;

        if(this.teamService.newTeam) {
            this.selectedTourney.teams.push(this.selectedTeam);
        }

        this.teamService.updateTeam(this.selectedTeam).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.teamService.newTeam) {
            msgerr = 'Creazione nuova squadra fallita';
        } else {
            msgerr = 'Modifica squadra fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
