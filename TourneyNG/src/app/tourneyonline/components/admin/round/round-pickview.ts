import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { RoundType } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { MeetingRoundService } from './meeting-round-service';

@Component({
    templateUrl: './round-pickview.html',
})
export class RoundPickList extends AbstractDetailView {
    static meetingListviewRedirect: string = "adminround/lv/meetingLv";

    selectedRound: Round;

    msgs: Message[] = [];

    roundFormGroup: FormGroup;
    toggleable: boolean = false;

    availableTeams: string[] = [];
    targetTeams: string[] = [];
    mdbs: Meeting[];
    nextDeleteMeeting: Meeting;
    meetingEnabled: boolean;
    selectedMeetingGroupNumCombobox: Combobox;
    meetingGroupCombobox: Combobox[];
    isTeamsChanged: any;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected router: Router,
        protected tourneyService: TourneyService,
        protected countryService: CountryService,
        public meetingRoundService: MeetingRoundService,
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("RoundPickList.ngOnInit() ");

        super.ngOnInit();
        
        if(this.tourneyService.newRound) {
            this.selectedRound = { id: this.tourneyService.getSequenceNumber(),
                name: "",
                teams: [],
                onewayMeetings: [],
                roundtripMeetings: [],
                classification: [],
                type: RoundType.R,
                matrix: null,
            };
            this.tourneyService.selectedRound = this.selectedRound;
        }

        this.selectedRound = this.tourneyService.selectedRound;

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

        this.meetingEnabled = true;
        this.meetingGroupCombobox = [];
        for (let r=1; r<=this.targetTeams.length; r++ ) {
            let ccb: Combobox = { label: "" + r, value: r };
            this.meetingGroupCombobox.push(ccb);
        } 

        this.roundFormGroup = this.fb.group({
            'name': new FormControl(this.selectedRound.name, Validators.compose([Validators.required])),
            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),
        });
    }
 
    goMeeting() {        
        if( this.isTeamsChanged ) {
            this.makeTeamList();
            this.isTeamsChanged = false;
            this.meetingRoundService.remakeRoundMeeting(this.selectedTourney, this.selectedRound);
        }

        this.router.navigate([RoundPickList.meetingListviewRedirect]);
    }
 
    private makeTeamList() {
        this.targetTeams = this.roundFormGroup.get('targetTeams').value;
        this.selectedRound.teams = [];
        for (let n of this.targetTeams) {
            let foundTeam = this.selectedTourney.teams.find(t => t.teamName == n);
            if (foundTeam != undefined) {
                this.selectedRound.teams.push(foundTeam);
            }
        }
    }

    goBack(): void {
        if( this.isTeamsChanged ) {
            this.makeTeamList();
            this.isTeamsChanged = false;
            this.meetingRoundService.remakeRoundMeeting(this.selectedTourney, this.selectedRound);
        }

        super.goBack();
    }

    onMoveToTarget(event) {
        console.log("Entering onMoveToTarget()");
        let items: string[] = event.items;
        console.log(items);
        for( let i of items ) {
            let teamToAdd: Team = this.selectedTourney.teams.find( t => t.teamName == i );
            if( teamToAdd != undefined ) {   
                this.selectedRound.teams.push(teamToAdd);
            }
        }
        this.isTeamsChanged = true;
    }

    onMoveToSource(event) {
        console.log("Entering onMoveToSource()");
        let items: string[] = event.items;
        console.log(items);
        for( let i of items ) {
            let teamToRemove: Team = this.selectedRound.teams.find( t => t.teamName == i );
            if( teamToRemove != undefined ) {   
                let index = this.selectedRound.teams.indexOf(teamToRemove);
                if( index > -1 ) {
                    this.selectedRound.teams.splice(index, 1);
                }
            }
        }
        this.isTeamsChanged = true;
    }

    onTargetReorder(event) {
        console.log("Entering onTargetReorder()");
        let items: string[] = event.items;
        console.log(items);
        this.isTeamsChanged = true;
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
