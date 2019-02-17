import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from 'primeng/api';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { TeamService } from 'app/tourneyonline/service/team-service';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";

    selectedTeam: Team;

    msgs: Message[] = [];

    toggleable: boolean = false;

    constructor(
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
            this.selectedTeam={id: null, teamName:""};
            this.selectedTeam.players = [];
        }
    }

    onSubmit(value: string) {        
        this.teamService.newTeam = false;
        this.teamService.saveTeam(this.selectedTeam).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    enableSaveButton() : string {
        let n : String = this.selectedTeam.teamName;
        let a : String = this.selectedTeam.address;

        return  n.trim() == "" || a.trim() == "" ? "disabled" : "";
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
