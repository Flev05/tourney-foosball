import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import { Message } from '../../../../components/common/api';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CountryService } from '../../../service/countryservice';
import { Discipline } from '../../../domain/discipline';
import { TourneyType } from '../../../domain/tourneyType';
import { AbstractDetailView } from '../../common/abstract-detailview';


@Component({
    templateUrl: './tourney-detailview.html',
})
export class TourneyDetailView extends AbstractDetailView {

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
    ) { 
        super(tourneyService, location, countryService);
    }

    selectedTourney: Tourney;

    tourneyDate: Date;

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    disciplines: Discipline[];

    gender: string = "tourney";

    ngOnInit() {
        console.log("TourneyDetailView.ngOnInit() ");

        super.ngOnInit();
        
        let today = new Date();

        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });

        this.selectedTourney = this.tourneyService.selectedTourney;

        if(this.tourneyService.newTourney) {
            this.tourneyDate = today;
            this.selectedTourney.tourneyName = "";
            this.selectedTourney.address = "";
            this.selectedTourney.tourneyType = TourneyType.Score;
            this.selectedTourney.matchBalanceScores = 0;
            this.selectedTourney.matchLoserScores = 0;
            this.selectedTourney.matchWinnerScores = 3;
            this.selectedTourney.teamNo = 1;
            this.selectedTourney.roundNo = 1;
            this.selectedTourney.playoffNo = 0;

            this.selectedTourney.finals = [{}];
            this.selectedTourney.rounds = [{}];
            this.selectedTourney.playoffs = [{}];
            this.selectedTourney.eliminations = [{}];
            this.selectedTourney.teams = [{}];
            this.selectedTourney.players = [{}];

            this.selectedTourney.pointsNeededToWin=9;
            this.selectedTourney.pointsGoldenGoalTieBreakWin = 2;
            this.selectedTourney.pointsGoldenGoalTieBreakDefeat = 1;
            this.selectedTourney.phases=["round"];
            this.selectedTourney.phases.push("elimination");
        } else {
            this.tourneyDate = new Date(this.selectedTourney.dateInMillis);
        }

        let teamNo = 
        this.selectedTourney.teams===undefined
        // this.selectedTourney.teams==[]
        ?this.selectedTourney.teamNo
        :this.selectedTourney.teams.length;

        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedTourney.country),

            'tourneyDate': new FormControl(this.tourneyDate),

            'discipline': new FormControl(this.selectedTourney.discipline),

            'tourneyType': new FormControl(this.selectedTourney.tourneyType),
            'raceDuration': new FormControl(this.selectedTourney.raceDuration),
            
            'pointsNeededToWin': new FormControl(this.selectedTourney.pointsNeededToWin),
            
            'matchWinnerScores': new FormControl(this.selectedTourney.matchWinnerScores),
            'matchLoserScores': new FormControl(this.selectedTourney.matchLoserScores),
            'matchBalanceScores': new FormControl(this.selectedTourney.matchBalanceScores),

            'pointsGoldenGoalTieBreakWin': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakWin),
            'pointsGoldenGoalTieBreakDefeat': new FormControl(this.selectedTourney.pointsGoldenGoalTieBreakDefeat),

            'phases': new FormControl(this.selectedTourney.phases),
            'roundNo': new FormControl(this.selectedTourney.roundNo),
            'playoffNo': new FormControl(this.selectedTourney.playoffNo),
            'teamNo': new FormControl(teamNo),
        });
    }

    search(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedTourney.tourneyName);
        let popup = 'Sicuro di voler rimuovere il torneo: ';

        if(confirm(popup + this.selectedTourney.tourneyName + "?")) {
            this.tourneyService.deleteTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            // console.log("Rimosso il torneo: " + this.selectedTourney.tourneyName);
          }
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.id = this.tourneyService.getSequenceNumber(); 

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.country = this.tourneyFormGroup.get('country').value;

        this.tourneyDate = this.tourneyFormGroup.get('tourneyDate').value;
        this.selectedTourney.dateInMillis = this.tourneyDate.getTime();

        this.selectedTourney.dateAsString = this.tourneyDate.toLocaleDateString();
        this.selectedTourney.timeAsString = this.tourneyDate.toLocaleTimeString();

        this.selectedTourney.discipline = this.tourneyFormGroup.get('discipline').value;
        
        this.selectedTourney.tourneyType = this.tourneyFormGroup.get('tourneyType').value;
        this.selectedTourney.raceDuration = this.tourneyFormGroup.get('raceDuration').value;

        this.selectedTourney.pointsNeededToWin = this.tourneyFormGroup.get('pointsNeededToWin').value;

        this.selectedTourney.pointsGoldenGoalTieBreakWin = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakWin').value;
        this.selectedTourney.pointsGoldenGoalTieBreakDefeat = this.tourneyFormGroup.get('pointsGoldenGoalTieBreakDefeat').value;

        this.selectedTourney.phases = this.tourneyFormGroup.get('phases').value;
        this.selectedTourney.teamNo = this.tourneyFormGroup.get('teamNo').value;
        this.selectedTourney.roundNo = this.tourneyFormGroup.get('roundNo').value;
        this.selectedTourney.playoffNo = this.tourneyFormGroup.get('playoffNo').value;

        console.log("selectedTourney.phases: " + this.selectedTourney.phases);

        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
        }
    }

    containsPhase(value: string) : boolean{
        let phases = this.tourneyFormGroup.get('phases').value;

        // console.log("selectedTourney.phases: " + phases);

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
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
    }
}
