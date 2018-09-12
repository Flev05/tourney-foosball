import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TourneyService } from '../../service/tourneyservice';
 
export abstract class AbstractListView implements OnInit {

    constructor(protected redirect: string, protected tourneyService: TourneyService, protected router: Router) { 
    }

    ngOnInit() {
    }
  
    protected gotoDetailView() {
        this.router.navigate([this.redirect]);
    }

    protected cloneObject(c: any): any {
        let obj = {};
        for (let prop in c) {
            obj[prop] = c[prop];
        }
        return obj;
    }
}
