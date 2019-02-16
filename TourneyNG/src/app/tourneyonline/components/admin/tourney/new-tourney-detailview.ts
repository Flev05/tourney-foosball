import { Component, OnInit } from '@angular/core';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Router } from '@angular/router';
import { TourneyDetailView } from './tourney-detailview';

@Component({
    template: ""
})
export class NewTourneyDetailView implements OnInit {
    static redirect: string = 'admintourney/newdv';

    constructor(
        protected tourneyService: TourneyService,
        private router: Router 
    ) { 
    }

    ngOnInit() {
        console.log("NewTourneyDetailView.ngOnInit() ");
        
        this.tourneyService.newTourney = true;

        this.router.navigate([TourneyDetailView.redirect]);
    }
}


