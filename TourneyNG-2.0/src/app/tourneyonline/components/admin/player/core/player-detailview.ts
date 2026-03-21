import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractDetailView } from 'app/tourneyonline/components/common/abstract-detailview';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { Observable, of } from 'rxjs';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { PlayerVO } from 'app/tourneyonline/domain/player-vo';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './player-detailview.html',
    standalone: false
})
export class PlayerDetailView extends AbstractDetailView {
    selectedPlayer: Player = new Player();

    playerAlreadyExists: boolean = false;
    onSavePlayerError: boolean = false;
    newPlayerVO: PlayerVO = new PlayerVO();

    autoCompletePlayerName: Player = new Player(); 
    filteredPlayersSingle: Player[] = [];
    isRenaming = false;
    newName = '';
    tourneyTeams: boolean | undefined;    
    
    constructor(
        protected override location: Location,
        protected override tourneyService: TourneyService,
        protected clientService: ClientService,
        protected countryService: CountryService,
        protected loginService: LoginService,
        protected teamService: TeamService,
        public playerService: PlayerService,
        private route: ActivatedRoute
    ) { 
        super(tourneyService, location);
    }

    override ngOnInit() {
        console.log("PlayerDetailView.ngOnInit() ");

        super.ngOnInit();
        this.route.queryParams.subscribe(params => {
            this.tourneyTeams = params['tourneyTeams'] === 'true';
        });        
        this.countries = this.countryService.countries;
        this.selectedPlayer = this.playerService.selectedPlayer;
        this.autoCompletePlayerName = this.selectedPlayer;        
        this.playerAlreadyExists = false;

        if(this.playerService.newPlayer) {
            this.selectedPlayer.playerName = "";
            this.selectedPlayer.id = null; 
        }
    }

    enabledModify() : boolean {
        if(this.loginService.isOperator()) {
            let un = this.loginService.userLogged.username;
            let tn = this.teamService.selectedTeam.teamName;
            let team = this.selectedTourney.teams.find(t => t.teamName == tn);
            if( team ) {
                let index = team.operators.indexOf(un);
                if( index != -1) {
                    return true;
                }
            }
        }
        if( this.playerService.readOnly ) {
            return false;
        }
        return true;
    }

    enableSaveButton() : string {
        if(this.playerService.newPlayer ) {
            return "";
        }        
        let n : String = this.selectedPlayer.playerName;
        if( n == undefined  ) {
            return  "disabled";
        }
        return   n.trim() == "" ? "disabled" : "";
    }
    
    prepareRename() {
        this.newName = this.autoCompletePlayerName.playerName;
        this.isRenaming = true;
    }
    
    saveRename() {
        if (!this.newName || this.newName.trim() === '') {
            return;
        } 
        this.doSavePlayer(this.newName);
    }

    savePlayer() {
        if (typeof this.autoCompletePlayerName === 'string') {
            this.selectedPlayer.playerName= this.autoCompletePlayerName;
        } else {
            // This is an EXISTING team object
            const existingId = this.autoCompletePlayerName.id;
            let index = this.playerService.playerPool.findIndex( t => t.id === existingId);
            if( index !== -1 ) {
                this.selectedPlayer.playerName = this.playerService.playerPool[index].playerName;
            }
        }
        this.doSavePlayer(this.selectedPlayer.playerName);
    }

    private doSavePlayer(newPlayerName : string) {
        this.selectedPlayer.playerName = newPlayerName;
        this.selectedPlayer.clientId = this.clientService.selectedClient == undefined ? null : this.clientService.selectedClient.id;
        this.newPlayerVO = {
            id: this.selectedPlayer.id
            , playerName: newPlayerName
            , country: this.selectedPlayer.country
            , clientId: this.selectedPlayer.clientId
            , json: JSON.stringify(this.selectedPlayer)
        };
        this.playerAlreadyExists = false;
        this.onSavePlayerError = false;
        const subscriber = this.playerService.savePlayer(this.newPlayerVO, this.savePlayerErrorHandler('Create player operation'));
        subscriber.subscribe(cs => this.newPlayerNext(cs), e => this.subscribeErrorHandler(e), () => this.onSaveComplete( ));
    }
     
    private newPlayerNext(tvo:PlayerVO) {
        console.log("newPlayerNext()");
        console.log(tvo.json);
        this.selectedPlayer.id = tvo.id;
    }

    protected override subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSavePlayerError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }


    private onSaveComplete( ) {
        console.log("Entering onSaveComplete()");
        if( !this.onSavePlayerError ) {
            const isNewPlayer : boolean = this.newPlayerVO.id == null;
            let ppo: Player = JSON.parse(this.newPlayerVO.json);
            ppo.country = this.newPlayerVO.country;
            ppo.clientId = this.newPlayerVO.clientId;
            ppo.playerName = this.newPlayerVO.playerName;
            if(isNewPlayer) {
                this.playerService.playerPool.push(ppo);
            }
            if( this.teamService.selectedTeam ) {
                const player = this.teamService.selectedTeam.players.find( e => e.playerName == this.newPlayerVO.playerName); 
                if( !player ) {
                    this.teamService.selectedTeam.players.push(ppo);
                    this.teamService.updateExistingTeam(this.teamService.selectedTeam
                        , () => this.onSaveTeamComplete());
                }
            }
            this.playerService.newPlayer = false;

            super.goBack();
        }
    }
    
    private onSaveTeamComplete(): void {
        console.log("Entering onSaveTeamComplete()");
    }

    private savePlayerErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering savePlayerErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            this.onSavePlayerError = true;
            if( res.error == undefined || res.error.errorCode == undefined || res.error.errorCode == "InternalServerError") {
                this.badRequest = true;
                return of(result as T);
            } 
            if( res.error.errorCode == "PlayerAlreadyExists" ) {
                this.playerAlreadyExists = true;
                return of(result as T);
            }
            return of(result as T);
        };
    }
 
    override onError(n:any): any {
        let msgerr : string = 'Creazione/Modifica giocatore fallita';
        console.error(msgerr);
    }

    loadPlayersCompleteMethod(event: any) {
        if (!event.query) {
            this.filteredPlayersSingle = [...this.playerService.playerPool]; // Show all when dropdown clicked
        } else {
            const query = event.query.toLowerCase();
            this.filteredPlayersSingle = this.playerService.playerPool.filter(t =>
                t.playerName.toLowerCase().includes(query)
            );
    
            const exactMatch = this.filteredPlayersSingle.some(t => t.playerName.toLowerCase() === query.toLowerCase());
            if (!exactMatch && query.length > 2) {
                const p : Player = new Player();
                p.id = -1;
                p.playerName = query;
                p.isNew = true;
                this.filteredPlayersSingle.push(p);
            }
        }   
    }

    onPlayerSelect(event: any) {
        // 'event' is the object selected from the list
        const playerId = event.id;
        if (event.isNew || playerId === -1) {
            this.prepareNewPlayer(event.playerName);
        } else {
            this.filteredPlayersSingle = this.playerService.playerPool.filter(p => p.id == playerId);
            if(this.filteredPlayersSingle && this.filteredPlayersSingle.length > 0) {
                let partialTeam = this.filteredPlayersSingle[0];
                let index = this.playerService.playerPool.findIndex( t => t.playerName === partialTeam.playerName );
                if( index !== -1 ) {
                    this.selectedPlayer = this.playerService.playerPool[index];
                }
            }
        }
    }
        
    private prepareNewPlayer(palyerName: string) {
        this.selectedPlayer = new Player();
        this.selectedPlayer.playerName = palyerName;
    }
}
