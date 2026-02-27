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
import { MeetingRoundService } from '../round/meeting-round-service';
import { ETeamOperation } from 'app/tourneyonline/domain/enumerations';
import { ActivatedRoute } from '@angular/router';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

@Component({
    templateUrl: './team-detailview.html',
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";
    // public static CHANGE_TEAM_NAME_POPUP: string = 'ATTENZIONE! Se si cambia il nome della squadra, si perdono tutte le impostazioni preesistenti. Confermi?';
    public static CHECK_ALREADY_EXIST_TEAM: string = 'ATTENZIONE! Esiste già una squadra con tale nome.' 
        + ' Usare un altro nome per una nuova squadra.' 
        + ' Se si conferma, non viene creata una nuova squadra ma vengono aggiornati gli altri dati.';
    
    selectedTeam: Team = new Team();
    previousTeamName: string = "";
    selectedRound: Round = new Round();
    teamNameCB: Combobox = new Combobox();
    teams4RoundCombobox: Combobox[] = []; 
    isRoundAutoGen: string = "";  

    autoCompleteTeamName: string = ""; 
    filteredTeamsSingle: string[] = [];
    teams: Team[] = [];
    playerLv: boolean = true;
    addPlayerEnabled : boolean = false;
    tourneyTeams: boolean | undefined;

    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        public teamService: TeamService,
        public meetingRoundService: MeetingRoundService,
        private route: ActivatedRoute
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("TeamDetailView.ngOnInit() ");
        super.ngOnInit();
        this.countries = this.countryService.countries;
        this.selectedTeam = this.teamService.selectedTeam;
        this.isRoundAutoGen = this.teamService.isRoundAutoGen;

        this.route.queryParams.subscribe(params => {
            // Note: Query params are strings, so we convert back to boolean
            this.tourneyTeams = params['tourneyTeams'] === 'true';
        });

        // this.selectedRound = null;
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
        this.selectedTeam = new Team();
        this.selectedTeam.players = [];
    }

    private onLoadTeamsComplete(): any {
        this.teams = this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        console.log("Loaded [" + this.teams.length + "] pool teams");
        this.addPlayerEnabled = !this.teamService.readOnly;
    }

    saveTeam() {
        if( !this.tourneyTeams ) {
            this.teamService.saveTeam(this.selectedTeam
                , this.autoCompleteTeamName
                , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
                , () => this.goBack()); 
            return;
        }
        // 1. Verify if the teamName alreay exists in team pool
        const poolIndex = this.teamService.teamPool.findIndex(t => t.teamName === this.autoCompleteTeamName);
        if (poolIndex !== -1) { 
            // The team already exists in the team pool
            if(this.teamService.newTeam) {
                // Simply take the team from the pool team and add it to the teams tourney
                const ttIndex = this.tourneyService.selectedTourney.teams.findIndex(t => t.teamName === this.autoCompleteTeamName);
                if (ttIndex !== -1) {
                    this.tourneyService.selectedTourney.teams[ttIndex] = this.teamService.teamPool[poolIndex];
                } else {
                    this.tourneyService.selectedTourney.teams.push(this.teamService.teamPool[poolIndex]);
                }
                this.teams = this.tourneyService.selectedTourney.teams;
                this.tourneyService.selectedTourney.teamsChanged = true;
                // this.teamService.onTeamOperationChange(ETeamOperation.INSERT);
            } else {
                // Simply take the team from the pool team and update the one in the teams tourney
                if( this.previousTeamName != this.autoCompleteTeamName ) {
                    const ttIndex = this.tourneyService.selectedTourney.teams.findIndex(t => t.teamName === this.previousTeamName);
                    if (ttIndex !== -1) {
                        this.tourneyService.selectedTourney.teams[ttIndex] = this.teamService.teamPool[poolIndex];
                        this.teams = this.tourneyService.selectedTourney.teams;
                        this.tourneyService.selectedTourney.teamsChanged = true;
                        // this.teamService.onTeamOperationChange(ETeamOperation.UPDATE);
                    }
                }                
            }
            super.goBack();
            return;
        } 

        // Add the new team also to the team pool...
        this.selectedTeam.id = null;
        this.teamService.saveTeam(this.selectedTeam
            , this.autoCompleteTeamName
            , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
            , () => this.goBack());
    }

    override goBack(): void {
        if( !this.tourneyTeams ) {
            super.goBack();
            return;
        }
        if(this.teamService.newTeam) {
            if( this.selectedTeam.teamName.trim() != "") {
                let foundTeam = this.tourneyService.selectedTourney.teams.find( t => t.teamName.toUpperCase() == this.selectedTeam.teamName.toUpperCase() );
                if( foundTeam == undefined) {
                    this.tourneyService.selectedTourney.teams.push(this.teamService.selectedTeam);
                    // this.teamService.onTeamOperationChange(ETeamOperation.UPDATE);
                    this.tourneyService.selectedTourney.teamsChanged = true;
                }
            }
        } else {
            if( this.selectedTeam.teamName != this.autoCompleteTeamName ) {
                // this.teamService.onTeamOperationChange(ETeamOperation.UPDATE);
                this.tourneyService.selectedTourney.teamsChanged = true;
            }
        }
        this.selectedTeam.teamName = this.autoCompleteTeamName;
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.tourneyService.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => super.goBack());
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

    override onError(message:any): any {
        console.error(message);
    }
    onComplete(message:any): any {
        super.goBack();
    }

    searchTeam(event : any) {
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
