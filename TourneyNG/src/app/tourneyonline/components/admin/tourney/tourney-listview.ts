import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractTourneyListView } from '../../common/abstract-tourney-listview';
import { DateFormatPipe } from '../../common/date-format-pipe';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { LoginService } from 'app/tourneyonline/service/login-service';

const REDIRECT = 'admintourney/dv';
@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {
    tourneyFormGroup: FormGroup;
    fromDate: Date;
    toDate  : Date;

    clientOptions: Combobox[];
    userLogged: boolean;

    constructor(private fb: FormBuilder
        , protected tourneyService: TourneyService
        , private clientService : ClientService
        , private loginService : LoginService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(REDIRECT, tourneyService, router, loc, dfp);
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit() ");

        super.ngOnInit();

        this.fromDate = new Date(this.selectedTourney.datetime);
        this.toDate = new Date();
        this.clientOptions = this.clientService.clientOptions;

        this.userLogged = this.loginService.userLogged;

        this.tourneyFormGroup = this.fb.group({
            'selectedClientOption': new FormControl(this.clientService.selectedClientOption),
            'fromDate': new FormControl(this.fromDate),
            'toDate': new FormControl(this.toDate),
       });
    }

    onSearch(value: string) {

        this.clientService.selectedClientOption = this.tourneyFormGroup.get('selectedClientOption').value;

        this.fromDate = this.tourneyFormGroup.get('fromDate').value;
        this.toDate   = this.tourneyFormGroup.get('toDate').value;

        const subsbr = this.tourneyService.loadTourneys(this.fromDate, this.toDate);
        subsbr.subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onComplete());
    }

    create() {
        this.tourneyService.selectedTourney = this.selectedTourney;

        let dt = this.dfp.transform(new Date());
        this.selectedRow = {t:this.selectedTourney, rowNumber: 1, tourneyName: "", datetime: dt};

        this.tourneyService.newTourney = true;
        this.gotoDetailView();
    }

    doDelete(tourney: any) {
        console.log("doDelete(): " + tourney.tourneyName);
        let popup = 'Sicuro di voler rimuovere il torneo: ' + tourney.tourneyName + "?";

        if(confirm(popup)) {
            this.tourneyService.deleteTourney(tourney.t).subscribe(n => this.next(n), e => this.onError(e));
            let index: number = this.tourneys.indexOf(tourney.t);
            if(index > -1) {
                this.tourneys.splice(index, 1);
                this.rows.splice(index, 1);
            }
        }
    }

    protected filter(tourneys: Tourney[]): Tourney[] {
        return tourneys;
    }
}
