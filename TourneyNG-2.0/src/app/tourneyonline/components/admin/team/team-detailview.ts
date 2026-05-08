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
import { ActivatedRoute } from '@angular/router';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
    templateUrl: './team-detailview.html',
    standalone: false
})
export class TeamDetailView extends AbstractDetailView {
    public static redirect: string = "adminteam/dv";
    // public static CHANGE_TEAM_NAME_POPUP: string = 'ATTENZIONE! Se si cambia il nome della squadra, si perdono tutte le impostazioni preesistenti. Confermi?';
    public static CHECK_ALREADY_EXIST_TEAM: string = 'ATTENZIONE! Esiste già una squadra con tale nome.' 
        + ' Usare un altro nome per una nuova squadra.' 
        + ' Se si conferma, non viene creata una nuova squadra ma vengono aggiornati gli altri dati.';
    
    selectedTeam: Team = new Team();
    previousSelectedTeamName: string = "";
    selectedRound: Round = new Round();
    teamNameCB: Combobox = new Combobox();
    teams4RoundCombobox: Combobox[] = []; 
    isRoundAutoGen: string = "";  

    allTeams: Team[] = [];
    addPlayerEnabled : boolean = false;
    tourneyTeams: boolean | undefined = false;

    autoCompleteTeam: Team = new Team(); 
    filteredTeamsSingle: Team[] = [];
    isRenaming = false;
    chaosEnabled: boolean = false; 

    errorMessage: string | null = null;
    newName: string = "";

    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected clientService: ClientService,
        protected loginService: LoginService,
        protected countryService: CountryService,
        public teamService: TeamService,
        public meetingRoundService: MeetingRoundService,
        public playerService: PlayerService,
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

        // Note: Query params are strings, so we convert back to boolean
        this.route.queryParams.subscribe(params => {
            this.tourneyTeams = params['tourneyTeams'] === 'true';
            this.chaosEnabled = params['chaosEnabled'] === 'true';
        });

        // this.selectedRound = null;
        if(this.teamService.newTeam) {
            this.prepareNewTeam("");
        }
        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete());

        this.autoCompleteTeam = this.selectedTeam;
        this.previousSelectedTeamName = this.selectedTeam.teamName;
        this.teamService.teamAlreadyExists = false;

        this.teams4RoundCombobox = [];
        if( this.tourneyService.selectedRound ) {
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
    
    private prepareNewTeam(teamName: string) {
        this.selectedTeam = new Team();
        this.selectedTeam.id = 0;
        this.selectedTeam.teamName = teamName;
        this.selectedTeam.players = [];
        this.teamService.selectedTeam.players = [];
    }

    private onLoadTeamsComplete(): any {
        this.allTeams = [...this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) )];        
        console.log("Loaded [" + this.allTeams.length + "] pool teams");
        this.addPlayerEnabled = !this.teamService.readOnly;
    }

    prepareRename() {
        this.newName = this.autoCompleteTeam.teamName;
        this.isRenaming = true;
    }
    
    validateName() {
        const trimmedName = this.newName.trim().toLowerCase();

        // 1. Check if empty
        if (!trimmedName) {
            this.errorMessage = null;
            return;
        }

        // 2. Check if the name already exists in the 'teams' list
        // Note: We check other teams, but allow the name if it's the SAME as the current team's name
        const isDuplicate = this.allTeams.some(team => 
            team.teamName.toLowerCase() === trimmedName && 
            team.id !== this.selectedTeam?.id
        );

        if (isDuplicate) {
            this.errorMessage = "Questo nome squadra è già esistente!";
        } else {
            this.errorMessage = null;
        }
    }

    saveRename() {
        // Final safety check
        this.validateName();
        if (!this.errorMessage && this.newName.trim()) {
            this.selectedTeam.teamName = this.newName.trim();            
            this.isRenaming = false;
            this.newName = "";
            this.saveTourneyTeam();
        }
    }
    
    saveTeam() {
        if( this.tourneyTeams ) {
            this.saveTourneyTeam();
        } else {
            this.savePoolTeam();
        }
    }

    private saveTourneyTeam() {
        if (typeof this.autoCompleteTeam === 'string') {
            if( !this.autoCompleteTeam ) {
                this.errorMessage = "Il nome della squadra è obbligatorio ";
                return;
            }
            this.selectedTeam.teamName = this.autoCompleteTeam;
        } else {
            if( !this.autoCompleteTeam.teamName ) {
                this.errorMessage = "Il nome della squadra è obbligatorio ";
                return;
            }
        }
        this.selectedTeam.teamName = this.selectedTeam.teamName.toUpperCase();
        let index = this.tourneyService.selectedTourney.teams.findIndex( t => t.teamName.toUpperCase() === this.selectedTeam.teamName);
        if( index !== -1 || this.previousSelectedTeamName !== this.selectedTeam.teamName) {
            this.teamService.updateExistingTeam(this.selectedTeam, () => this.onTeamSaveComplete());
            if( this.previousSelectedTeamName !== this.selectedTeam.teamName ) {
                this.tourneyService.updateEveryThinkOnTeamChange(this.tourneyService.selectedTourney, this.previousSelectedTeamName,this.selectedTeam.teamName);
            }
            return;
        }

        this.selectedTeam.id = null;
        this.teamService.updateExistingTeam(this.selectedTeam, () => this.onTeamSaveComplete());
    }

     private onTeamSaveComplete(): void {
        this.selectedTeam = this.teamService.selectedTeam;
        let index = this.tourneyService.selectedTourney.teams.findIndex( t => t.teamName.toUpperCase() === this.selectedTeam.teamName);
        if( index === -1 ) {
            this.tourneyService.selectedTourney.teams.push(this.selectedTeam);
        } else {
            this.tourneyService.selectedTourney.teams[index] = this.selectedTeam;
        }
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.tourneyService.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => super.goBack());
    }

    private savePoolTeam() {
        if (typeof this.autoCompleteTeam === 'string') {
            if( !this.autoCompleteTeam ) {
                this.errorMessage = "Il nome della squadra è obbligatorio ";
                return;
            }
            this.selectedTeam.teamName = this.autoCompleteTeam;
        } else {
            if( !this.autoCompleteTeam.teamName ) {
                this.errorMessage = "Il nome della squadra è obbligatorio ";
                return;
            }
        }
        this.selectedTeam.teamName = this.selectedTeam.teamName.toUpperCase();
        let index = this.allTeams.findIndex( t => t.teamName.toUpperCase() === this.selectedTeam.teamName);
        if( index !== -1 || (this.previousSelectedTeamName && this.previousSelectedTeamName !== this.selectedTeam.teamName )) {
            this.teamService.updateExistingTeam(this.selectedTeam, () => super.goBack());
            return;
        }

        this.selectedTeam.id = null;
        this.teamService.updateExistingTeam(this.selectedTeam, () => this.goBack());
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
        if(this.teamService.newTeam) {
            return "";
        }
        let n : String = this.autoCompleteTeam.teamName;
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

    loadTeamsCompleteMethod(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();

        if (!event.query) {
            if( this.tourneyTeams ) {
                this.filteredTeamsSingle = this.getAvailableTeams();
            } else {               
                this.filteredTeamsSingle = [...this.allTeams]; // Show all when dropdown clicked
            }
        } else {
            this.filteredTeamsSingle = this.getAvailableTeams().filter(t =>
                t.teamName.toLowerCase().includes(query)
            );
    
            const exactMatch = this.filteredTeamsSingle.some(t => t.teamName.toLowerCase() === query.toLowerCase());
            if (!exactMatch && query.length > 2) {
                const t : Team = new Team();
                t.id = -1;
                t.teamName = query;
                t.isNew = true;
                this.filteredTeamsSingle.push(t);
            }
        }
    }

    onTeamSelect(event: any) {
        if( this.tourneyTeams ) {
            // this.teamService.newTeam = false;
        }    
        this.errorMessage = null;
        const teamId = event.value.id;
        if (event.value.isNew || teamId === -1) {
            this.prepareNewTeam(event.value.teamName);
        } else {
            this.filteredTeamsSingle = this.allTeams.filter(p => p.id == teamId);
            if(this.filteredTeamsSingle && this.filteredTeamsSingle.length > 0) {
                let partialTeam = this.filteredTeamsSingle[0];
                let index = this.allTeams.findIndex( t => t.teamName === partialTeam.teamName);
                if( index !== -1 ) {
                    this.selectedTeam = this.allTeams[index];
                }
            }
        }
    }
 
    private getAvailableTeams(): Team[] {
        const used = this.getUsedIds();
        return this.allTeams.filter(p => !used.has(p.id));
    }

    private getUsedIds(): Set<number | null> {
         if( !this.tourneyTeams ) {
            return new Set([]);
        }
        return new Set([
            ...this.tourneyService.selectedTourney.teams.map(p => p.id)
        ]);
    }
}
