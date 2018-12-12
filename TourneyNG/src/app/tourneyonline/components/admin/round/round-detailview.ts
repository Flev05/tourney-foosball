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
    nextDeleteMeeting: MeetingDb;

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
            this.selectedRound.classification = [];
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

    availables() : string {
        return "Disponibili(" +this.availableTeams.length+")";
    }
    
    selected() : string {
        return "Selezionati(" +this.targetTeams.length+")";
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
            this.tourneyService.deleteMeeting(m);
        }

        this.selectedRound.meetings = [];
    }

    onSubmit(value: string) {

        this.selectedRound.name = this.roundFormGroup.get('name').value;
        this.targetTeams = this.roundFormGroup.get('targetTeams').value;

        let teamTourneyMap: Map<string,Team> = new Map<string,Team>();
        for(let t of this.selectedTourney.teams) {
            teamTourneyMap.set(t.teamName, t);
        }
        let teamMap: Map<string,Team> = new Map<string,Team>();
        for(let t of this.selectedRound.teams) {
            teamMap.set(t.teamName, t);
        }

        if(this.tourneyService.newRound) {
            this.tourneyService.newRound = false;
            this.selectedTourney.rounds.push(this.selectedRound);
        }

        for(let tn of this.targetTeams) {
            if(!teamMap.has(tn)) {
                let t = teamTourneyMap.get(tn);
                teamMap.set(t.teamName, t);
                this.addTeamToMeetings(t);
                this.selectedRound.teams.push(t);
                this.selectedRound.classification.push(t);
            }
        }

        let teamNameMap: Map<string,string> = new Map<string,string>();
        for(let tn of this.targetTeams) {
            teamNameMap.set(tn, tn);
        }
        let tempTeams: Team[] = [];
        for(let t of this.selectedRound.teams) {
            if(teamNameMap.has(t.teamName)) {
                tempTeams.push(t);
            } else {
                this.removeFromMeetings(t);
                this.removeFromClassification(t);
            }
        }
        this.selectedRound.teams = tempTeams;

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
    }

    private removeFromClassification(t: Team): any {
        let index = this.selectedRound.classification.indexOf(t);
        if(index > -1) {
            this.selectedRound.classification.splice(index, 1);
        }
    }

    private addTeamToMeetings(team: Team) {
        for (let t of this.selectedRound.teams) {
            let m = this.createMeeting(team, t, null, null, Direction.OneWay);
            
            this.tourneyService.addMeetingDb(m, this.selectedTourney.id, this.selectedRound.id, 0, 0 );

            this.selectedRound.meetings.push(m);
            if (!this.selectedTourney.isOnewayRound) {
                m = this.createMeeting(t, team, null, null, Direction.RoundTrip);
                this.selectedRound.meetings.push(m);

                this.tourneyService.addMeetingDb(m, this.selectedTourney.id, this.selectedRound.id, 0, 0);                
            }
        }
    }

    private removeFromMeetings(team: Team): void {

        let temp : Meeting[] = [];
        for(let m of this.selectedRound.meetings) {
            if(m.team1.id == team.id || m.team2.id == team.id) {
                this.tourneyService.deleteMeeting(m);
            } else {
                temp.push(m);
            }
        }
        this.selectedRound.meetings = temp;    
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
