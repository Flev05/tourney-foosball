import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractView } from './abstract-view';
 
export abstract class AbstractListView extends AbstractView {

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , protected router: Router
        , protected location: Location) { 
            super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }
  
    protected gotoDetailView() {
        this.router.navigate([this.redirect]);
    }

    containsPhase(value: string, phases: string[]) : boolean{

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i].toLowerCase().indexOf(value) == 0) {
                return true;
            }
        }
        return false;
    }
}
