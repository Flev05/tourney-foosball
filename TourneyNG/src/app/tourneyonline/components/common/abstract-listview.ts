import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Playoff } from 'app/tourneyonline/domain/playoff';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { PhaseType, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
 
export abstract class AbstractListView extends AbstractView {

    roundMap: Map<number, Round>;
    playoffRoundMap: Map<number, Playoff>;

    roundRows: any[] = [];
    playoffRows: any[] = [];

    roundMeetings: MeetingDb[];
    playoffMeetings: MeetingDb[];
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

    protected containsPhase(value: PhaseType, phases: PhaseType[]) : boolean {

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

    protected containsRound(): boolean {
        return this.containsPhase(PhaseType.R, this.selectedTourney.phases);
    }

    protected containsPlayoff(): boolean {
        return this.containsPhase(PhaseType.P, this.selectedTourney.phases);
    }

    protected containsEliminatory(): boolean {
        return this.containsPhase(PhaseType.E, this.selectedTourney.phases);
    }

    goBack(): void {
        this.location.back();
    }
    onError(e:any) {
        console.log(e);
    }
}
