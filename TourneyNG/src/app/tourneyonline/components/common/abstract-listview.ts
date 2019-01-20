import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractView } from './abstract-view';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
 
export abstract class AbstractListView extends AbstractView {

    levelMap: Map<number, Eliminatory[]>;
    totLevelLen: number;

    constructor(protected redirect: string
        , protected tourneyService: TourneyService
        , protected router: Router
        , protected location: Location) 
    { 
        super(tourneyService, location);
    }

    ngOnInit() {
        super.ngOnInit();
    }
  
    protected gotoDetailView() {
        this.router.navigate([this.redirect]);
    }

    protected pow2(level : number) : number {
        return Math.pow(2, level);
    }

    goBack(): void {
        this.location.back();
    }
    onError(e:any) {
        console.log(e);
    }

    protected sortMeetings(meetings: any[]): any[] {
        return meetings.sort((m1, m2) => {
            if (m1.dateAndTime > m2.dateAndTime) {
                return 1;
            }
            if (m1.dateAndTime < m2.dateAndTime) {
                return -1;
            }
            return 0;
        });
    }
}
