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
    public static CHANGE_TEAM_NAME_POPUP: string = 'ATTENZIONE! Se si cambia il nome della squadra, si perdono tutte le impostazioni preesistenti. Confermi?';

    selectedTeam: Team;
    previousTeamName: string;
    selectedRound: Round;
    teamNameCB: Combobox;
    teams4RoundCombobox: Combobox[]; 
    isRoundAutoGen: string;

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
            this.selectedTeam={id: 0, teamName:""};
            this.selectedTeam.players = [];
            this.tourneyService.selectedRound = null;
        }
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

    saveTourneyTeam() {     
        if(this.teamService.newTeam) {
            this.teamService.saveTourneyTeam(this.selectedTourney, true, this.selectedTeam, () => super.goBack());
            return;
        }
        if( this.previousTeamName != this.selectedTeam.teamName ) {
            if(!confirm(TeamDetailView.CHANGE_TEAM_NAME_POPUP)) {
                return;
            }
            this.teamService.saveTourneyTeam(this.selectedTourney, true, this.selectedTeam, () => super.goBack());
        }
    } 

    saveRoundTeam() {
        if( this.previousTeamName != this.selectedTeam.teamName ) {
            for( let r of this.selectedTourney.roundVO.rounds) {
                if( r.name == this.selectedRound.name ) {
                    let index = r.teamNames.indexOf(this.previousTeamName);
                    r.teamNames[index] = this.selectedTeam.teamName;
                    for( let c of r.classification ) {
                        if( c.teamName == this.previousTeamName ) {
                            c.teamName = this.selectedTeam.teamName;
                            break;
                        }
                    }
                }
            }
            
            let cvo = this.clientService.selectedClient;
            let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, cvo);
            this.tourneyService.updateTourneyRoundTeams(tvo,  () => super.goBack());
        }
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
        let n : String = this.selectedTeam.teamName;
        if( n == undefined ) {
            return  "disabled";
        }
        return  n.trim() == "" ? "disabled" : "";
    }

    onError(message:any): any {
        console.error(message);
    }
    onComplete(message:any): any {
        super.goBack();
    }
}
