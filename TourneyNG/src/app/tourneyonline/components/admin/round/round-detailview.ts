import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Round } from '../../../domain/round';
import { Team } from '../../../domain/team';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { RoundType, Direction } from 'app/tourneyonline/domain/enumerations';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Router } from '@angular/router';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

@Component({
    templateUrl: './round-detailview.html',
})
export class RoundDetailView extends AbstractDetailView {
    static meetingListviewRedirect: string = "adminround/lv/meetingLv";

    selectedRound: Round;

    msgs: Message[] = [];

    roundFormGroup: FormGroup;
    toggleable: boolean = false;

    availableTeams: string[] = [];
    targetTeams: string[] = [];
    mdbs: MeetingDb[];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected router: Router,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("RoundDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedRound = this.tourneyService.selectedRound;

        if(this.tourneyService.newRound) {
            this.selectedRound.id = this.tourneyService.getSequenceNumber(); 
            this.selectedRound.teams = [];
            this.selectedRound.meetings = [];
            this.selectedRound.type = RoundType.R;
        }

        this.targetTeams = [];
        for(let t of this.selectedRound.teams) {
            this.targetTeams.push(t.teamName);
        }
        this.availableTeams = [];

        for(let k=0; k<this.selectedTourney.teams.length; k++ ) {
            let team = this.selectedTourney.teams[k];
        
            let found: boolean = false;
            for(let i=0; i<this.selectedTourney.rounds.length; i++ ) {
                let t = this.selectedTourney.rounds[i];
                let roundTeams = t.teams;
                for(let j=0; j<roundTeams.length; j++ ) {
                    if(roundTeams[j].id == team.id) {
                        found = true;
                        break;
                    }
                }
            }
            if(!found) {
                this.availableTeams.push(team.teamName);
            }
        }

        this.roundFormGroup = this.fb.group({
            'name': new FormControl(this.selectedRound.name, Validators.compose([Validators.required])),
            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),
        });
    }

    goMeeting() {
        const subscr = this.tourneyService.loadRoundMeeting(this.selectedTourney.id, this.selectedRound.id);
        subscr.subscribe(t => this.mdbs = t, e => this.onError(e), () => this.onComplete());   
    }

    private onComplete(): void {
        this.selectedRound.meetings = [];
        for(let mdb of this.mdbs) {
            let m: Meeting = JSON.parse(mdb.json);
            this.selectedRound.meetings.push(m);
        }
        this.tourneyService.selectedRound = this.selectedRound;

        this.router.navigate([RoundDetailView.meetingListviewRedirect]);
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedRound.name);
        let popup = 'Sicuro di voler rimuovere il girone: ';

        if(confirm(popup + this.selectedRound.name + "?")) {
            let index: number = this.selectedTourney.rounds.indexOf(this.selectedRound);
            if(index > -1) {
                let rounds: Round[] = this.selectedTourney.rounds.splice(index, 1);
                for(let r of rounds) {
                    this.removeRound(r);
                }

                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
        }
    }
    private removeRound(r: Round): any {
        for(let m of r.meetings) {
            this.tourneyService.deleteMeeting(m.id);
        }
    }

    onMoveToTarget(teamList: Team[]) {
        console.log("Entering onMoveToTarget(), teamList.length=" + teamList.length);
        for(let t of this.targetTeams) {
            console.log("Team=" + JSON.stringify(t));
        }

        this.alignMoveToTargetList(teamList);
    }

    onMoveToSource(teamList: Team[]) {
        console.log("Entering onMoveToSource(), teamList.length=" + teamList.length);
        this.alignMoveToSourceList(teamList);
    }

    onMoveAllToTarget(teamList: Team[]) {
        console.log("Entering onMoveAllToTarget(), teamList.length=" + teamList.length);
        this.alignMoveToTargetList(teamList);
    }

    onMoveAllToSource(teamList: Team[]) {
        console.log("Entering onMoveAllToSource(), teamList.length=" + teamList.length);
        this.alignMoveToSourceList(teamList);
    }

    private alignMoveToTargetList(teamList: Team[]) {
        for (let t of teamList) {
            this.addToMeetings(t);
        }
    }

    private addToMeetings(team: Team) {
        console.log("addToMeetings(" + team.teamName + ")");

        this.addTeamToMeetings(team);

        this.selectedRound.teams.push(team);
        let cl: Classification = this.newClassification(team, 0);

        this.selectedRound.classification.push(cl);
    }

    private addTeamToMeetings(team: Team) {
        for (let t of this.selectedRound.teams) {
            let m = this.createMeeting(team, t, null, null, Direction.OneWay);
            
            let mdb: MeetingDb = RoundDetailView.prepareMeetingDb(m, this.selectedTourney.id, this.selectedRound.id);
            this.tourneyService.addMeeting(mdb);

            this.selectedRound.meetings.push(m);
            if (!this.selectedTourney.isOnewayRound) {
                m = this.createMeeting(t, team, null, null, Direction.RoundTrip);
                this.selectedRound.meetings.push(m);

                let mdb: MeetingDb = RoundDetailView.prepareMeetingDb(m, this.selectedTourney.id, this.selectedRound.id);
                this.tourneyService.addMeeting(mdb);
            }
        }
    }

    private alignMoveToSourceList(teamList: Team[]) {
        for (let t of teamList) {
            this.removeFromMeetings(t);
        }
    }

    private removeFromMeetings(team: Team): any {
        console.log("removeFromMeetings(" + team.teamName + ")");
        let index: number = 0;
        for(let m of this.selectedRound.meetings) {
            if(m.team1.id == team.id || m.team2.id == team.id) {
                this.tourneyService.deleteMeeting(m.id);
                this.selectedRound.meetings.splice(index, 1);    
            }
        }

        index = this.selectedRound.teams.indexOf(team);
        if (index > -1) {
            this.selectedRound.teams.splice(index, 1);
            this.selectedRound.classification.splice(index, 1);
        }
    }

    onSubmit(value: string) {

        this.selectedRound.name = this.roundFormGroup.get('name').value;

        this.selectedRound.teams = this.roundFormGroup.get('targetTeams').value;

        if(this.tourneyService.newRound) {
            this.tourneyService.newRound = false;
            this.selectedTourney.rounds.push(this.selectedRound);
        }

        this.selectedRound.teams = [];
        for(let tn of this.targetTeams) {
            for(let t of this.selectedTourney.teams) {
                if(t.teamName == tn) {
                    this.selectedRound.teams.push(t);
                }
            }
        }

        // this.selectedRound.meetings = [];
        // for(let i=0; i<this.selectedRound.teams.length; i++) {
        //     for(let j=i+1; j<this.selectedRound.teams.length; j++) {
        //         let t1: Team = this.selectedRound.teams[i];
        //         let t2: Team = this.selectedRound.teams[j];
        //         let m : Meeting = this.createMeeting(t1, t2, null, null, Direction.OneWay);
        //         this.selectedRound.meetings.push(m);

        //         let mdb: MeetingDb = this.prepareMeetingDb(m);
        //         this.tourneyService.addMeeting(mdb);

        //         if(!this.selectedTourney.isOnewayRound) {
        //             let m : Meeting = this.createMeeting(t2, t1, null, null, Direction.RoundTrip);
        //             this.selectedRound.meetings.push(m);    
        //             let mdb: MeetingDb = this.prepareMeetingDb(m);
        //             this.tourneyService.addMeeting(mdb);
        //         }
        //     }
        // }

        this.initClassification(this.selectedRound);

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }
 
    static prepareMeetingDb(m: Meeting, tourneyId: number, roundId: number): MeetingDb {
        let json: string = JSON.stringify(m);
        return {
            id: m.id,
            tourneyId: tourneyId,
            roundId: roundId,
            playoffId: 0,
            eliminatoryId: 0,
            json: json
        };
    }

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        if(this.tourneyService.newRound) {
            msgerr = 'Creazione nuovo girone fallita';
        } else {
            msgerr = 'Modifica girone fallita';
        }
        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
