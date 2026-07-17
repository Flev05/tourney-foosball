import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from 'app/tourneyonline/service/team-service';
import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { Team } from 'app/tourneyonline/domain/team';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { TeamDetailView } from '../team/team-detailview';
import { last, Observable, of } from 'rxjs';
import { Table } from 'primeng/table';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { Player } from 'app/tourneyonline/domain/player';

const REDIRECT_TOURNEY_LV   = 'admintourney/';

@Component({
    selector: 'app-team-table',
    templateUrl: './team-table.component.html',
    styleUrls: ['./team-table.component.css'],
    standalone: false
})
export class TeamTableComponent extends AbstractListView {
    @Input() addTeamEnabled: boolean | undefined;
    @Input() tourneyTeams: boolean | undefined;
    @Input() chaosEnabled: boolean | undefined;
    @Input() teamAddMode: string | undefined;
    @ViewChild('table') table!: Table; // This gives us access to the #table from HTML

    // Define the Output emitter
    @Output() teamChanged = new EventEmitter<Team>();
    
    cols = [
        { field: 'player0', header: 'DIFENSORE' },
        { field: 'player1', header: 'ATTACCANTE' },
    ];

    selectedTeam: Team = new Team();
    teams: Team[] = [];
    allTeams: Team[] = [];
    deleteTeam: Team = new Team();
    onDeleteTeamError: boolean = false;

    teamNameFilter: string = "";
    teamCount : number = 0;

    selectedTeamToAdd: Team | null = null;
    teamToAdd: Team  | null = null;
    filteredTeams: Team[] = [];
    // Track which row ID is currently in edit mode
    editingTeamId: number | string | null = null;

    constructor(
        protected override tourneyService: TourneyService,
        protected override router: Router,
        protected override location: Location,
        public   teamService: TeamService,
        private  clientService: ClientService,
        public   loginService: LoginService,
    ) {
        super(TeamDetailView.redirect, tourneyService, router, location);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.addTeamEnabled = this.loginService.isUserAllowed();
        this.teamService.loadAllTeams( () => this.onLoadTeamsComplete());
    }
  
    // Call this method whenever a team is modified/saved
    onTeamUpdate(team: Team) {
        this.teamChanged.emit(team);
    }

    private onLoadTeamsComplete(): any {
        this.allTeams = this.teamService.teamPool.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
        console.log("Loaded [" + this.teams.length + "] pool teams");
        if( this.tourneyTeams ) {
            this.teams = this.tourneyService.selectedTourney.teams.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
            this.teamService.tourneyTeams = this.tourneyTeams;
            if( this.tourneyService.selectedTourney.teamsChanged) {
                this.onTeamUpdate(this.selectedTeam);
                this.tourneyService.selectedTourney.teamsChanged = false;
            }
        } else  {
            this.teams = this.allTeams;
        } 
        this.teamCount = this.teams.length;

        if( this.teamService.newTeam == true ) {
            if(this.teamService.selectedTeam.teamName) {
                this.onTeamUpdate(this.teamService.selectedTeam);
            }
            this.teamService.newTeam = false;
        }

        setTimeout(() => {
            if (this.table) {
                this.table.filter(this.teamService.storedTeamFilter, 'teamName', 'contains');
            }
        }, 5);        
    }
  
    // 2. Save the filter as the user types
    onFilterChange(value: string, table: Table) {
        this.teamService.storedTeamFilter = value;
        table.filter(value, 'teamName', 'contains');
    }

    public gotoListView() {
        this.router.navigate([REDIRECT_TOURNEY_LV], { 
            queryParams: { tourneyTeams: this.tourneyTeams }
        });
    }

    newTeam() {
        this.selectedTeam = new Team();
        this.teamService.selectedTeam = this.selectedTeam;
        this.teamService.newTeam = true;
        this.gotoDetailView();
    }

    onRowSelect(event : any) {
        console.log(event.data);
        this.teamService.newTeam = false;
        this.teamService.selectedTeam = this.selectedTeam;
        this.gotoDetailView();
    }
    
    protected override gotoDetailView(): void {
        this.router.navigate([this.redirect], { 
            queryParams: { tourneyTeams: this.tourneyTeams, chaosEnabled:this.chaosEnabled }
        });
    }

    doDelete(team: Team) {
        console.log(team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName ;
        this.deleteTeam = team;
        if(confirm(popup)) {
            this.onTeamUpdate(team);
            let index: number = this.teams.indexOf(this.deleteTeam);
            if( this.tourneyTeams ) { // the DELETE will apply only on the teams belonging to the tourney, not the one in the pool
                if(index > -1) {
                    this.teams = [...this.teams.filter(item => item !== team)];
                    this.tourneyService.selectedTourney.teams = this.teams;
                    // If the user has a search/filter active, update the filtered list too
                    if (this.table.filteredValue) {
                        this.table.filteredValue = this.table.filteredValue.filter(t => t.id !== team.id);
                    }
                    // this.teamService.onTeamOperationChange(ETeamOperation.DELETE); // fire the DELETE event for Subscribed listeners
                    
                    let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.tourneyService.selectedTourney, this.clientService.selectedClient, true);
                    const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
                    subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => {});
                }
                return;
            }
            if(index > -1) {
                const observer = this.teamService.deleteTeam(team, this.deleteTeamErrorHandler("Team player operation"));
                observer.subscribe(n => this.next(n), e => this.subscribeErrorHandler(e), () => this.onDeleteComplete());
            }
        }
    }

    private deleteTeamErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deleteTeamErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onDeleteTeamError = true;
            return of(result as T);
        };
    }

    protected override subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onDeleteTeamError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private onDeleteComplete() {
        console.log("Entering onDeleteComplete()");
        if( !this.onDeleteTeamError ) {
            this.teams = [...this.teams.filter(p => p.id !== this.deleteTeam.id)];
        }
    }

    createChaos() {
        console.log("Entering createChaos()");
        this.teams = this.generateChaosTeams();
        this.selectedTourney.teams = this.teams;
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.onTeamUpdate(this.teams[0]));
    }

    onFixedCoupleChange(checked: boolean): void {
        this.tourneyService.addFixedCoupleCounter = checked ? 0 : -1;
    }

    saveFixedCouple() {
        console.log("Entering saveFixedCouple()");
        if( this.tourneyService.addFixedCoupleCounter <= 1 ) {
            return;
        }
        const defendersLen = this.selectedTourney.defenderPlayers.length;
        const offendesLen = this.selectedTourney.offenderPlayers.length;
        if( this.tourneyService.addFixedCoupleCounter % 2 == 0 ) {
            for( let i=this.tourneyService.addFixedCoupleCounter / 2; i>0; i-- ) {
                let p1 = this.selectedTourney.defenderPlayers[defendersLen - i];
                let p2 = this.selectedTourney.offenderPlayers[offendesLen - i];
                let t = new Team();
                t.players.push(p1);
                t.players.push(p2);
                t.teamName = `${p1.playerName} - ${p2.playerName}`;
                this.teams.push(t);
            }
        }
        this.tourneyService.addFixedCoupleEnabled = false;
        this.tourneyService.addFixedCoupleCounter = -1;
        this.selectedTourney.teams = this.teams;
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () => this.onTeamUpdate(this.teams[0]));
    }
    
    private generateChaosTeams(): Team[] {
        const teamList: Team[] = [];

        // 1. Shuffle helper to ensure randomness
        const shuffle = (array: Player[]) => array.sort(() => Math.random() - 0.5);

        let defenders = shuffle([...this.selectedTourney.defenderPlayers]);
        let offenders = shuffle([...this.selectedTourney.offenderPlayers]);
        let jollies = shuffle([...this.selectedTourney.jollyPlayers]);

        // 2. Equalize lists using Jolly players
        while (defenders.length < offenders.length && jollies.length > 0) {
            defenders.push(jollies.pop()!);
        }
        while (offenders.length < defenders.length && jollies.length > 0) {
            offenders.push(jollies.pop()!);
        }

        // 3. Create pairs based on the smaller list size
        const pairCount = Math.min(defenders.length, offenders.length);

        for (let i = 0; i < pairCount; i++) {
            const team = new Team();
            team.id = i + 1;
            team.teamName = `${defenders[i].playerName} - ${offenders[i].playerName}`;
            team.players = [defenders[i], offenders[i]];
            teamList.push(team);
        }

        // 4. Handle the "N+1" scenario (The Remainder)
        // If one list is still longer, add those players to the LAST team created
        const leftovers = defenders.length > offenders.length 
            ? defenders.slice(pairCount) 
            : offenders.slice(pairCount);

        const evenLen = Math.floor(leftovers.length / 2);
        for( let i=0; i<evenLen; i++ ) {
            let p1 = leftovers[i];
            let p2 = leftovers[evenLen - i - 1];
            let t = new Team();
            t.players.push(p1);
            t.players.push(p2);
            t.teamName = `${p1.playerName} - ${p2.playerName}`;
            teamList.push(t);
        }    

        if( leftovers.length % 2 == 1 ) {
            const lastTeam = teamList[teamList.length - 1];
            const oddPlayer = leftovers[leftovers.length-1];
            lastTeam.players.push(oddPlayer);
            lastTeam.teamName = lastTeam.teamName + " + " + oddPlayer.playerName;
        }    

        this.tourneyService.createChaosDisabled = true;
        
        return teamList;
    }

    public printTeams() {
        this.teamService.printTeams(this.selectedTourney)
    }

     
    filterTeams(event: any) {
        const query = event.query.toLowerCase();
        this.filteredTeams = this.getAvailableTeams().filter(t =>
            t.teamName.toLowerCase().includes(query)
        );
    }
        
    private getAvailableTeams(): Team[] {
        const used = this.getUsedIds();
        return this.allTeams.filter(p => !used.has(p.id));
    }

    private getUsedIds(): Set<number | null> {
        return new Set([
            ...this.teams.map(p => p.id)
        ]);
    }

    addTeam() {
        if (!this.selectedTeamToAdd) {
            return;
        }
        this.teamToAdd = null;
        // CASE 1: User selected an existing Player object
        if (typeof this.selectedTeamToAdd === 'object') {
            this.teamToAdd = this.selectedTeamToAdd;
        } else { // CASE 2: User typed a new name (string)
            const typedName = (this.selectedTeamToAdd as string).trim();
            if (!typedName) {
                return;
            }

            // Check if already exists (case insensitive)
            const existing = this.teams.find(p =>
                p.teamName?.toLowerCase() === typedName.toLowerCase()
            );

            if (existing) {
                this.teamToAdd = existing;
            } else {  // Create new Team
                this.teamToAdd = new Team();
                this.teamToAdd.teamName = typedName;
                // this.saveTourneyTeam();
            }
        }
        
        // Avoid duplicates across lists
        if (this.isTeamUsed(this.teamToAdd)) {
            return;
        }
        this.selectedTeam = this.teamToAdd;
        this.teams.push(this.teamToAdd);

        this.saveTourneyTeam();
        this.selectedTeamToAdd = null;
        this.filteredTeams = [];
        this.teams = [...this.teams].sort((a, b) => 
            a.teamName.localeCompare(b.teamName)
        );
        this.tourneyService.createChaosDisabled = false;
    }

    private saveTourneyTeam() {
        this.selectedTeam.teamName = this.selectedTeam.teamName.toUpperCase();
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
        subscriber.subscribe(tvo => this.next(tvo), e => this.subscribeErrorHandler(e), () =>{} );
    }
    
    isTeamUsed(team: Team): boolean {
        return (
            this.teams.some(t => team.id != null && t.id === team.id )
        );
    }

    isEditing(team: Team): boolean {
        return this.editingTeamId === team.id;
    }

    enableEdit(team: Team) {
        // If your items don't have IDs yet, you could fall back to tracking by object reference
        this.editingTeamId = team.id ?? null; 
    }

    saveAndDisableEdit(team: Team) {
        // 1. Call your backend service to persist the change here
        // e.g., this.teamService.updateTeam(team).subscribe();

        this.selectedTeam = team;
        this.saveTourneyTeam();
        
        // 2. Turn off editing mode
        this.editingTeamId = null; 
    }
}
