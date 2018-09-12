import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';

import {Message} from '../../../../components/common/api';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CountryService } from '../../../service/countryservice';
import { Country } from '../../../domain/country';
import { Discipline } from '../../../domain/discipline';
import { TourneyType } from '../../../domain/tourneyType';


@Component({
    templateUrl: './tourney-detailview.html',
    providers: [ConfirmationService],
    styles: [`        
        .ui-g label {
          font-weight: bold;
          margin-top: .25em;
          display: block;
        }
        .date-width {
            width: 30mm;
        }
        .time-width {
            width: 20mm;
        }
  `]
})
export class TourneyDetailView implements OnInit {
    selectedTourney: Tourney;

    tourneyDate: Date;

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    countries: Country[];
    filteredCountriesSingle: Country[];

    disciplines: Discipline[];

    gender: string = "tourney";

    levels= [{label:"Quarti",value:4}
        ,{label:"Ottavi",value:8}
        ,{label:"Sedicesimi",value:16}
    ];
    eliminationLevel:number=4;

    it: any;

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private confirmationService: ConfirmationService,
        private tourneyService: TourneyService,
        private countryService: CountryService,
    ) {}

    ngOnInit() {

        console.log("TourneyDetailView.ngOnInit() ");

        let today = new Date();

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.countryService.loadCountries().subscribe(c => {
            this.countries = c;
        });
        this.tourneyService.loadDisciplines().subscribe(t => {
            this.disciplines = t;
        });


        if(this.tourneyService.newTourney) {
            this.tourneyDate = today;
            this.selectedTourney.tourneyType = TourneyType.Score;
            this.selectedTourney.matchBalanceScores = 0;
            this.selectedTourney.matchLoserScores = 0;
            this.selectedTourney.matchWinnerScores = 3;
            this.selectedTourney.teamNo = 1;
            this.selectedTourney.roundNo = 1;
            this.selectedTourney.playoffNo = 0;
            this.selectedTourney.teams = undefined;
            this.selectedTourney.pointsNeededToWin=9;
            this.selectedTourney.pointsGoldenGoalTieBreakWin = 2;
            this.selectedTourney.pointsGoldenGoalTieBreakDefeat = 1;
            this.selectedTourney.phases.push("round");
            this.selectedTourney.phases.push("elimination");
            this.tourneyDate = new Date();
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

            'date': new FormControl(this.tourneyDate),

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
            'eliminationLevel': new FormControl(this.selectedTourney.eliminationLevel),            
        });

        this.it = {
        	firstDayOfWeek: 1,
        	dayNames: [ "domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato" ],
        	dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
        	dayNamesMin: [ "D","L","M","M","G","V","S" ],
            monthNames: [ "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre"
            ,"Novembre","Dicembre" ],
        	monthNamesShort: [ "Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic" ],
            today: 'Oggi',
            clear: 'Clear'
        };
        
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        
        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);

    }

    search(event) {
        let query = event.query;
        this.filteredCountriesSingle =this.filterCountry(query, this.countries);
    }

    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    filterCountry(query, countries: Country[]) : Country[] {
        let filtered : Country[] = [];
        for(let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if(country.city.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedTourney.tourneyName);
        let popup = 'Sicuro di voler rimuovere il torneo: ';

        if(confirm(popup + this.selectedTourney.tourneyName + "?")) {
            this.tourneyService.deleteTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
            // console.log("Rimosso il torneo: " + this.selectedTourney.tourneyName);
          }
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.country = this.tourneyFormGroup.get('country').value;

        this.tourneyDate = this.tourneyFormGroup.get('date').value;
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
        this.selectedTourney.eliminationLevel = this.tourneyFormGroup.get('eliminationLevel').value;

        console.log("selectedTourney.phases: " + this.selectedTourney.phases);

        if(this.tourneyService.newTourney) {
            this.tourneyService.addTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());  
        } else  {
            this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.onComplete());
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

    delete() {
        this.confirmationService.confirm({
            message: 'Vuoi rimuovere il torneo dal database?',
            header: 'Conferma la rimozione',
            icon: 'pi pi-info-circle',
            accept: () => {
                this.doDelete();
                this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
            },
            reject: () => {
                this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
            }
        });
    }

    next(n:any) {
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

    onComplete() {
        this.goBack();  
    }

    goBack(): void {
        this.location.back();
    }
}
