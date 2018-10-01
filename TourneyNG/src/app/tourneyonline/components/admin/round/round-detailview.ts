import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { Round } from '../../../domain/round';
import { RoundType } from '../../../domain/roundType';
import { Team } from '../../../domain/team';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Meeting } from 'app/tourneyonline/domain/meeting';


@Component({
    templateUrl: './round-detailview.html',
})
export class RoundDetailView extends AbstractDetailView {
    selectedRound: Round;

    msgs: Message[] = [];

    roundFormGroup: FormGroup;
    toggleable: boolean = false;

    availableTeams: Team[] = [];
    targetTeams: Team[] = [];

    constructor(
        private fb: FormBuilder,
        protected location: Location,
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
            this.selectedRound.isRoundTrip = true;
            this.selectedRound.type = RoundType.R;
        }

        this.targetTeams = this.selectedRound.teams;
        this.availableTeams = [];

        for(let i=0; i<this.selectedTourney.teams.length; i++ ) {
            let team = this.selectedTourney.teams[i];
        
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
                this.availableTeams.push(team);
            }
        }

        if(this.selectedRound.meetings.length==0 && this.selectedRound.teams.length > 0) {
            for(let i=0; i<this.selectedRound.teams.length; i++) {
                for(let j=i+1; j<this.selectedRound.teams.length; j++) {
                    let t1: Team = this.selectedRound.teams[i];
                    let t2: Team = this.selectedRound.teams[j];
                    let m : Meeting = this.createMeeting(t1, t2);
                    this.selectedRound.meetings.push(m);

                    if(this.selectedRound.isRoundTrip) {
                        let m : Meeting = this.createMeeting(t2, t1);
                        this.selectedRound.meetings.push(m);    
                    }
                }
            }
        }

        this.roundFormGroup = this.fb.group({
            'name': new FormControl(this.selectedRound.name, Validators.compose([Validators.required])),
            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),
        });
    }

    doDelete() {
        console.log("doDelete(): " + this.selectedRound.name);
        let popup = 'Sicuro di voler rimuovere il girone: ';

        if(confirm(popup + this.selectedRound.name + "?")) {
            let index: number = this.selectedTourney.rounds.indexOf(this.selectedRound);
            if(index > -1) {
                this.selectedTourney.rounds.splice(index, 1);
                this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
            }
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
    }

    private addTeamToMeetings(team: Team) {
        for (let t of this.selectedRound.teams) {
            let m = this.createMeeting(team, t);

            this.selectedRound.meetings.push(m);
            if (this.selectedRound.isRoundTrip) {
                m = this.createMeeting(t, team);
                this.selectedRound.meetings.push(m);
            }
        }
    }

    private createMeeting(t: Team, team: Team) {
        let m : Meeting = {
            id: this.tourneyService.getSequenceNumber(),
            name: t.teamName + " - " + team.teamName,
            dateInMillis : this.selectedTourney.dateInMillis,
            date: this.selectedTourney.dateAsString,
            time: this.selectedTourney.timeAsString,
            address: this.selectedTourney.address,
            country: this.selectedTourney.country,
            team1: t,
            team2: team
        };
        return m;
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
            if(m.team1.id == team.id ) {
                this.selectedRound.meetings.splice(index, 1);    
            }
            if(m.team2.id == team.id ) {
                this.selectedRound.meetings.splice(index, 1);    
            }            
        }

        index = this.selectedRound.teams.indexOf(team);
        if (index > -1) {
            this.selectedRound.teams.splice(index, 1);
        }
    }

    onSubmit(value: string) {

        this.selectedRound.name = this.roundFormGroup.get('name').value;
        this.selectedRound.teams = this.roundFormGroup.get('targetTeams').value;

        if(this.tourneyService.newRound) {
            this.selectedTourney.rounds.push(this.selectedRound);
            this.selectedTourney.roundNo = this.selectedTourney.rounds.length;
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
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
