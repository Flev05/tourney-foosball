import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractView } from './abstract-view';
import { PhaseType } from '../../domain/enumerations';
 
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

    protected containsPhase(value: PhaseType, phases: PhaseType[]) : boolean{

        for(let i=0; i<phases.length; i++ ) {
            if(phases[i] == value ) {
                return true;
            }
        }
        return false;
    }

    protected pow2(level : number) : number {
        return Math.pow(2, level);
    }
}
