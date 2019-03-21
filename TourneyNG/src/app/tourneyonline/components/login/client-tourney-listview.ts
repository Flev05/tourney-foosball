import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: ""
})
export class ClientTourneyListView implements OnInit {
    static redirect: string = '/admintourney';

    constructor(
        private router: Router 
    ) { 
    }

    ngOnInit() {
        console.log("ClientTourneyListView.ngOnInit() ");
        
        this.router.navigate([ClientTourneyListView.redirect]);
    }
}


