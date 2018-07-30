import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';

import {Message} from '../../../../components/common/api';

import { Tourney } from '../../../domain/tourney';
import { TourneyService } from '../../../service/tourneyservice';
import { CountryService } from '../../../service/countryservice';
import { Country } from '../../../domain/country';
import { Typology } from '../../../domain/typology';

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

    msgs: Message[] = [];

    tourneyFormGroup: FormGroup;

    submitted: boolean;

    countries: Country[];
    filteredCountriesSingle: Country[];

    typologies: Typology[];

    gender: string = "tourney";

    levels= [{label:"Quarti",value:4}
        ,{label:"Ottavi",value:8}
        ,{label:"Sedicesimi",value:16}
    ];
    eliminationLevel:number=4;

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private confirmationService: ConfirmationService,
        private tourneyService: TourneyService,
        private countryService: CountryService,
    ) {}

    ngOnInit() {

        this.selectedTourney = this.tourneyService.selectedTourney;
        this.countryService.loadCountries().subscribe(c => {
            this.countries = c;
        });
        this.tourneyService.loadTypologies().subscribe(t => {
            this.typologies = t;
        });

        let teamNo = this.selectedTourney.teams==undefined||this.selectedTourney.teams==[]?this.selectedTourney.teamNo:this.selectedTourney.teams.length;

        this.tourneyFormGroup = this.fb.group({
            'tourneyName': new FormControl(this.selectedTourney.tourneyName, Validators.compose([Validators.required])),
            'address': new FormControl(this.selectedTourney.address, Validators.compose([Validators.required])),
            'country': new FormControl(this.selectedTourney.country),
            'date': new FormControl(this.selectedTourney.date, Validators.compose([Validators.required])),
            'time': new FormControl(this.selectedTourney.time, Validators.compose([Validators.required])),
            'typology': new FormControl(this.selectedTourney.typology),

            'terminationType': new FormControl(this.selectedTourney.terminationType),
            'raceDuration': new FormControl(this.selectedTourney.raceDuration),
            'pointsForWin': new FormControl(this.selectedTourney.pointsForWin),
            'pointsForParity': new FormControl(this.selectedTourney.pointsForParity),
            'pointsForDefeat': new FormControl(this.selectedTourney.pointsForDefeat),
            'goldenGoal': new FormControl(this.selectedTourney.goldenGoal),
            'pointsGoldenGoalWin': new FormControl(this.selectedTourney.pointsGoldenGoalWin),
            'pointsGoldenGoalDefeat': new FormControl(this.selectedTourney.pointsGoldenGoalDefeat),

            'gender': new FormControl(this.selectedTourney.gender),
            'phases': new FormControl(this.selectedTourney.phases),
            'roundNo': new FormControl(this.selectedTourney.roundNo),
            'teamNo': new FormControl(teamNo),
            'eliminationLevel': new FormControl(this.selectedTourney.eliminationLevel),
        });
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
            console.log("Rimosso il torneo: " + this.selectedTourney.tourneyName);
          }
    }

    onSubmit(value: string) {
        this.submitted = true;

        this.selectedTourney.tourneyName = this.tourneyFormGroup.get('tourneyName').value;
        this.selectedTourney.address = this.tourneyFormGroup.get('address').value;
        this.selectedTourney.country = this.tourneyFormGroup.get('country').value;
        this.selectedTourney.date = this.tourneyFormGroup.get('date').value;
        this.selectedTourney.time = this.tourneyFormGroup.get('time').value;
        this.selectedTourney.typology = this.tourneyFormGroup.get('typology').value;
        
        this.selectedTourney.terminationType = this.tourneyFormGroup.get('terminationType').value;
        this.selectedTourney.raceDuration = this.tourneyFormGroup.get('raceDuration').value;
        this.selectedTourney.pointsForWin = this.tourneyFormGroup.get('pointsForWin').value;
        this.selectedTourney.pointsForParity = this.tourneyFormGroup.get('pointsForParity').value;
        this.selectedTourney.pointsForDefeat = this.tourneyFormGroup.get('pointsForDefeat').value;
        this.selectedTourney.goldenGoal = this.tourneyFormGroup.get('goldenGoal').value;
        this.selectedTourney.pointsGoldenGoalWin = this.tourneyFormGroup.get('pointsGoldenGoalWin').value;
        this.selectedTourney.pointsGoldenGoalDefeat = this.tourneyFormGroup.get('pointsGoldenGoalDefeat').value;

        this.selectedTourney.gender = this.tourneyFormGroup.get('gender').value;
        this.selectedTourney.phases = this.tourneyFormGroup.get('phases').value;
        this.selectedTourney.teamNo = this.tourneyFormGroup.get('teamNo').value;
        this.selectedTourney.roundNo = this.tourneyFormGroup.get('roundNo').value;
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

        console.log("selectedTourney.phases: " + phases);

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
