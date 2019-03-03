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
import { PlayerService } from 'app/tourneyonline/service/player-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { NewTourneyDetailView } from './new-tourney-detailview';
import { TourneyDetailView } from './tourney-detailview';

@Component({
    templateUrl: './tourney-listview.html'
})
export class TourneyListView extends AbstractTourneyListView {
    tourneyFormGroup: FormGroup;
    fromDate: Date;
    toDate  : Date;

    clientOptions: Combobox[];
    clientsCBEnabled: boolean;

    constructor(private fb: FormBuilder
        , protected tourneyService: TourneyService
        , private clientService : ClientService
        , private loginService : LoginService
        , protected playerService : PlayerService
        , protected teamService : TeamService
        , public router: Router
        , public loc: Location
        , protected dfp: DateFormatPipe) 
    { 
        super(TourneyDetailView.redirect, tourneyService, playerService, teamService, router, loc, dfp);
    }

    ngOnInit() {
        console.log("TourneyListView.ngOnInit() ");

        super.ngOnInit();

        this.fromDate = new Date();
        this.toDate = new Date();
        this.clientOptions = this.clientService.clientOptions;

        this.clientsCBEnabled = this.loginService.isUserLogged && this.clientOptions.length > 1 ? true : false;

        this.tourneyFormGroup = this.fb.group({
            'selectedClientOption': new FormControl(this.clientService.selectedClientOption),
            'fromDate': new FormControl(this.fromDate),
            'toDate': new FormControl(this.toDate),
       });
    }
    
    onClientChange(cb: Combobox) {
        console.log(cb);

        this.clientService.setSelectedClient(this.clientService.selectedClients.find( c => c.id == cb.value ));
    }

    onSearch(value: string) {

        this.clientService.selectedClientOption = this.tourneyFormGroup.get('selectedClientOption').value;

        this.fromDate = this.tourneyFormGroup.get('fromDate').value;
        this.toDate   = this.tourneyFormGroup.get('toDate').value;

        const subsbr = this.tourneyService.loadTourneys(this.fromDate, this.toDate);
        subsbr.subscribe(t => this.tdbs = t, e => this.onError(e), () => this.onComplete());
    }

    create() {
        this.router.navigate([NewTourneyDetailView.redirect]);
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
