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

import { MeetingDto } from '../../admin/round/meeting-dto';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { Eliminatory } from 'app/tourneyonline/domain/eliminatory';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { MeetingDb } from 'app/tourneyonline/domain/meeting-db';

const REDIRECT_ROUND_RESULT_LV   = 'result/lv/round';
const REDIRECT_PLAYOFF_RESULT_LV = 'result/lv/playoff';
const REDIRECT_ELIMINATORY       = 'result/lv/eliminatoryLv/dv';

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
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }

    override goBack(): void {        
        this.router.navigate([TourneyResultListView.REDIRECT_TOURNEY_LV]);
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
    
    private doPrintPdfClassification(rounds : Round[]) {
        const doc = new jsPDF('p', 'mm', 'a4');
        let currentY = 15; // Track the vertical position manually
        for (let r of rounds) {
            // 1. Check if we have enough space for at least the Title + 3 rows (approx 40mm)
            // If not, start a new page before printing the next Round
            if (currentY > 250) { 
                doc.addPage();
                currentY = 15;
            }
            // 2. Print Round Title
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

            // 3. Render the Table
            autoTable(doc, {
                head: head,
                body: body,
                startY: currentY + 5, // Start slightly below the title
                theme: 'striped',
                headStyles: { fillColor: [44, 62, 80] },
                styles: { fontSize: 8 },
                margin: { bottom: 20 }, // Ensure a little buffer at page end
                didDrawPage: (data) => {
                    // Update currentY to the end of the table on the current page
                    if (data.cursor) {
                        currentY = data.cursor.y + 15;
                    }
                }
            });
            // 4. Update currentY for the next Round in the loop
            // We use doc.lastAutoTable.finalY to find where the table actually ended
            currentY = (doc as any).lastAutoTable.finalY + 15;
        }
        doc.save(`Classifica-${this.selectedTourney.tourneyName}.pdf`);
    }

    public printTennisBracket(levelNo: number) {
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        
        let el: EliminatoryLevel = this.selectedTourney.eliminatoryLevels[levelNo];
        
        // 1. Gather all "Matches" from the classification lists
        // Each pair in the classification array is one match
        let initialMatches: {team1: string, team2: string}[] = [];
        
        for (let e of el.eliminatories) {
            const r : Round = e.round;
            const t1 : string = r.teamNames[0];
            const t2 : string = r.teamNames[1];
            initialMatches.push({
                team1: t1 || '---',
                team2: t2 || '---'
            });
        }

        const matchesPerSide = initialMatches.length / 2;
        const leftMatches = initialMatches.slice(0, matchesPerSide);
        const rightMatches = initialMatches.slice(matchesPerSide);

        // 2. Configuration
        const boxW = 50;  // Increased from 40
        const boxH = 21;  // Increased from 20 (Height is critical for vertical space)
        const padding = 5;
        const sSize = 10; // Slightly larger score box to match
        
        // Determine how many rounds/columns we need (e.g., 8 matches -> 3 rounds to reach semi)
        const totalMatches = initialMatches.length;
        
        // --- ROUND LABELS GENERATION ---
        const roundLabels: string[] = [];
        let labelSize = totalMatches;
        while (labelSize >= 4) {
            roundLabels.push(`${labelSize}° di Finale`);
            labelSize /= 2;
        }
        roundLabels.push("Semifinale", "Finale");

        // Calculate rounds per side based on the actual labels generated
        const roundsPerSide = roundLabels.length - 1; 
        
        // The rest of your code ...
        const colSpacing = (pageWidth / 2 - 20) / roundsPerSide;
        
        // 3. Draw Sides
        this.drawSide(doc, leftMatches, roundsPerSide, colSpacing, padding, boxW, boxH, 'left', pageHeight, roundLabels);
        this.drawSide(doc, rightMatches, roundsPerSide, colSpacing, pageWidth - padding - boxW, boxW, boxH, 'right', pageHeight, roundLabels);

        // --- 4. Central Final Box ---
        // Changed from pageHeight / 2 - 35 to - 25 to move it down
        const finalY = (pageHeight / 2) - 25; 
        const finalX = (pageWidth / 2) - (boxW / 2);

        doc.setDrawColor(0);
        doc.setLineWidth(0.5); // Keep it slightly thicker as it's the final
        doc.rect(finalX, finalY, boxW, boxH);
        doc.line(finalX, finalY + boxH / 2, finalX + boxW, finalY + boxH / 2);
        // Inner Score Boxes (Matches your drawSide logic)
        doc.rect(finalX + boxW - sSize - 1, finalY + (boxH / 4) - (sSize / 2), sSize, sSize); 
        doc.rect(finalX + boxW - sSize - 1, finalY + (3 * boxH / 4) - (sSize / 2), sSize, sSize);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("FINALE", pageWidth / 2, finalY - 2, { align: 'center' });

        // --- 5. 3° and 4° Central Final Box ---
        const final2Y = (pageHeight / 2) + 25;// Positioned below the center
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(finalX, final2Y, boxW, boxH);
        doc.line(finalX, final2Y + boxH / 2, finalX + boxW, final2Y + boxH / 2);
        // Inner Score Boxes
        doc.rect(finalX + boxW - sSize - 1, final2Y + (boxH / 4) - (sSize / 2), sSize, sSize); 
        doc.rect(finalX + boxW - sSize - 1, final2Y + (3 * boxH / 4) - (sSize / 2), sSize, sSize);
        doc.setFontSize(12);
        doc.text("3° e 4° Posto", pageWidth / 2, final2Y + 25, { align: 'center' });

        doc.save(`Tabellone-${this.selectedTourney.tourneyName}.pdf`);
    }

    private drawSide(doc: any, matches: any[], totalRounds: number, spacing: number, startX: number, w: number, h: number
        , side: 'left' | 'right', pageH: number, labels: string[] ) 
    {
        let currentMatchesCount = matches.length;
        let x = startX;

        for (let r = 0; r < totalRounds; r++) {
            // --- DRAW COLUMN LABEL ---
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            // Place the label about 25mm from the top
            doc.text(labels[r] || `Round ${r+1}`, x + (w / 2), 20, { align: 'center' });
                        
            const verticalGap = (pageH - 40) / currentMatchesCount;
            const firstY = 30 + (verticalGap / 2);

            for (let i = 0; i < currentMatchesCount; i++) {
                const y = firstY + (i * verticalGap) - (h / 2);
                // Draw the box
                doc.setDrawColor(0);
                doc.setLineWidth(0.2);
                doc.rect(x, y, w, h);
                doc.line(x, y + h/2, x + w, y + h/2);

                // Only draw names for the first round (the classification data)
                const sSize = 9;
                if (r === 0) {
                    // 1. Define the maximum width for the text (Box width - score box space - padding)
                    doc.setFontSize(10); // We can use a slightly larger font now!
                    const maxWidth = w - sSize - 3;
                    // 2. Split text into lines if it exceeds maxWidth
                    const team1Lines: string[] = doc.splitTextToSize(matches[i].team1, maxWidth);
                    const team2Lines: string[] = doc.splitTextToSize(matches[i].team2, maxWidth);
                    // We place it at 30% of the box height
                    const t1Offset = h * 0.2; 
                    doc.text(team1Lines.slice(0, 2), x + 2, y + t1Offset); 
                    // --- TEAM 2 (Bottom Half) ---
                    // We place it at 80% of the box height (this prevents the overlap)
                    const t2Offset = h * 0.7; 
                    doc.text(team2Lines.slice(0, 2), x + 2, y + t2Offset);
                }

                // Draw Score Boxes
                doc.rect(x + w - sSize - 1, y + (h/4) - (sSize/2), sSize, sSize); 
                doc.rect(x + w - sSize - 1, y + (3*h/4) - (sSize/2), sSize, sSize);

                // --- Draw Connector Lines (Top/Bottom Entry) ---
                const nextColumnX = (side === 'left') ? x + spacing : x - spacing;
                const nextBoxMidX = nextColumnX + (w / 2); 

                // 1. Horizontal line out
                const isLastRound = (r === totalRounds - 1);
                if (!isLastRound) {
                    const startXSide = (side === 'left') ? x + w : x;
                    doc.line(startXSide, y + h / 2, nextBoxMidX, y + h / 2);
                }

                // 2. Vertical line to connect to the TOP or BOTTOM of the next box
                // We only draw this if it's NOT the last round of the side
                if (r < totalRounds - 1) {
                    // Current Round Math (used to find this box's vertical center)
                    // Next Round Math (Must use the exact same logic but with half the matches)
                    const nextMatchesCount = currentMatchesCount / 2;
                    const nextVerticalGap = (pageH - 40) / nextMatchesCount;
                    const nextFirstY = 30 + (nextVerticalGap / 2);
                    
                    // Find the center of the target box in the next round
                    const nextBoxCenterY = nextFirstY + (Math.floor(i / 2) * nextVerticalGap);

                    if (i % 2 === 0) {
                        // TOP TEAM: Move from current middle DOWN to next box's TOP
                        const targetTop = nextBoxCenterY - (h / 2);
                        doc.line(nextBoxMidX, y + h / 2, nextBoxMidX, targetTop);
                    } else {
                        // BOTTOM TEAM: Move from current middle UP to next box's BOTTOM
                        const targetBottom = nextBoxCenterY + (h / 2);
                        doc.line(nextBoxMidX, y + h / 2, nextBoxMidX, targetBottom);
                    }
                }
            }

            // Move to next column
            x = (side === 'left') ? x + spacing : x - spacing;
            currentMatchesCount /= 2;
        }
    }

    public printPdfTopLevelMeeting(rowIndex: number) {
        console.log("rowIndex=" + rowIndex);
        const doc = new jsPDF();
        let el: EliminatoryLevel = this.selectedTourney.eliminatoryLevels[rowIndex];
        // We use currentY to track our vertical position on the page
        this.meetingRoundService.selectedTourney = this.selectedTourney;

        let rounds : Round[] = [];
        for (let i = 0; i < el.eliminatories.length; i++) {
            const e : Eliminatory = el.eliminatories[i];
            const r : Round = e.round;
            rounds.push(r);
        }

        const both : boolean = this.selectedTourney.isOnewayRound != "true";
        if (both) {
            this.meetingRoundService.printFullDirection(doc, rounds, el.name, "Andata", true);
        } else {
            this.meetingRoundService.printFullDirection(doc, rounds, el.name, null, true);
        }
                
        if (both) {
            doc.addPage(); // Start Away meetings on a fresh page
            this.meetingRoundService.printFullDirection(doc, rounds, el.name, "Ritorno", true);
        }
        doc.save(`Eliminations-${this.selectedTourney.tourneyName}.pdf`);
    }
}

