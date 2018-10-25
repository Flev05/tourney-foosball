import { Component } from '@angular/core';
import { Location } from '@angular/common';

import {FormControl,FormGroup,FormBuilder} from '@angular/forms';

import {Message} from '../../../../components/common/api';

import { CountryService } from '../../../service/countryservice';
import { TourneyService } from '../../../service/tourneyservice';
import { AbstractDetailView } from '../../common/abstract-detailview';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Combobox } from 'app/tourneyonline/domain/tourney-combobox';
import { EliminatoryMode } from '../../../domain/enumerations';
import { Team } from 'app/tourneyonline/domain/team';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';


@Component({
    templateUrl: './eliminatory-autodetailview.html',
})
export class AutoEliminatoryDetailView extends AbstractDetailView {
    
    msgs: Message[] = [];

    eliminatoryFormGroup: FormGroup;
    toggleable: boolean = false;

    fullAddress1: string;
    fullAddress2: string;
    meetingName: string;

    positions: Combobox[];
    rounds: Combobox[];
    playoffs: Combobox[];

    selectedEliminatory: Eliminatory;

    eliminatoryMode: EliminatoryMode;
    eliminatories: Eliminatory[];  

    availableTeams: Team[] = [];
    targetTeams: Team[] = [];

    selectedEliminatoryLevel: EliminatoryLevel;
    isTopLevel: boolean;
    private isOneway: boolean;

    constructor(
        private fb: FormBuilder,
        protected location: Location,
        protected tourneyService: TourneyService,
        protected countryService: CountryService
    ) { 
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        console.log("EliminatoryDetailView.ngOnInit() ");

        super.ngOnInit();

        this.selectedEliminatory = this.tourneyService.selectedEliminatory;
        this.selectedEliminatoryLevel = this.tourneyService.selectedEliminatoryLevel;

        this.positions = this.tourneyService.positionsCombobox;
        this.rounds = this.tourneyService.roundsCombobox;
        this.availableTeams = this.tourneyService.availableTeams;
        this.playoffs = this.tourneyService.playoffsCombobox;

        this.isOneway = this.selectedEliminatoryLevel.isOneway;
        // this.isTopLevel = this.selectedEliminatoryLevel.isTopLevel;
        this.isTopLevel = false;

        let m1: Meeting = this.selectedEliminatory.round.meetings[0];
        if(this.targetTeams.length == 0) {
            this.targetTeams.push(m1.team1);
            if(m1.team2.teamName!="") {
                this.targetTeams.push(m1.team2);
            }
        }

        if(m1.country!=undefined) {
            this.fullAddress1 = m1.address + " - " 
                + m1.country.zipCode + " " + m1.country.city
                + " (" + m1.country.provinceCode +")";
        }

        let m2: Meeting = m1;
        if(!this.isOneway) {
            m2 = this.selectedEliminatory.round.meetings[1];
            if(m2.country!=undefined) {
                this.fullAddress2 = m2.address + " - " 
                    + m2.country.zipCode + " " + m2.country.city
                    + " (" + m2.country.provinceCode +")";
            }
        }
        
        this.eliminatoryFormGroup = this.fb.group({

            'availableTeams': new FormControl(this.availableTeams),
            'targetTeams':    new FormControl(this.targetTeams),

            'address1':  new FormControl(m1.address),
            'country1':  new FormControl(m1.country),

            'address2':  new FormControl(m2.address),
            'country2':  new FormControl(m2.country),    
        });
    }

    onSubmit(value: string) {

        let targetTeams: Team[] = this.eliminatoryFormGroup.get('targetTeams').value;

        if(targetTeams.length > 0) {
            let m1 = this.selectedEliminatory.round.meetings[0];

            if(targetTeams.length == 1) {
                m1.team1.teamName = targetTeams[0].teamName;
                m1.team1.id = targetTeams[0].id;
                m1.name = m1.team1.teamName + " - ";
            }
            if(targetTeams.length == 2) {
                m1.address = this.eliminatoryFormGroup.get('address1').value;
                m1.country = this.eliminatoryFormGroup.get('country1').value;

                m1.team2.teamName = targetTeams[1].teamName;
                m1.team2.id = targetTeams[1].id;
                m1.name = m1.team1.teamName + " - " + m1.team2.teamName;
            }

            if(!this.isOneway) {
                let m2 = this.selectedEliminatory.round.meetings[1];
                if(targetTeams.length == 1) {
                    m2.team1.teamName = targetTeams[0].teamName;
                    m2.team1.id = targetTeams[0].id;
                    m2.name = m2.team1.teamName + " - ";
                }
                if(targetTeams.length == 2) {
                    m2.address = this.eliminatoryFormGroup.get('address2').value;
                    m2.country = this.eliminatoryFormGroup.get('country2').value;
    
                    m2.team2.teamName = targetTeams[0].teamName;
                    m2.team2.id = targetTeams[0].id;
                                    
                    m2.team1.teamName = targetTeams[1].teamName;
                    m2.team1.id = targetTeams[1].id;
                                                    
                    m2.name = m2.team2.teamName + " - " + m2.team1.teamName;
                }
            }
        }

        this.tourneyService.updateTourney(this.selectedTourney).subscribe(n => this.next(n), e => this.onError(e), () => this.goBack());
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

        this.selectedEliminatory.round.teams.push(team);
    }

    private addTeamToMeetings(team: Team) {
        for (let t of this.selectedEliminatory.round.teams) {
            let m = this.createMeeting(team, t);

            this.selectedEliminatory.round.meetings.push(m);
            if (this.isOneway) {
                m = this.createMeeting(t, team);
                this.selectedEliminatory.round.meetings.push(m);
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
        for(let m of this.selectedEliminatory.round.meetings) {
            if(m.team1.id == team.id ) {
                this.selectedEliminatory.round.meetings.splice(index, 1);    
            }
            if(m.team2.id == team.id ) {
                this.selectedEliminatory.round.meetings.splice(index, 1);    
            }            
        }

        index = this.selectedEliminatory.round.teams.indexOf(team);
        if (index > -1) {
            this.selectedEliminatory.round.teams.splice(index, 1);
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

    onError(n:any) {
        this.msgs = [];
        let msgerr : string;

        msgerr = 'Modifica eliminazione diretta fallita';

        this.msgs.push({severity:'error', summary:'Errore', detail: msgerr});
    }
}
