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

    public printTennisBracket(rowIndex: number) {
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        
        let el: EliminatoryLevel = this.selectedTourney.eliminatoryLevels[rowIndex];
        
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
        const boxW = 40; 
        const boxH = 20;
        const padding = 3;
        
        // Determine how many rounds/columns we need (e.g., 8 matches -> 3 rounds to reach semi)
        const roundsPerSide = Math.log2(matchesPerSide) + 1; 
        const colSpacing = (pageWidth / 2 - 20) / roundsPerSide;

        // --- ROUND LABELS ---
        // We create an array of labels. We'll use the index to pick the right one.
        const roundLabels = ["8° di Finale", "4° di Finale", "Semifinale", "Finale"];
        
        // 3. Draw Sides
        this.drawSide(doc, leftMatches, roundsPerSide, colSpacing, padding, boxW, boxH, 'left', pageHeight, roundLabels);
        this.drawSide(doc, rightMatches, roundsPerSide, colSpacing, pageWidth - padding - boxW, boxW, boxH, 'right', pageHeight, roundLabels);

        // 4. Central Final Box
        const finalY = pageHeight / 2 - 30;
        const finalX = pageWidth / 2 - 25;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(finalX, finalY, 50, 20);
        doc.setFontSize(12);
        doc.text("FINALE", pageWidth / 2, finalY + - 1, { align: 'center' });

        // 5. 3° and 4° Central Final Box
        const final2Y = pageHeight / 2 + 30;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(finalX, final2Y, 50, 20);
        doc.setFontSize(12);
        doc.text("3° e 4° Posto", pageWidth / 2, final2Y - 1, { align: 'center' });

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
            doc.text(labels[r] || `Round ${r+1}`, x + (w / 2), 40, { align: 'center' });
                        
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
                if (r === 0) {
                    doc.setFontSize(7);
                    doc.text(matches[i].team1.substring(0, 18), x + 1, y + 8);
                    doc.text(matches[i].team2.substring(0, 18), x + 1, y + 14);
                }

                // Draw Score Boxes
                const sSize = 9;
                doc.rect(x + w - sSize - 1, y + (h/4) - (sSize/2), sSize, sSize); 
                doc.rect(x + w - sSize - 1, y + (3*h/4) - (sSize/2), sSize, sSize);

                // Draw Connector Lines to next round
                const nextX = (side === 'left') ? x + w : x;
                const direction = (side === 'left') ? 1 : -1;
                const lineLen = spacing - w;

                // Horizontal line out
                doc.line(nextX, y + h/2, nextX + (lineLen / 2) * direction, y + h/2 );
                
                // Vertical connection line (every pair)
                if (i % 2 === 0 && currentMatchesCount > 1) {
                    const bottomY = y + h/2 + verticalGap;
                    doc.line(nextX + (lineLen / 2) * direction, y + h/2, nextX + (lineLen / 2) * direction, bottomY);
                    // Horizontal line into next round box
                    doc.line(nextX + (lineLen / 2) * direction, (y + h/2 + bottomY) / 2, nextX + lineLen * direction, (y + h/2 + bottomY) / 2);
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
        let currentY = 15; 
        for (let i = 0; i < el.eliminatories.length; i++) {
            const e : Eliminatory = el.eliminatories[i];
            const r : Round = e.round;
            
            // 1. Prepare the data for this specific round
            this.meetingRoundService.prepareMeetingsMap(r);
            let meetings: any[] = [];
            for (let md = 1; md <= r.daysNo; md++) {
                let ms = this.meetingRoundService.getOnewayMeetingsOfDay(md);
                if (ms && ms.length > 0) {
                    let newDate = new Date(ms[0].datetime);
                    let range = this.dfp.transform(newDate);
                    let dto: MeetingDto = new MeetingDto();
                    dto.round = r.name;
                    dto.direction = "Andata,";
                    dto.separator = true;
                    dto.md = md;
                    dto.days = r.daysNo;
                    dto.weekRange = range;
                    dto.signLine = false;
                    meetings.push(dto);
                    for (let m of ms) {
                        let matchDto: MeetingDto = { round: r.name, direction: "Andata,", separator: false, md: m.day, days: r.daysNo, weekRange: range, meeting: m };
                        meetings.push(matchDto);
                        let signLineDto: MeetingDto = new MeetingDto();
                        signLineDto.round = r.name;
                        signLineDto.direction = "Andata,";
                        signLineDto.separator = true;
                        signLineDto.md = md;
                        signLineDto.days = r.daysNo;
                        signLineDto.weekRange = range;
                        signLineDto.signLine = true;
                        meetings.push(signLineDto);
                    }
                }
            }
            // 2. CHECK SPACE: If we are near the bottom (e.g., past 240mm), 
            // start a new page for the next round title and table.
            if (currentY > 240) {
                doc.addPage();
                currentY = 15;
            }
            // 3. Draw the Round Title
            doc.setFontSize(14);
            doc.text(`${this.selectedTourney.tourneyName} - ${r.name}`, 14, currentY);
            // 4. Draw the table starting slightly below the text
            autoTable(doc, {
                head: [["In Casa", "P1", "P2", "Fuori Casa"]],
                body: this.meetingRoundService.formatRoundData(meetings),
                startY: currentY + 5,
                theme: 'striped',
                columnStyles: {
                    0: { halign: 'right', cellWidth: 'auto' },
                    1: { halign: 'center', cellWidth: 15 },
                    2: { halign: 'center', cellWidth: 15 },
                    3: { halign: 'left', cellWidth: 'auto' }
                },
                didParseCell: (data) => {
                    // Only apply this logic to the header row
                    if (data.section === 'head') {
                        if (data.column.index === 0) data.cell.styles.halign = 'right';
                        if (data.column.index === 1) data.cell.styles.halign = 'center';
                        if (data.column.index === 2) data.cell.styles.halign = 'center';
                        if (data.column.index === 3) data.cell.styles.halign = 'left';
                    }
                },
                styles: { minCellHeight: 12 }, // Ensure cell is tall enough for a 10mm box
                didDrawCell: (data) => {
                    // Check if we are in the body and in the P1 or P2 columns (index 1 and 2)
                    if (data.section === 'body' && (data.column.index === 1 || data.column.index === 2)) {
                        // Only draw if the content is empty (which means points were 0)
                        if (data.cell.text[0] === '') {
                            const boxSize = 10; // 10mm                            
                            // Calculate center of the cell to place the box
                            const posX = data.cell.x + (data.cell.width - boxSize) / 2;
                            const posY = data.cell.y + (data.cell.height - boxSize) / 2;
                            // Draw the rectangle (x, y, width, height, style)
                            doc.setDrawColor(0); // Black border
                            doc.rect(posX, posY, boxSize, boxSize, 'S'); // 'S' means Stroke (outline)
                        }
                    }
                }
            });
            // 5. Update currentY for the NEXT round in the loop
            // We find where the table ended and add a 10mm gap
            currentY = (doc as any).lastAutoTable.finalY + 15;
        }
        doc.save(`Eliminations-${this.selectedTourney.tourneyName}.pdf`);
    }

    /**
     * Creates the 2 big tables in the topEliminatoryLevel from the received sortedEliminatories list.
     * The 4 first position are built from the 4 first position of the sortedEliminatories.
     * The remaining positions are built starting from the last postions of the sortedEliminatories
     * down to the 5° position.
     * 
     * @param topEl the top ElementaryLevel to organize as a two big tables
     * @param sortedEliminatories the sorted Eliminatory list from which take the team couples 
     */
    private placeOnTwoBigTables(topEl: EliminatoryLevel, sortedEliminatories : Eliminatory[] ) {
        console.log("Entering placeOnTwoBigTables()");

        let p1: number = 0;
        let p2: number = topEl.eliminatories.length / 2;
        let p3: number = topEl.eliminatories.length - 1;
        let p4: number = p2 - 1;
        
        let p : number=0;
        let li = sortedEliminatories.length - 1;
        for( let i=0; i<topEl.eliminatories.length; i++ ) {
            if( i % 4 == 0 ) {
                p = p1++;
            }
            if( i % 4 == 1 ) {
                p = p2++;
            }
            if( i % 4 == 2 ) {
                p = p3--;
            }
            if( i % 4 == 3 ) {
                p = p4--;
            }
            if( i < 4 ) {
                topEl.eliminatories[p] = sortedEliminatories[i];
            } else {
                topEl.eliminatories[p] = sortedEliminatories[li--];
            }
            const e = topEl.eliminatories[p];
            for(let m of e.round.onewayMeetings ) {
                // this.saveMeeting(e, m);
            }
            for(let m of e.round.roundtripMeetings ) {
                // this.saveMeeting(e, m);
            }
        }       
        // this.updateTourney();
    }
}

