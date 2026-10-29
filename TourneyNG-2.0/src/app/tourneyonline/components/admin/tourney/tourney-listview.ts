import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AbstractTourneyListView } from 'app/tourneyonline/components/common/abstract-tourney-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { NewTourneyDetailView } from './new-tourney-detailview';
import { TourneyDetailView } from './tourney-detailview';
import { DisciplineService } from 'app/tourneyonline/service/discipline-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Player } from 'app/tourneyonline/domain/player';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

@Component({
    templateUrl: './tourney-listview.html',
    standalone: false
})
export class TourneyListView extends AbstractTourneyListView {
    tourneyFormGroup: FormGroup;
    fromDate: Date = new Date();
    toDate  : Date = new Date();

    clientOptions: Combobox[] = [];
    clientsCBEnabled: boolean = false;
    onDeleteTourneyError: boolean = false;

    username: string = "";

    // Dialog state
    displayCloneDialog: boolean = false;
    newTourneyName: string = ''; // The draft name

    constructor(private fb: FormBuilder
        , protected override tourneyService: TourneyService
        , protected override countryService: CountryService
        , private   clientService : ClientService
        , private   loginService : LoginService
        , protected override playerService : PlayerService
        , protected override teamService : TeamService
        , public override    router: Router
        , public    loc: Location
        , protected dfp: DateFormatPipe
        , protected override disciplineService: DisciplineService) 
    { 
        super(TourneyDetailView.redirect, tourneyService, countryService, playerService, teamService, disciplineService, router, loc, dfp);
        this.tourneyFormGroup = this.fb.group({
            username: [''],
            password: ['']
        });
    }

    override ngOnInit() {
        console.log("TourneyListView.ngOnInit() ");

        super.ngOnInit();

        this.fromDate = new Date();
        this.toDate = new Date();
        this.clientOptions = this.clientService.clientOptions;

        this.clientsCBEnabled = this.loginService.isUserLogged && this.clientOptions.length > 1 ? true : false;
        this.username = this.loginService == undefined ? "" : this.loginService.userLogged.username;

        this.tourneyFormGroup = this.fb.group({
            'selectedClientOption': new FormControl(this.clientService.selectedClientOption),
            'fromDate': new FormControl(this.fromDate),
            'toDate': new FormControl(this.toDate),
       });
    }
 
    onRowSelect(event : any) {
        console.log("Entering onRowSelect()");
        console.log(event.data);
        this.tourneyService.newTourney = false;
        // this.teamService.readOnly = false;
        this.tourneyService.loadTourneyById(event.data.id, () => this.onLoadTourneyComplete(), e => this.serverUnreachableHandler(e));
    }

    private onLoadTourneyComplete() {
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.alignToTeamAndPlayerDetails();
    }

    /**
     * Aligns the global teams and players details to the corresponding teams and players in the
     * selected trourney. The alignment is on the base of their names and is needed becouse of
     * the possibility the teams and players could be change their data as addresses, phone number
     * and email.
     */
    private alignToTeamAndPlayerDetails(): any {
        if(this.selectedTourney.wizardModeIndex != -1) {
            this.teamService.loadAllTeams(()=>this.onLoadTeamComplete());
        } else {
            this.gotoDetailView();
        }
    }

    private onLoadTeamComplete(): void {
        this.playerService.loadAllPlayers(()=>this.onLoadPlayerComplete());
        this.alignTeams();
    }
    
    private alignTeams(): any {
        for( let team of this.selectedTourney.teams ) {
            let teamFound = this.teamService.teamPool.find( t => t.teamName == team.teamName );
            if( teamFound != undefined ) {
                team = {...this.copyTeam(team, teamFound)};
            }
        }
        this.selectedTourney.teams.sort( (t1,t2) => t1.teamName.localeCompare(t2.teamName) );
    }
    
    private onLoadPlayerComplete(): void {
        for( let team of this.selectedTourney.teams ) {
            for( let player of team.players ) {
                if(player == null) {
                    continue;
                }
                let playerFound = this.playerService.playerPool.find( p => p.playerName == player.playerName );
                if( playerFound != undefined ) {
                    player = this.copyPlayer(player, playerFound);
                }
            }
        }

        this.gotoDetailView();
    }

    private copyPlayer(player: Player, pf:  Player):  Player {
        player.id = pf.id;
        player.country = pf.country;
        player.address = pf.address;
        player.email = pf.email;
        player.phoneNumber = pf.phoneNumber;
        return player;
    }

    private copyTeam(team: Team, teamFound: Team): Team    {     
        team.id = teamFound.id;
        team.address = teamFound.address;
        team.country = teamFound.country;
        return team;
    }

    create() {
        this.router.navigate([NewTourneyDetailView.redirect]);
    }

    doDelete(tourney: any) {
        console.log("doDelete(): " + tourney.tourneyName);
        let popup = 'Sicuro di voler rimuovere il torneo: ' + tourney.tourneyName + "?";
        this.onDeleteTourneyError = false;
        if(confirm(popup)) {
            const observer = this.tourneyService.deleteTourney(tourney, this.deleteTourneyErrorHandler("Delete tourney operation"));
            observer.subscribe(n => this.next(n), e => this.onError(e), () => this.doDeleteComplete(tourney));
        }
    }
    doDeleteComplete(tourney : Tourney): any {
        let deletedTourney = this.tourneys.find( t => t.tourneyName == tourney.tourneyName );
        if( deletedTourney != undefined ) {
            let index: number = this.tourneys.indexOf(deletedTourney);
            if(index > -1) {
                this.tourneys.splice(index, 1);
                this.tourneyList.splice(index, 1);
            }
        }
    }
        
    private deleteTourneyErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering deleteTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
      
            this.onDeleteTourneyError = true;
      
            return of(result as T);
        };
    }

    // protected filter(tourneys: Tourney[]): Tourney[] {
    //     return tourneys;
    // }
    
    doClone( tourney: Tourney ) {
        console.log("doClone(): " + tourney.tourneyName);
        this.selectedTourney = tourney;
        this.newTourneyName = `${tourney.tourneyName} (Copy)`; 
        this.displayCloneDialog = true;
    }

    saveClone() {
        if (this.newTourneyName.trim()) {
            this.displayCloneDialog = false;
            this.tourneyService.loadTourneyById(this.selectedTourney.id, () => this.onLoadTourneyForCloneComplete(), e => this.serverUnreachableHandler(e));
        } 
    }

    onLoadTourneyForCloneComplete(): void {
        this.selectedTourney = this.tourneyService.selectedTourney;
        const clonedFromTourneyName : string = this.selectedTourney.tourneyName;
        // this.selectedTourney.id = null;
        this.selectedTourney.tourneyName = this.newTourneyName;
        let t = {...this.selectedTourney};
        t.teams = [];
        t.roundVO.rounds = [];
        t.defenderPlayers = [];
        t.offenderPlayers = [];
        t.jollyPlayers = [];
        t.eliminatoryLevels = [];
        t.wizardModeIndex = 0;
        
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(t, this.clientService.selectedClient, true);
        tvo.clonedFromTourneyName = clonedFromTourneyName;
        tvo.id = null;
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => this.saveTourneyNext(cs), e => this.subscribeErrorHandler(e), () => {});
    }

    private saveTourneyNext(cs: TourneyVO): void {
        // this.selectedTourney = null;
        this.ngOnInit();
    }
}
