import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { MeetingPlayoffService } from 'app/tourneyonline/components/admin/playoff/meeting-playoff-service';
import { MeetingRoundService } from 'app/tourneyonline/components/admin/round/meeting-round-service';
import { AbstractTabResultListView } from 'app/tourneyonline/components/common/abstract-tab-result-listview';
import { TourneyResultListView } from '../tourney/tourney-listview';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { Round } from 'app/tourneyonline/domain/round';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

const REDIRECT_ROUND_RESULT_LV   = 'result/lv/round';
const REDIRECT_PLAYOFF_RESULT_LV = 'result/lv/playoff';
const REDIRECT_ELIMINATORY       = 'result/lv/eliminatoryLv/dv';
const REDIRECT_TO_PROJECTOR      = 'result/projector';

@Component({
    templateUrl: './tab-result-listview.html',
    standalone: false
})
export class TabResultListView extends AbstractTabResultListView {
    addTeamEnabled = false;
    tourneyTeams = true;    
    teamCount : number = 0;
    
    constructor(
        public override tourneyService: TourneyService,
        public override meetingService: MeetingService,
        protected override meetingRoundService: MeetingRoundService,
        protected override meetingPlayoffService: MeetingPlayoffService,
        protected teamService: TeamService,
        protected override router: Router,
        protected override location: Location,
        protected override dfp: DateFormatPipe,
        protected override levelService: LevelService,
        public loginService: LoginService,
        protected override clientService: ClientService,
    ) {
        super(MeetingDetailView.meetingDvRedirect
            , tourneyService
            , meetingService
            , meetingRoundService
            , meetingPlayoffService
            , router
            , location
            , dfp
            , levelService
            , clientService
            );
    }

    override ngOnInit() {
        super.ngOnInit();
        this.addTeamEnabled = this.loginService.isUserAllowed();
        this.badRequest = false;
    }
     
    onRoundRowSelect(event : any) {
        console.log(event.data);
        for(let i=0;i<this.selectedRound.teamNames.length; i++ ) {
            this.selectedRound.teamNames[i] = this.selectedRound.teamNames[i].replace(/\(\d+\)/g, '');
        }

        this.tourneyService.selectedRound = this.selectedRound;
        this.meetingService.selectedRound = this.selectedRound;
        
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.meetingService.selectedMeetingDb =  new MeetingDb();
        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = this.selectedRound.id;
        this.meetingService.selectedMeetingDb. playoffId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.router.navigate([REDIRECT_ROUND_RESULT_LV]);
    }

    onPlayoffRowSelect(event : any)  {
        this.tourneyService.selectedPlayoff = this.selectedPlayoff;
        this.meetingService.selectedRound = this.selectedPlayoff.round;

        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.meetingService.selectedMeetingDb = new MeetingDb();
        
        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.playoffId = this.selectedPlayoff.id;
        this.meetingService.selectedMeetingDb.playoutId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.meetingService.selectedMeetingDb.eliminatoryBId = null;
        let playoffRounds: Round[] = [];
        for(let p of this.selectedTourney.roundVO.rounds) {
            playoffRounds.push(p);
        }
        this.meetingService.qualifyingRounds = playoffRounds;
        this.router.navigate([REDIRECT_PLAYOFF_RESULT_LV]);
    }
    
    onPlayoutRowSelect(event : any) {
        this.tourneyService.selectedPlayoff = null;
        this.tourneyService.selectedPlayout = this.selectedPlayout;
        this.meetingService.selectedRound = this.selectedPlayout.round;

        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;

        this.meetingService.selectedMeetingDb = new MeetingDb();
        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.playoffId = null;
        this.meetingService.selectedMeetingDb.playoutId = this.selectedPlayout.id;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.meetingService.selectedMeetingDb.eliminatoryBId = null;
        let playoutRounds: Round[] = [];
        for(let p of this.selectedTourney.roundVO.rounds) {
            playoutRounds.push(p);
        }
        this.meetingService.qualifyingRounds = playoutRounds;
        this.router.navigate([REDIRECT_PLAYOFF_RESULT_LV]);
    }
    
    onEliminatoryRowSelect(event : any) {
        console.log("Entering onEliminatoryRowSelect()");
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;
        
        let indexOf = this.eliminatoryLevelRows.indexOf( event.data );
        this.tourneyService.selectedEliminatoryLevelIndex  = indexOf;
        this.tourneyService.selectedEliminatoryBLevelIndex  = -1;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryLevels[indexOf];
        if(!this.tourneyService.selectedEliminatoryLevel.isTopLevel) {
            this.tourneyService.updateEliminatoryLevelsAndGui(this.selectedTourney.eliminatoryLevels);
        }

        this.meetingService.qualifyingRounds = this.selectedTourney.roundVO.rounds;
        if(this.containsPlayoff()) {
            let playoffRounds: Round[] = [];
            for(let p of this.selectedTourney.playoffVO.playoffs) {
                playoffRounds.push(p.round);
            }
            this.meetingService.qualifyingRounds = playoffRounds;
        }
        this.meetingService.selectedMeetingDb = new MeetingDb();

        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.playoffId = null;
        this.meetingService.selectedMeetingDb.playoutId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = this.tourneyService.selectedEliminatoryLevel.id;
        this.meetingService.selectedMeetingDb.eliminatoryBId = null;
        
        this.router.navigate([REDIRECT_ELIMINATORY]);
    }
        
    onEliminatoryBRowSelect(event : any) {
        console.log("Entering onEliminatoryBRowSelect()");
        this.meetingService.abstractRoundVO = this.selectedTourney.roundVO;
        this.meetingRoundService.abstractRoundVO = this.selectedTourney.roundVO;
        
        let indexOf = this.eliminatoryBLevelRows.indexOf( event.data );
        this.tourneyService.selectedEliminatoryBLevelIndex  = indexOf;
        this.tourneyService.selectedEliminatoryLevelIndex  = -1;

        this.tourneyService.selectedEliminatoryLevel = this.selectedTourney.eliminatoryBLevels[indexOf];
        if(!this.tourneyService.selectedEliminatoryLevel.isTopLevel) {
            this.tourneyService.updateEliminatoryLevelsAndGui(this.selectedTourney.eliminatoryLevels);
        }

        this.meetingService.qualifyingRounds = this.selectedTourney.roundVO.rounds;
        if(this.containsPlayoff() ) {
            let playoffRounds: Round[] = [];
            for(let p of this.selectedTourney.playoffVO.playoffs) {
                playoffRounds.push(p.round);
            }
            this.meetingService.qualifyingRounds = playoffRounds;
        }

        this.meetingService.selectedMeetingDb = new MeetingDb();
        this.meetingService.selectedMeetingDb.id = null;
        this.meetingService.selectedMeetingDb.tourneyId = this.selectedTourney.id;
        this.meetingService.selectedMeetingDb.roundId = null;
        this.meetingService.selectedMeetingDb.playoffId = null;
        this.meetingService.selectedMeetingDb.playoutId = null;
        this.meetingService.selectedMeetingDb.eliminatoryId = null;
        this.meetingService.selectedMeetingDb.eliminatoryBId = this.tourneyService.selectedEliminatoryLevel.id;
        
        this.router.navigate([REDIRECT_ELIMINATORY]);
    }

    onTerminateRoundChange(event : any) {
        console.log("Entering onTerminateRoundChange()");
        this.updateTourney();
     }

    onTerminatePlayoffChange(event : any)  {
        console.log("Entering onTerminatePlayoffChange()");
        this.updateTourney();
    }

    private updateTourney(): void {
        console.log("Entering updateTourney()");
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }

    override goBack(): void {        
        this.router.navigate([TourneyResultListView.REDIRECT_TOURNEY_LV]);
    }

    public openProjectorMode(): void {
        // Navigate inside the same window. Angular handles the /TourneyBE and # automatically!
        this.router.navigate([REDIRECT_TO_PROJECTOR]);     
    }

    refresh(): void {        
        this.ngOnInit();
    }

    regenerate(event : any) {
        console.log("Entering regenerate()");
    }

    regenerateB(event : any) {
        console.log("Entering regenerateB()");
    }

    public printPdfMeeting() {
        this.meetingRoundService.printPdfMeeting(this.selectedTourney)
    }
    
    public printPdfPlayoffMeeting() {
        this.meetingRoundService.printPdfPlayoffMeeting(this.selectedTourney)
    }
    
    public printPdfPlayoffClassification() {
        const rounds : Round[] = this.selectedTourney.playoffVO.playoffs.map((p) => {return p.round;});
        this.doPrintPdfClassification( rounds);
    }

    public printPdfPlayoutMeeting() {
        this.meetingRoundService.printPdfPlayoutMeeting(this.selectedTourney)
    }
    
    public printPdfPlayoutClassification() {
        const rounds : Round[] = this.selectedTourney.playoutVO.playoffs.map((p) => {return p.round;});
        this.doPrintPdfClassification( rounds);
    }
    
    public printPdfClassification() {
        this.doPrintPdfClassification(this.selectedTourney.roundVO.rounds);
    }
    
    private doPrintPdfClassification(rounds: Round[]) {
        const doc = new jsPDF('p', 'mm', 'a4');
        let currentY = 15;

        for (let r of rounds) {
            // ===== PRINT REGULAR CLASSIFICATION =====
            // Check page space
            if (currentY > 250) {
                doc.addPage();
                currentY = 15;
            }
            // Title
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Classifica ${this.selectedTourney.tourneyName}: ${r.name}`, 14, currentY);
            const head = [["Pos", "Squadra", "PT", "PG", "V", "P", "GF", "GS", "DR"]];
            const body = r.classification
                .map((c, index) => [
                    index + 1,
                    c.teamName || '',
                    c.points || 0,
                    c.played || 0,
                    c.won || 0,
                    c.lost || 0,
                    c.goalsDone || 0,
                    c.goalsConceded || 0,
                    c.goalsDiff || 0
                ]);
            autoTable(doc, {
                head: head,
                body: body,
                startY: currentY + 5,
                theme: 'striped',
                headStyles: { fillColor: [44, 62, 80] },
                styles: { fontSize: 8 },
                margin: { bottom: 20 },
                didDrawPage: (data) => {
                    if (data.cursor) {
                        currentY = data.cursor.y + 15;
                    }
                }
            });

            currentY = (doc as any).lastAutoTable.finalY + 15;
            // ===== PRINT DETACHED CLASSIFICATION (if exists) =====
            if (r.detachedClassification && r.detachedClassification.length > 0) {
                // Check page space
                if (currentY > 250) {
                    doc.addPage();
                    currentY = 15;
                }
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const titleText = `Classifica Avulsa`;
                const pageWidth = doc.internal.pageSize.getWidth();
                const textWidth = doc.getTextWidth(titleText);
                const centerX = (pageWidth - textWidth) / 2;
                doc.text(titleText, centerX, currentY - 10);
                const detachedHead = [["Pos", "Squadra", "P. Avulsa", "PT", "PG", "V", "P", "GF", "GS", "DR"]];
                const detachedBody = r.detachedClassification
                    .map((c, index) => [
                        index + 1,
                        c.teamName || '',
                        c.dpoints || 0,
                        c.points || 0,
                        c.played || 0,
                        c.won || 0,
                        c.lost || 0,
                        c.goalsDone || 0,
                        c.goalsConceded || 0,
                        c.goalsDiff || 0
                    ]);
                autoTable(doc, { 
                    head: detachedHead,
                    body: detachedBody,
                    startY: currentY - 10,
                    theme: 'striped',
                    // Light mode: no background fill, just text styling
                    headStyles: { 
                        fillColor: false,        // removes background color
                        textColor: 0,            // black text (0 = black)
                        fontStyle: 'bold'        // keep headers bold
                    },
                    styles: { fontSize: 8 },
                    margin: { bottom: 20 },
                    didDrawPage: (data) => {
                        if (data.cursor) {
                            currentY = data.cursor.y + 15;
                        }
                    }
                });
                currentY = (doc as any).lastAutoTable.finalY + 15;
            }
            currentY = (doc as any).lastAutoTable.finalY + 15;
            // ===== PRINT NORMALIZED CLASSIFICATION (if exists) =====
            if (r.normalizedClassification  && r.normalizedClassification.length > 0) {
                // Check page space
                if (currentY > 250) {
                    doc.addPage();
                    currentY = 15;
                }
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const titleText = `Classifica Normalizzata`;
                const pageWidth = doc.internal.pageSize.getWidth();
                const textWidth = doc.getTextWidth(titleText);
                const centerX = (pageWidth - textWidth) / 2;
                doc.text(titleText, centerX, currentY - 10);
                const normalizedHead = [["Pos", "Squadra", "PT", "PG", "V", "P", "GF", "GS", "DR"]];
                const normalizedBody = r.normalizedClassification
                    .map((c, index) => [
                        index + 1,
                        c.teamName || '',
                        c.points || 0,
                        c.played || 0,
                        c.won || 0,
                        c.lost || 0,
                        c.goalsDone || 0,
                        c.goalsConceded || 0,
                        c.goalsDiff || 0
                    ]);
                autoTable(doc, { 
                    head: normalizedHead,
                    body: normalizedBody,
                    startY: currentY - 10,
                    theme: 'striped',
                    // Light mode: no background fill, just text styling
                    headStyles: { 
                        fillColor: false,        // removes background color
                        textColor: 0,            // black text (0 = black)
                        fontStyle: 'bold'        // keep headers bold
                    },
                    styles: { fontSize: 8 },
                    margin: { bottom: 20 },
                    didDrawPage: (data) => {
                        if (data.cursor) {
                            currentY = data.cursor.y + 15;
                        }
                    }
                });
                currentY = (doc as any).lastAutoTable.finalY + 15;
            }
        }
        
        doc.save(`Classifiche-${this.selectedTourney.tourneyName}.pdf`);
    }
}

