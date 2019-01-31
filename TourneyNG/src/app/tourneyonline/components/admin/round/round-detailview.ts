import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {Validators,FormControl,FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { RoundType, Direction } from 'app/tourneyonline/domain/enumerations';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Team } from 'app/tourneyonline/domain/team';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';

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
    meetingEnabled: boolean;
    selectedMeetingGroupNumCombobox: Combobox;
    meetingGroupCombobox: any[];

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
        this.meetingEnabled = false;

        if(this.tourneyService.newRound) {
            this.selectedRound = { id: this.tourneyService.getSequenceNumber(),
                name: "",
                teams: [],
                meetings: [],
                classification: [],
                type: RoundType.R,
                matrix: null
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

    onMeetingGroupNumChange(cb: Combobox) {
        console.log(cb);
        this.selectedMeetingGroupNumCombobox = cb;

        let T: number = this.selectedMeetingGroupNumCombobox.value;

        this.meetingGroupCombobox = [];
        let firstRow: Combobox =  { label: "Seleziona", value: 0 };
        this.meetingGroupCombobox.push(firstRow);


        this.meetingEnabled = true;
    }

    availables() : string {
        return "Disponibili(" +this.availableTeams.length+")";
    }
    
    selected() : string {
        return "Selezionati(" +this.targetTeams.length+")";
    }
    
    goMeeting() {
        this.router.navigate([RoundDetailView.meetingListviewRedirect]);
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
            this.selectedTourney.rounds.push(this.selectedRound);
            this.tourneyService.newRound = false;
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
            
            this.tourneyService.saveRoundMeetingDb(m, this.selectedTourney.id, this.selectedRound.id);

            this.selectedRound.meetings.push(m);
            if (!this.selectedTourney.isOnewayRound) {
                m = this.createMeeting(t, team, null, null, Direction.RoundTrip);
                this.selectedRound.meetings.push(m);

                this.tourneyService.saveRoundMeetingDb(m, this.selectedTourney.id, this.selectedRound.id);                
            }
        }
    }

    private removeFromMeetings(team: Team): void {

        let temp : MeetingDb[] = [];
        for(let m of this.selectedRound.meetings) {
            if(m.team1.id == team.id || m.team2.id == team.id) {
                this.selectedTourney.meetingsForDelete.push(m);
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
