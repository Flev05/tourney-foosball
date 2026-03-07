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
import { Player } from 'app/tourneyonline/domain/player';

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

    teams: Team[] = [];
    allTeams: Team[] = [];
    addPlayerEnabled : boolean = false;
    tourneyTeams: boolean | undefined = false;

    autoCompleteTeamName: Team = new Team(); 
    filteredTeamsSingle: Team[] = [];
    isRenaming = false;
    newName = '';

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
            this.prepareNewTeam("");
        }
        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete());

        this.autoCompleteTeamName = this.selectedTeam;
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
    
    private prepareNewTeam(teamName: string) {
        this.selectedTeam = new Team();
        this.selectedTeam.id = 0;
        this.selectedTeam.teamName = teamName;
        this.selectedTeam.players = [];
        this.teamService.selectedTeam.players = [];
    }

    private onLoadTeamsComplete(): any {
        this.teams = this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        this.allTeams = [...this.teams];        
        console.log("Loaded [" + this.teams.length + "] pool teams");
        this.addPlayerEnabled = !this.teamService.readOnly;
    }

    prepareRename() {
        this.newName = this.autoCompleteTeamName.teamName;
        this.isRenaming = true;
    }
    
    saveRename() {
        if (!this.newName || this.newName.trim() === '') {
            return;
        } 
        // Create a copy of the object with the new name
        this.selectedTeam.teamName = this.newName;
        this.doSaveTeam(this.newName);
    }
    
    saveTeam() {
        if (typeof this.autoCompleteTeamName === 'string') {
            this.selectedTeam.teamName = this.autoCompleteTeamName;
        } else {
            // This is an EXISTING team object
            const existingId = this.autoCompleteTeamName.id;
            let index = this.allTeams.findIndex( t => t.id === existingId);
            if( index !== -1 ) {
                this.selectedTeam.teamName = this.allTeams[index].teamName;
            }
        }
        this.doSaveTeam(this.selectedTeam.teamName)
    }

    private doSaveTeam(newTeamName : string) {
        if( !this.tourneyTeams ) {
            this.teamService.saveTeam(this.selectedTeam
                , newTeamName
                , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
                , () => super.goBack()); 
            return;
        }
        // 1. Verify if the teamName alreay exists in team pool
        const poolIndex = this.teamService.teamPool.findIndex(t => t.teamName === newTeamName);        
        if (poolIndex !== -1) { 
            // The team already exists in the team pool
            if(this.teamService.newTeam) {
                // Simply take the team from the pool team and add it to the teams tourney
                const ttIndex = this.tourneyService.selectedTourney.teams.findIndex(t => t.teamName === newTeamName);                
                if (ttIndex !== -1) {
                    this.tourneyService.selectedTourney.teams[ttIndex] = this.teamService.teamPool[poolIndex];
                } else {
                    this.tourneyService.selectedTourney.teams.push(this.teamService.teamPool[poolIndex]);
                }
                this.teams = this.tourneyService.selectedTourney.teams;
                this.tourneyService.selectedTourney.teamsChanged = true;
                this.selectedTeam.id = null;                
                // this.teamService.onTeamOperationChange(ETeamOperation.INSERT);
            } else {
                // Simply take the team from the pool team and update the one in the teams tourney
                if( this.previousTeamName != newTeamName ) {                    
                    const ttIndex = this.tourneyService.selectedTourney.teams.findIndex(t => t.teamName === this.previousTeamName);
                    if (ttIndex !== -1) {
                        this.tourneyService.selectedTourney.teams[ttIndex] = this.teamService.teamPool[poolIndex];
                        this.teams = this.tourneyService.selectedTourney.teams;
                        this.tourneyService.selectedTourney.teamsChanged = true;
                        // this.teamService.onTeamOperationChange(ETeamOperation.UPDATE);
                    }
                }                
            }
        } 

        // Add the new team also to the team pool...
        this.selectedTeam.id = null;
        this.teamService.saveTeam(this.selectedTeam
            , newTeamName
            , TeamDetailView.CHECK_ALREADY_EXIST_TEAM
            , () => this.onTeamSaveComplete());
    }

    private onTeamSaveComplete(): void {
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
            let newTeamName : string = "";
            if (typeof this.autoCompleteTeamName === 'string') {
                newTeamName = this.autoCompleteTeamName;
            } else {
                newTeamName = this.autoCompleteTeamName.teamName;
            }
            if( this.selectedTeam.teamName != newTeamName ) {
                // this.teamService.onTeamOperationChange(ETeamOperation.UPDATE);
                this.tourneyService.selectedTourney.teamsChanged = true;
            }
        }
        this.selectedTeam = this.autoCompleteTeamName;
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
        if(this.teamService.newTeam) {
            return "";
        }
        let n : String = this.autoCompleteTeamName.teamName;
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
    
    loadTeamsCompleteMethod(event: any) {
        const query = event.query.toLowerCase();
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

    onTeamSelect(event: Team) {
        // 'event' is the object selected from the list
        const teamId = event.id;
        if (event.isNew || teamId === -1) {
            this.prepareNewTeam(event.teamName);
        } else {
            this.filteredTeamsSingle = this.allTeams.filter(p => p.id == teamId);
            if(this.filteredTeamsSingle && this.filteredTeamsSingle.length > 0) {
                let partialTeam = this.filteredTeamsSingle[0];
                let index = this.teams.findIndex( t => t.teamName === partialTeam.teamName);
                if( index !== -1 ) {
                    this.selectedTeam = this.teams[index];
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
