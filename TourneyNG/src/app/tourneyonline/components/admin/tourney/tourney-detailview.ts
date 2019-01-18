import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { AbstractDetailView } from '../../common/abstract-detailview';
import { PhaseType, EliminatoryMode, AccessMode, TourneyType, TeamSortType, Direction } from '../../../domain/enumerations';
import { Message } from 'app/components/common/api';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Discipline } from 'app/tourneyonline/domain/discipline';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Round } from 'app/tourneyonline/domain/round';
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Router } from '@angular/router';

const REDIRECT_TEAM_DV     = 'admintourney/dv/team';
const REDIRECT_ADD_TEAM_DV = 'admintourney/dv/addteam';

@Component({
    templateUrl: './tourney-detailview.html',
})
export class   TourneyDetailView extends AbstractDetailView {

    selectedTourney: Tourney;

    tourneyDate: Date;

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    disciplines: Discipline[];

    gender: string = "tourney";

    fullAddress: string;

    isOnewayRound: string;
    isOnewayPlayoff: string;
    isAllMatches: string;
    isDaily: string;
    allMatchesEnabled: boolean = true;
    bestOffWinner: number;

    activeIndex: number;

    selectedTeam: Team;
    tourneyTeams: Team[];
    teamCols: { field: string; header: string; }[];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        protected playerService: PlayerService,
        protected teamService: TeamService,
        private router: Router
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");
        this.activeIndex = this.tourneyService.selectedTabIndex;

        super.ngOnInit();
        
        let today = new Date();

        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });

        this.selectedTourney = this.tourneyService.selectedTourney;

        if(this.tourneyService.newTourney) {
            this.selectedTourney={};
            this.selectedTourney.id = this.tourneyService.getSequenceNumber(); 

            this.tourneyDate = today;
            this.selectedTourney.tourneyName = "";
            this.selectedTourney.isDaily=true ;

            this.selectedTourney.address = "";
            this.selectedTourney.tourneyType = TourneyType.Score;
            this.selectedTourney.matchBalanceScores = 0;
            this.selectedTourney.matchWinnerScores = 3;
            this.selectedTourney.access = AccessMode.PU;
            
            this.selectedTourney.objectives = [];
            this.selectedTourney.rounds = [];
            this.selectedTourney.playoffs = [];
            this.selectedTourney.eliminatoryLevels = [];
            this.selectedTourney.teams = [];
            this.selectedTourney.players = [];
            this.selectedTourney.playoffs = [];

            this.selectedTourney.pointsNeededToWin=9;
            this.selectedTourney.pointsGoldenGoalTieBreakWin = 2;
            this.selectedTourney.pointsGoldenGoalTieBreakDefeat = 1;

            this.selectedTourney.maxMatchesPerMeeting = 1;
            this.selectedTourney.isAllMatches = false;
            this.selectedTourney.playersPerTeam = 1;

            this.selectedTourney.phases=[PhaseType.R];
            this.selectedTourney.phases.push(PhaseType.E);   
            
            this.selectedTourney.eliminatoryMode = EliminatoryMode.A
            this.selectedTourney.teamSortType = TeamSortType.O;

            this.selectedTourney.isOnewayRound=true ;
            this.selectedTourney.isOnewayPlayoff=true;
        } else {
            this.tourneyDate = new Date(this.selectedTourney.datetime);
        }

        this.tourneyTeams = this.selectedTourney.teams;

        this.teamCols = TeamService.cols;

        this.isOnewayRound = this.selectedTourney.isOnewayRound ? "true" : "false";
        this.isOnewayPlayoff = this.selectedTourney.isOnewayPlayoff ? "true" : "false";

        this.isAllMatches = this.selectedTourney.isAllMatches ? "true" : "false";
        this.isDaily = this.selectedTourney.isDaily ? "true" : "false";

        if(this.selectedTourney.country != undefined ) {
            this.fullAddress = this.selectedTourney.address + " - " 
                + this.selectedTourney.country.zipCode + " " + this.selectedTourney.country.city
                + " (" + this.selectedTourney.country.provinceCode +")";
        }

        if(this.selectedTourney.maxMatchesPerMeeting == 1) {
            this.allMatchesEnabled = false;
        }

        let spin = this.selectedTourney.maxMatchesPerMeeting;
        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);

        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'isDaily': new FormControl(this.isDaily),

            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedTourney.country),

            'tourneyDate': new FormControl(this.tourneyDate),
            'access': new FormControl(this.selectedTourney.access),

            'discipline': new FormControl(this.selectedTourney.discipline),

            'tourneyType': new FormControl(this.selectedTourney.tourneyType),
            'raceDuration': new FormControl(this.selectedTourney.raceDuration),
            
            'pointsNeededToWin': new FormControl(this.selectedTourney.pointsNeededToWin),
            
            'matchWinnerScores': new FormControl(this.selectedTourney.matchWinnerScores),
            'matchBalanceScores': new FormControl(this.selectedTourney.matchBalanceScores),

            'pointsGoldenGoalTieBreakWin': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakWin),
            'pointsGoldenGoalTieBreakDefeat': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakDefeat),

            'phases': new FormControl(this.selectedTourney.phases, Validators.compose([Validators.required])),

            'isOnewayRound': new FormControl(this.isOnewayRound),
            'isOnewayPlayoff': new FormControl(this.isOnewayPlayoff),

            'maxMatchesPerMeeting': new FormControl(this.selectedTourney.maxMatchesPerMeeting),
            'isAllMatches': new FormControl(this.isAllMatches),
            'playersPerTeam': new FormControl(this.selectedTourney.playersPerTeam),
       });
    }

    addTeams() {
        this.router.navigate([REDIRECT_ADD_TEAM_DV]);
    }

    doTeamDelete(team: Team) {
        console.log("doTeamDelete(): " + team.teamName);
        let popup = 'Sicuro di voler rimuovere la squadra: ' + team.teamName + "?";

        if(confirm(popup)) {
            let index: number = this.selectedTourney.teams.indexOf(team);
            if(index > -1) {
                this.selectedTourney.teams.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e) );
            }
        }
    }

    onChangeTab(e) {
        let index=e.index;
        console.log("Entering onChangeTab(): tab=" + index);
        this.activeIndex = index;
        this.tourneyService.selectedTabIndex = this.activeIndex;
        
        if(index==2) {
        }
    }

    onTeamRowSelect(event) {
        console.log(event.data);

        this.teamService.selectedTeam = this.selectedTeam;

        this.router.navigate([REDIRECT_TEAM_DV]);
    }

    onOnewayRoundClick() {
        console.log("Entering onOnewayRoundClick()");
        this.selectedTourney.isOnewayRound = true;
        this.onClickRoundManageMeeting(this.selectedTourney.rounds, true, null);
    }

    onRoundtripRoundClick() {
        console.log("Entering onRoundtripRoundClick()");
        this.selectedTourney.isOnewayRound = false;
        this.onClickRoundManageMeeting(this.selectedTourney.rounds, false, null);
    }
    
    onOnewayPlayoffClick() {
        console.log("Entering onOnewayPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = true;
        for(let po of this.selectedTourney.playoffs) {
            this.onClickRoundManageMeeting([po.round], true, po.id);
        }
    }

    onRoundtripPlayoffClick() {
        console.log("Entering onRoundtripPlayoffClick()");
        this.selectedTourney.isOnewayPlayoff = false;
        for(let po of this.selectedTourney.playoffs) {
            this.onClickRoundManageMeeting([po.round], false, po.id);
        }
    }
    
    private onClickRoundManageMeeting(rounds: Array<Round>, isOneway: boolean, poid: number): void {
        for(let r of rounds) {
            if(isOneway) {
                let newMeetings: Array<Meeting> = new Array<Meeting>();
                for(let m of r.meetings) {
                    if(m.direction == Direction.OneWay) {
                        newMeetings.push(m);
                    }
                    if(m.direction == Direction.RoundTrip) {
                        this.tourneyService.deleteMeeting(m);
                    }
                }
                r.meetings = newMeetings;
            } else {
                let newMeetings: Array<Meeting> = new Array<Meeting>();
                for(let m of r.meetings) {
                    let newMeeting: Meeting = this.cloneObject(m);
                    
                    newMeeting.id = this.tourneyService.getSequenceNumber();
                    newMeeting.direction = Direction.RoundTrip;
                    newMeeting.team2 = m.team1;
                    newMeeting.team1 = m.team2;

                    newMeeting.name = newMeeting.team1.teamName + " - " + newMeeting.team2.teamName;
                    
                    newMeetings.push(newMeeting);
                    if(poid == null) {
                        this.tourneyService.addRoundMeetingDb(newMeeting, this.selectedTourney.id, r.id);
                    } else {
                        this.tourneyService.addPlayoffMeetingDb(newMeeting, this.selectedTourney.id, poid);
                    }
                }

                r.meetings = r.meetings.concat(newMeetings);
            }
        }
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    }

    search(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
    }

    onSpinnerChange(event) {
        let spin: number = this.tourneyFormGroup.get('maxMatchesPerMeeting').value;
        if(spin == 1) {
            this.allMatchesEnabled = false;
        } else {
            this.allMatchesEnabled = true;
        }

        this.bestOffWinner = spin % 2 == 0 ? (spin / 2) + 1 : Math.ceil(spin / 2);
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.isDaily   = this.tourneyFormGroup.get('isDaily').value == "true"? true: false;

        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.country = this.tourneyFormGroup.get('country').value;

        this.selectedTourney.access = this.tourneyFormGroup.get('access').value;

        this.tourneyDate = this.tourneyFormGroup.get('tourneyDate').value;
        this.selectedTourney.datetime = this.tourneyDate;

        this.selectedTourney.discipline = this.tourneyFormGroup.get('discipline').value;
        
        this.selectedTourney.tourneyType = this.tourneyFormGroup.get('tourneyType').value;
        this.selectedTourney.raceDuration = this.tourneyFormGroup.get('raceDuration').value;

        this.selectedTourney.pointsNeededToWin = this.tourneyFormGroup.get('pointsNeededToWin').value;

        this.selectedTourney.matchWinnerScores = this.tourneyFormGroup.get('matchWinnerScores').value;
        this.selectedTourney.matchBalanceScores = this.tourneyFormGroup.get('matchBalanceScores').value;

        this.selectedTourney.pointsGoldenGoalTieBreakWin = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakWin').value;
        this.selectedTourney.pointsGoldenGoalTieBreakDefeat = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakDefeat').value;

        this.selectedTourney.phases = this.tourneyFormGroup.get('phases').value;

        this.selectedTourney.isOnewayRound   = this.tourneyFormGroup.get('isOnewayRound').value == "true"? true: false;
        this.selectedTourney.isOnewayPlayoff = this.tourneyFormGroup.get('isOnewayPlayoff').value == "true"? true: false;

        this.selectedTourney.isAllMatches = this.tourneyFormGroup.get('isAllMatches').value == "true"? true: false;
        this.selectedTourney.maxMatchesPerMeeting = this.tourneyFormGroup.get('maxMatchesPerMeeting').value;
        this.selectedTourney.playersPerTeam = this.tourneyFormGroup.get('playersPerTeam').value;
        
        this.selectedTourney.teams = this.tourneyTeams;

        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
        }
        this.tourneyService.newTourney = false;
    }

    containsPhase(value: string) : boolean{
        let phases = this.tourneyFormGroup.get('phases').value;

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }

    atLeastOnePhase() : boolean{
        let phases = this.tourneyFormGroup.get('phases').value;

        if(this.containsPhase(PhaseType.R)) {
            return true;
        }
        if(this.containsPhase(PhaseType.P)) {
            return true;
        }
        if(this.containsPhase(PhaseType.E)) {
            return true;
        }

        return false;
    }

    notAllowedPhases(): boolean {
        let phases = this.tourneyFormGroup.get('phases').value;

        if(!this.containsPhase(PhaseType.R) 
            && this.containsPhase(PhaseType.P)
            && this.containsPhase(PhaseType.E)) 
        {
            return true;
        }
        if(!this.containsPhase(PhaseType.R) 
            && this.containsPhase(PhaseType.P)
            && !this.containsPhase(PhaseType.E)) 
        {
            return true;
        }

        return false;
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newTourney) {
            msgerr = 'Creazione nuovo torneo fallita';
        } else {
            msgerr = 'Modifica torneo fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
        this.tourneyService.newTourney = false;
    }
}
