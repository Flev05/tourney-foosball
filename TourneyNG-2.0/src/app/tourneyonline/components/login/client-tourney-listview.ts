import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login-service';
import { LoginDetailView } from './login-detailview';

@Component({
    template: "",
    standalone: false
})
export class ClientTourneyListView implements OnInit {
    constructor(
        private router: Router 
        , private loginService: LoginService
    ) { 
    }

    ngOnInit() {
        console.log("ClientTourneyListView.ngOnInit() ");
        
        if( this.loginService.isAtLeastAdmin() ) {
            this.router.navigate([LoginDetailView.redirectToAdminTourney]);
        } else {
            this.router.navigate([LoginDetailView.redirectToShowTourney]);
        }
    }
}


