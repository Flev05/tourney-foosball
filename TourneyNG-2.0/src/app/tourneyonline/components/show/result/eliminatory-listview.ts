import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { MeetingDetailView } from './meeting-detailview';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { LevelService } from 'app/tourneyonline/components/admin/eliminatory/level-service';
import { AbstractResultEliminatoryListView } from 'app/tourneyonline/components/common/abstract-result-eliminatory-listview';
import { DateFormatPipe } from 'app/tourneyonline/components/common/date-format-pipe';
import { ClassificationDetailView } from '../classification/classification-detailview';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { TeamService } from 'app/tourneyonline/service/team-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { TourneyVO } from 'app/tourneyonline/domain/tourney.vo';
import { EliminatoryLevel } from 'app/tourneyonline/domain/eliminatory-level';
import { jsPDF } from 'jspdf';
import { Round } from 'app/tourneyonline/domain/round';
import { MeetingRoundService } from '../../admin/round/meeting-round-service';

@Component({
    templateUrl: './eliminatory-listview.html',
    styleUrls: ['../classification/classification-view.css'],
    standalone: false
})
export class EliminatoryListView extends AbstractResultEliminatoryListView {
    constructor(
        public override tourneyService: TourneyService
        ,protected override meetingService: MeetingService
        ,protected override levelService: LevelService
        ,protected override clientService: ClientService
        ,protected override router: Router
        ,protected override location: Location
        ,public override dfp: DateFormatPipe
        ,public loginService: LoginService
        ,private teamService: TeamService
        ,protected meetingRoundService: MeetingRoundService,
    ) {
        super(MeetingDetailView.meetingDvRedirect, tourneyService, meetingService, levelService, clientService, router, location, dfp)
    }
    
    override ngOnInit() {
        super.ngOnInit();
        this.meetingService.abstractRoundVO = this.tourneyService.selectedEliminatoryLevel.abstractRoundVO;
        this.levelService.selectedTourney = this.selectedTourney;
        this.isOneway = this.meetingService.abstractRoundVO.direction == Direction.OneWay ? "true" : "false";
        this.isRoundTrip = this.isOneway == "true" ? false : true;
        if(this.tourneyService.selectedEliminatoryLevelIndex==-1) {
            this.levelService.loadAllEliminatoryBMeetingByIdList(this.selectedTourney.eliminatoryBLevels, () => this.onEliminatoryBLoadComplete(), e => this.serverUnreachableHandler(e));
        } else {
            this.levelService.loadAllEliminatoryMeetingByIdList(this.selectedTourney.eliminatoryLevels, () => this.onEliminatoryLoadComplete(), e => this.serverUnreachableHandler(e));
        }
    }

    private onEliminatoryLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryLevels, false);
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationCols);
        this.teamService.setMeetingAddress(this.onewayMeetings,this.roundtripMeetings);
        this.updateTourney();
    }
    
    private onEliminatoryBLoadComplete(): void {
        super.onLoadComplete(this.selectedTourney.eliminatoryBLevels, true);
        this.eliminatories = this.tourneyService.selectedEliminatoryLevel.eliminatories;
        this.classificationCols = this.tourneyService.eliminatoryClassificationCols.concat(this.tourneyService.classificationCols);
        this.teamService.setMeetingAddress(this.onewayMeetings,this.roundtripMeetings);
        this.updateTourney();
    }

    private updateTourney(): void {
        console.log("Entering updateTourney()");
        let tvo : TourneyVO = this.tourneyService.prepareTourneyVO(this.selectedTourney, this.clientService.selectedClient, true);
        const subscriber = this.tourneyService.saveTourney(tvo, this.saveTourneyErrorHandler('Create Tourney operation'));
        subscriber.subscribe(cs => {}, e => this.subscribeErrorHandler(e), () => {});
    }

    public onClassifcationRowSelect(event : any) {
        console.log(event.data);
        this.tourneyService.makeClassificationName( this.selectedClassificationRow, this.tourneyService.selectedEliminatoryLevel.name);
        this.router.navigate([ClassificationDetailView.redirect]);
    }

    public isPdfEliminatoryPlayoff() : boolean {
        if( !this.containsEliminatory() ) {
            return true;
        }
        const levelNo: number = this.tourneyService.selectedEliminatoryLevelIndex;
        let el: EliminatoryLevel;
        let tNo : number = -1;
        if(levelNo==-1) {
            el = this.selectedTourney.eliminatoryBLevels[this.tourneyService.selectedEliminatoryBLevelIndex];
            return el.name.startsWith("Playoff");
        } else {
            el = this.selectedTourney.eliminatoryLevels[0];
            tNo = el.topLevelTeamNo
        }
        const highestPow2Le : number =  this.levelService.highestPowerOf2LE(tNo);
        return tNo !== highestPow2Le;
    }

    public printPdfTopLevelMeeting() {
        const rowIndex: number = this.tourneyService.selectedEliminatoryLevelIndex;
        console.log("rowIndex=" + rowIndex);
        let level : string;
        let el: EliminatoryLevel;
        if(rowIndex==-1) {
            el = this.selectedTourney.eliminatoryBLevels[0];
            level = "(Elim. B)";
        } else {
            el = this.selectedTourney.eliminatoryLevels[0];   
            level = "(Elim. A)";         
        }
        this.doPrintPdfTopLevelMeeting(el);
    }

    private doPrintPdfTopLevelMeeting(el: EliminatoryLevel) {
        const doc = new jsPDF();
        // We use currentY to track our vertical position on the page
        this.meetingRoundService.selectedTourney = this.selectedTourney;

        let rounds : Round[] = [];
        const r : Round = el.eliminatories[0].round;
        rounds.push(r);
        r.onewayMeetings = this.onewayMeetings;
        this.meetingRoundService.printFullDirection(doc, rounds, el.name, "Andata", true);
        const dir : Direction = el.direction;
        if ( dir === Direction.RoundTrip ) {
            doc.addPage(); // Start Away meetings on a fresh page
            r.roundtripMeetings = this.roundtripMeetings;
            this.meetingRoundService.printFullDirection(doc, rounds, el.name, "Ritorno", true);
        }
        doc.save(`Eliminations-${this.selectedTourney.tourneyName}.pdf`);
    }    

    public printTennisBracket() {
        const rowIndex: number = this.tourneyService.selectedEliminatoryLevelIndex;
        let level : string;
        let el: EliminatoryLevel;
        if(rowIndex==-1) {
            level = "(Elim. B)";
            el = this.selectedTourney.eliminatoryBLevels[this.tourneyService.selectedEliminatoryBLevelIndex];
        } else {
            el = this.selectedTourney.eliminatoryLevels[rowIndex];            
            level = "(Elim. A)";
        }
        this.doPrintTennisBracket(el, level);
    }
    
    private doPrintTennisBracket(el: EliminatoryLevel, level : string) {
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        
        // 1. Gather all "Matches" from the classification lists
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

        // --- NEW FOUR-WAY DISTRIBUTOR LOGIC ---
        const leftMatches: {team1: string, team2: string}[] = [];
        const rightMatches: {team1: string, team2: string}[] = [];

        // Temporary arrays to handle bottom placements separately so we can keep ordering clean
        const leftBottom: {team1: string, team2: string}[] = [];
        const rightBottom: {team1: string, team2: string}[] = [];

        for (let i = 0; i < initialMatches.length; i++) {
            const match = initialMatches[i];
            const positionInGroup = i % 4;

            if (positionInGroup === 0) {
                // 1st: Top Left
                leftMatches.push(match);
            } else if (positionInGroup === 1) {
                // 2nd: Top Right
                rightMatches.push(match);
            } else if (positionInGroup === 2) {
                // 3rd: Bottom Right (Insert at the beginning of the bottom section)
                rightBottom.unshift(match);
            } else if (positionInGroup === 3) {
                // 4th: Bottom Left (Insert at the beginning of the bottom section)
                leftBottom.unshift(match);
            }
        }

        // Combine top and bottom arrays to preserve the visual top-to-bottom layout sequence
        const finalLeftMatches = [...leftMatches, ...leftBottom];
        const finalRightMatches = [...rightMatches, ...rightBottom];
        // --- END OF NEW LOGIC ---

        // 2. Configuration
        const boxW = 50;
        const boxH = 21;
        const padding = 5;
        const sSize = 10; 
        
        const totalMatches = initialMatches.length;
        
        // Print the header tourney name
        let tourneyName = `${this.selectedTourney.tourneyName} ` + level;
        tourneyName = tourneyName.toUpperCase();
        doc.text(tourneyName, pageWidth / 2, (pageHeight / 2) - 95, { align: 'center' });

        // --- ROUND LABELS GENERATION ---
        const roundLabels: string[] = [];
        let labelSize = totalMatches;
        while (labelSize >= 4) {
            roundLabels.push(`${labelSize}° di Finale`);
            labelSize /= 2;
        }
        roundLabels.push("Semifinale", "Finale");

        const roundsPerSide = roundLabels.length - 1; 
        const colSpacing = (pageWidth / 2 - 20) / roundsPerSide;
        
        // 3. Draw Sides (Using our newly constructed arrays)
        this.drawSide(doc, finalLeftMatches, roundsPerSide, colSpacing, padding, boxW, boxH, 'left', pageHeight, roundLabels);
        this.drawSide(doc, finalRightMatches, roundsPerSide, colSpacing, pageWidth - padding - boxW, boxW, boxH, 'right', pageHeight, roundLabels);
        
        // --- 4. Central Final Box ---
        const finalY = (pageHeight / 2) - 25; 
        const finalX = (pageWidth / 2) - (boxW / 2);

        doc.setDrawColor(0);
        doc.setLineWidth(0.5); 
        doc.rect(finalX, finalY, boxW, boxH);
        doc.line(finalX, finalY + boxH / 2, finalX + boxW, finalY + boxH / 2);
        doc.rect(finalX + boxW - sSize - 1, finalY + (boxH / 4) - (sSize / 2), sSize, sSize); 
        doc.rect(finalX + boxW - sSize - 1, finalY + (3 * boxH / 4) - (sSize / 2), sSize, sSize);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("FINALE", pageWidth / 2, finalY - 2, { align: 'center' });

        // --- 5. 3° and 4° Central Final Box ---
        const final2Y = (pageHeight / 2) + 25;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(finalX, final2Y, boxW, boxH);
        doc.line(finalX, final2Y + boxH / 2, finalX + boxW, final2Y + boxH / 2);
        doc.rect(finalX + boxW - sSize - 1, final2Y + (boxH / 4) - (sSize / 2), sSize, sSize); 
        doc.rect(finalX + boxW - sSize - 1, final2Y + (3 * boxH / 4) - (sSize / 2), sSize, sSize);
        doc.setFontSize(12);
        doc.text("3° e 4° Posto", pageWidth / 2, final2Y + 25, { align: 'center' });

        doc.save(`Tabellone-${this.selectedTourney.tourneyName}-${level}.pdf`);
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
}

