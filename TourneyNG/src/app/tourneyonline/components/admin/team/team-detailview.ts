import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Round } from 'app/tourneyonline/domain/round';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { MeetingRoundService } from '../round/meeting-round-service';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";
    // public static CHANGE_TEAM_NAME_POPUP: string = 'ATTENZIONE! Se si cambia il nome della squadra, si perdono tutte le impostazioni preesistenti. Confermi?';
    public static CHECK_ALREADY_EXIST_TEAM: string = 'ATTENZIONE! Esiste già una squadra con tale nome.' 
        + ' Usare un altro nome per una nuova squadra.' 
        + ' Se si conferma, non viene creata una nuova squadra ma vengono aggiornati gli altri dati.';

    selectedTeam: Team;
    previousTeamName: string;
    selectedRound: Round;
    teamNameCB: Combobox;
    teams4RoundCombobox: Combobox[]; 
    isRoundAutoGen: string; 

    autoCompleteTeamName: string; 
    filteredTeamsSingle: string[];
    teams: Team[];

    constructor(
        protected location: Location,
        protected tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        public teamService: TeamService,
        public meetingRoundService: MeetingRoundService
    ) { 
        super(tourneyService, location);
    }

    ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");

        super.ngOnInit();
        this.countries = this.countryService.countries;
        this.selectedTeam = this.teamService.selectedTeam;
        this.isRoundAutoGen = this.teamService.isRoundAutoGen;
        
        this.selectedRound = null;
        if(this.teamService.newTeam) {
            this.prepareNewTeam();
        }
        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete());

        this.autoCompleteTeamName = this.selectedTeam.teamName;
        this.previousTeamName = this.selectedTeam.teamName;
        this.teamService.teamAlreadyExists = false;

        this.teams4RoundCombobox = [];
        if( this.tourneyService.selectedRound != null ) {
            this.selectedRound = this.tourneyService.selectedRound;
            for( let t of this.selectedTourney.teams) {
                if(t.teamName == this.selectedTeam.teamName) {
                    this.selectedTeam.id = t.id;
                }
                if( this.selectedRound.teamNames.indexOf(t.teamName) != -1) {
                    continue;
                }
                this.teams4RoundCombobox.push({label: t.teamName, value: t.id});
            }
            this.teams4RoundCombobox.sort((t1,t2) => {
                if(t1.label < t2.label) {
                    return -1;
                }
                if(t1.label > t2.label) {
                    return 1;
                }
                return 0;
            });
    
            this.teams4RoundCombobox.push({label: this.selectedTeam.teamName, value: this.selectedTeam.id});
            this.teamNameCB = {label: this.selectedTeam.teamName, value: this.selectedTeam.id};
        }
    }
    
    private prepareNewTeam() {
        this.selectedTeam = { id: 0, teamName: "" };
        this.selectedTeam.players = [];
        this.tourneyService.selectedRound = null;
    }

    private onLoadTeamsComplete(): any {
        this.teams = this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        console.log("Loaded [" + this.teams.length + "] pool teams");
    }

    saveTeam() {
        this.teamService.saveTeam(this.selectedTeam
            , this.autoCompleteTeamName
            , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
            , () => super.goBack());
    }

    goBack(): void {
        this.selectedTeam.teamName = this.autoCompleteTeamName;
        super.goBack();
    }

    /**
     * Processes the change on the number of teams for each round
     * @param cb the selected item in the combo box
     */
    onTeamChange(cb: Combobox) {
        console.log('Entering onTeamChange(' + cb +")");
        for(let t of this.selectedTourney.teams) {
            if( t.teamName == cb.label ) {
                this.selectedTeam = t;
                break;
            }
        }
    }
    
    enableSaveButton() : string {
        let n : String = this.autoCompleteTeamName;
        if( n == undefined || n.trim() == "") {
            // this.prepareNewTeam();
            return "disabled";
        }
        return "";
    }

    onError(message:any): any {
        console.error(message);
    }
    onComplete(message:any): any {
        super.goBack();
    }

    searchTeam(event) {
        let query = event.query;
        this.filteredTeamsSingle = this.teamService.filterTeam(query, this.teams);
        if(this.filteredTeamsSingle.length > 0) {
            let partialTeamName = this.filteredTeamsSingle[0];
            let index = this.teams.findIndex( t => t.teamName === partialTeamName);
            if( index !== -1 ) {
                this.selectedTeam = this.teams[index];
            }
        }
    }
}
