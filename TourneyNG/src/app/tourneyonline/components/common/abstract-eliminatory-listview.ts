import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AbstractListView } from 'app/tourneyonline/components/common/abstract-listview';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { Message } from 'app/components/common/api';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { EliminatoryMode, Direction, PhaseType } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Team } from 'app/tourneyonline/domain/team';

export abstract class AbstractEliminatoryListView extends AbstractListView {
    msgs: Message[] = [];
   
    selectedEliminatoryLevel: EliminatoryLevel;
    eliminatoryLevels: Array<EliminatoryLevel>;
    eliminatoryMode: EliminatoryMode;
    
    selectedEliminatory: Eliminatory;
    eliminatories: Eliminatory[];

    isPlayoff: boolean;
    isManual: boolean;

    isTopLevel: boolean;

    isOneway: string;
    isStandalone: boolean;
    
    meetingMap: Map<number, MeetingDb[]>;
    httpCounter: number;
    eliminatoryRoundMap: Map<number, Round>;

    isModeEnabled: boolean;

    selectedLevelCombobox: Combobox;
    selectedTeamsNumCombobox: Combobox;
    teamsCombobox: Combobox[];
    isAutomatic: boolean;

    constructor(
        protected redirect: string,
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(redirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();

        this.tourneyService.prepareEliminatoriesComboBoxes();
 
        if(this.tourneyService.selectedEliminatoryLevel!=undefined) {
            // this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[0];
            this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;
            this.eliminatories = this.selectedEliminatoryLevel.eliminatories;
            this.isOneway = this.selectedEliminatoryLevel.isOneway ? "true" : "false" ;
            this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
        }

        this.eliminatoryMode = this.selectedTourney.eliminatoryMode;
    
        this.isPlayoff = this.selectedTourney.playoffs.length > 0 ? true : false;
        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
        
        this.teamsCombobox = this.tourneyService.teamsCombobox;
        this.selectedTeamsNumCombobox = this.selectedTourney.selectedTeamsNumCombobox;
  
        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;

        this.isManual = this.eliminatoryMode==EliminatoryMode.M ? true : false;
        this.isAutomatic = ! this.isManual;
                
        if( this.containsPhase(PhaseType.R, this.selectedTourney.phases) && 
            this.containsPhase(PhaseType.P, this.selectedTourney.phases) &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) 
        {
            this.isModeEnabled = false;
        } else {
             this.isModeEnabled = true;
        }

        if (this.selectedTourney.phases.length == 1 &&
            this.containsPhase(PhaseType.E, this.selectedTourney.phases)) {
            this.isStandalone = true;
        } else {
            this.isStandalone = false;
        }
        this.tourneyService.isStandalone = this.isStandalone;
    }
 
    protected loadEliminatoryMeetings() {
        this.meetingMap = new Map<number, MeetingDb[]>();
        this.eliminatoryRoundMap = new Map<number, Round>();

        this.eliminatoryLevels = this.selectedTourney.eliminatoryLevels;
        if(this.eliminatoryLevels==undefined || this.eliminatoryLevels.length == 0) {
            return;
        }

        this.httpCounter = 0;
        for (let topElimLevel of this.eliminatoryLevels) {
            for (let e of topElimLevel.eliminatories) {
                this.eliminatoryRoundMap.set(e.id, e.round);
                this.httpCounter++;
                let abs = this.tourneyService.loadEliminatoryMeeting(this.selectedTourney.id, e.id);
                abs.subscribe(mdbs => this.addToMeetingMap(mdbs), e => this.onError(e));
            }
        }
    }

    private addToMeetingMap(mdbs: MeetingDb[]): void {
        let elid = mdbs[0].eliminatoryId;
        this.meetingMap.set(elid, mdbs);

        this.httpCounter--;

        if(this.httpCounter == 0) {

            for(let key of this.eliminatoryRoundMap.keys()) {
                let eid: number = +key;
                let round = this.eliminatoryRoundMap.get(eid);
                let meetingsDb: MeetingDb[] = this.meetingMap.get(eid);
                let meetings: Array<Meeting> = new Array<Meeting>();
                for(let mdb of meetingsDb) {
                    let m = JSON.parse(mdb.json);
                    meetings.push(m);
                }
                round.meetings = meetings;
            }

            this.processEliminationTree();
        }
    }

    protected processEliminationTree(): void {
        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e));
    }
    
    onOnewayClick() {
        console.log("Entering onOnewayClick()");
        this.selectedEliminatoryLevel.isOneway=true;

        this.manageMeeting(true);
    }

    onRoundtripClick() {
        console.log("Entering onRoundtripClick()");
        this.selectedEliminatoryLevel.isOneway=false;
        this.manageMeeting(false);
    }

    private manageMeeting(isOneway: boolean) {

        for(let e of this.eliminatories) {
            if(isOneway) {
                if(e.round.meetings.length == 2) {
                    this.tourneyService.deleteMeeting(e.round.meetings[1]);
                    e.round.meetings.splice(1, 1);
                }
            } else {
                let m = this.createMeeting(e.round.meetings[0].team2, e.round.meetings[0].team1, null, null, Direction.RoundTrip);
                e.round.meetings.push(m);

                this.tourneyService.addMeetingDb(m, this.selectedTourney.id, 0, 0, e.id);
            }
        }
        this.processEliminationTree();
    }

    protected newDummyTeam() : Team {
        let dummy: Team = {id: this.tourneyService.getSequenceNumber(), teamName: ""};
        return dummy;
    }
}

