import {  Injectable } from '@angular/core';

import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Matrix } from 'app/tourneyonline/domain/matrix';
import { Cell } from 'app/tourneyonline/domain/cell';
import { CellCombobox } from 'app/tourneyonline/domain/tourney-combobox';
import { Observable, of } from 'rxjs';
import { Round } from 'app/tourneyonline/domain/round';
import { Tourney } from 'app/tourneyonline/domain/tourney';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { MeetingService } from 'app/tourneyonline/service/meeting-service';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { RoundVO } from 'app/tourneyonline/domain/round-vo';

@Injectable()
export class MatrixService   {
    roundName: string = "";
    cols: any[] = [];
    onewayMatrix: Matrix = new Matrix();
    roundtripMatrix: Matrix = new Matrix();
    round: Round = new Round();
    roundVO: RoundVO = new RoundVO();
    tourney: Tourney = new Tourney();

    selectedMeeting: Meeting = new Meeting();

    legendCols: any[] = [];
    legendRows: any[] = [];
    onSaveMeetingError: boolean = false;

    constructor( public tourneyService: TourneyService
        , protected meetingService: MeetingService) 
    {}

    ngOnInit(tourney: Tourney, round: Round) {

        this.tourney = tourney;
        this.roundVO = tourney.roundVO;
        this.round = round;

        this.roundName = this.round.name;

        this.cols = this.prepareCols();
        
        this.onewayMatrix    = this.prepareMatrix(this.round.onewayMeetings);
        this.roundtripMatrix = this.prepareMatrix(this.round.roundtripMeetings);
    }

    private prepareCols(): any[]  {
        let cols = [];
        this.legendCols = [];
        
        let col = { field: 'littleName', header: '+', style: 'style1' };
        cols.push(col);

        var letter: String = "A";
        for (let i = 0; i < this.round.teamNames.length; i++) {
            let col = { field: 'points', header: letter, style: 'style0' };
            cols.push(col);    
            letter = this.getNextLetter(letter);
        }
        col = { field: 'total', header: 'Tot', style: 'style1' };
        cols.push(col);
        
        col = { field: 'alias', header: 'Alias', style: 'style1'};
        this.legendCols.push(col);
        col = { field: 'teamName', header: 'Squadre', style: 'style1'};
        this.legendCols.push(col);

        return cols;
    }

    private prepareMatrix(meetings: Meeting[]): Matrix {
        let matrix: Matrix = {
            id: this.tourneyService.getSequenceNumber(),
            rows: []
        };
        this.legendRows = [];

        let letter: String = "A";
        for (let i = 0; i < this.round.teamNames.length; i++) {
            let cells = new Array<Cell>();
            let row = {
                id: i,
                cells: cells
            };
            matrix.rows.push(row);
            let tn1 = this.round.teamNames[i];
            
            let r = {teamName: tn1, alias: letter};
            this.legendRows.push(r);

            let c: Cell = this.newCell("", "", letter.toString(), 'style1', false, false, 0, 0, 0);
            cells.push(c);
            letter = this.getNextLetter(letter);
            let sum : number = 0;
            for (let j = 0; j < this.round.teamNames.length; j++) {
                let tn2 = this.round.teamNames[j];
                let points = 0;
                if (i == j) {
                    c = this.newCell("", "", "", 'diagonalStyle', false, false, 0, 0, 0);
                }
                else {
                    let m1= meetings.find( m => m.teamName1 == tn1 && m.teamName2 == tn2 );
                    if( m1 ) {
                        points = m1.points1;
                    } else {
                        let m2= meetings.find( m => m.teamName1 == tn2 && m.teamName2 == tn1 );
                        if( m2 )
                            points = m2.points2;
                    }
                    c = this.newCell(tn1, tn2, "", 'style0', true, false, i, j, points);
                }
                cells.push(c);
                sum += points;
            }
            c = this.newCell("", "", "", 'totalStyle', false, true, 0, 0, 0);
            c.points = {label: "" + sum, value: sum, row: 0, col: 0};
            cells.push(c);
        }    
        return matrix;     
    }
 
    onOnewayRoundPointChange(cb: CellCombobox, roundId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.onewayMatrix);
        this.prepareMeeting(cb, this.onewayMatrix, this.round.onewayMeetings);
        this.saveRoundMeeting(roundId);
    }

    onRoundtripRoundPointChange(cb: CellCombobox, roundId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.roundtripMatrix);
        this.prepareMeeting(cb, this.roundtripMatrix, this.round.roundtripMeetings);
        this.saveRoundMeeting(roundId);
    }

    onOnewayPlayoffPointChange(cb: CellCombobox, playoffId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.onewayMatrix);
        this.prepareMeeting(cb, this.onewayMatrix, this.round.onewayMeetings);
        this.savePlayoffMeeting(playoffId);
    }

    onRoundtripPlayoffPointChange(cb: CellCombobox, playoffId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.roundtripMatrix);
        this.prepareMeeting(cb, this.roundtripMatrix, this.round.roundtripMeetings);
        this.savePlayoffMeeting(playoffId);
    }

    onOnewayEliminatoryPointChange(cb: CellCombobox, eliminatoryId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.onewayMatrix);
        this.prepareMeeting(cb, this.onewayMatrix, this.round.onewayMeetings);
        this.saveEliminatoryMeeting(eliminatoryId);
    }

    onRoundtripEliminatoryPointChange(cb: CellCombobox, eliminatoryId: number) {
        console.log( cb );
        this.alignSimmetricCell(cb, this.roundtripMatrix);
        this.prepareMeeting(cb, this.roundtripMatrix, this.round.roundtripMeetings);
        this.saveEliminatoryMeeting(eliminatoryId);
    }

    /**
     * Align the specular cell respect the clicked one tht will be chenaged automantically by the GUI
     * 
     * @param cb the combo box selected
     * @param matrix the matrix to align
     */
    private alignSimmetricCell(cb: CellCombobox, matrix: Matrix){
        
        let row = cb.col;
        let col = cb.row + 1;

        const cell: Cell = matrix.rows[row].cells[col];
        if(cb.value == this.roundVO.matchWinnerScores) {
            cell.points.value = 0;
            cell.points.label = "0";
        }
        if(cb.value == 0) {
            cell.points.value = this.roundVO.matchWinnerScores;
            cell.points.label = "" + this.roundVO.matchWinnerScores;
        }

        if(cb.value == this.roundVO.pointsGoldenGoalTieBreakWin) {
            cell.points.value = this.roundVO.pointsGoldenGoalTieBreakDefeat;
            cell.points.label = "" + this.roundVO.pointsGoldenGoalTieBreakDefeat;
        }
        if(cb.value == this.roundVO.pointsGoldenGoalTieBreakDefeat) {
            cell.points.label = "" + this.roundVO.pointsGoldenGoalTieBreakWin;
            cell.points.value = this.roundVO.pointsGoldenGoalTieBreakWin;
        }

        cell.isVisited = true;
        matrix.rows[col-1].cells[row].isVisited = true;
    }

    /**
     * Prepares the meeting to save in the DB in function of the selected point in the combo box of the cell
     * 
     * @param cb the selected combo box
     * @param matrix the matrix of the result
     * @param meetings the list of meetings
     */
    private prepareMeeting(cb: CellCombobox, matrix: Matrix, meetings: Meeting[]) {
        let selectedRow = cb.row;
        const row = matrix?.rows?.[selectedRow];
        if( ! row ) return;
        let selectedCol = cb.col+1;
        let len = matrix.rows[0].cells.length;

        let sum: number = 0;
        for (let c = 1; c < len - 1; c++) {
            const cell = row.cells?.[c];
            if (cell?.points?.value != null) {
                sum += cell.points.value;
            }
        }
        matrix.rows[selectedRow].cells[len-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
        let c1 = matrix.rows[selectedRow].cells[selectedCol];
        c1.style = 'totalStyle';
        
        sum = 0;
        selectedRow = selectedCol-1;
        for (let c = 1; c < len - 1; c++) {
            const cell = row.cells?.[c];
            if (cell?.points?.value != null) {
                sum += cell.points.value;
            }
        }
        matrix.rows[selectedRow].cells[len-1].points = {label: "" + sum, value: sum, row: 0, col: 0};
        selectedCol = cb.row+1;
        let c2 = matrix.rows[selectedRow].cells[selectedCol];
        c2.style = 'totalStyle';

        let sm = meetings.find( m => m.teamName1 == c1.teamName1 && m.teamName2 == c1.teamName2 );
        if( !sm ) return;
        this.selectedMeeting = sm;
        if( this.selectedMeeting == undefined ) {
            sm = meetings.find( m => m.teamName1 == c1.teamName2 && m.teamName2 == c1.teamName1 );
            if( sm ) {
                this.selectedMeeting = sm;
                this.selectedMeeting.points1 = c2.points.value == null ? 0 : c2.points.value;
                this.selectedMeeting.points2 = c1.points.value == null ? 0 : c1.points.value;
            }
        } else {
            this.selectedMeeting.points1 = c1.points.value == null ? 0 : c1.points.value;
            this.selectedMeeting.points2 = c2.points.value == null ? 0 : c2.points.value;
        }
        this.selectedMeeting.status = MeetingStatus.InProgress;
    }

    private saveRoundMeeting( roundId: number): void {
        this.onSaveMeetingError = false;
        let observer = this.meetingService.saveRoundMeetingDb(this.selectedMeeting, this.tourney.id, roundId, this.subscribeErrorHandler() );
        observer.subscribe(n => this.next(n), e => this.saveTourneyErrorHandler(e));            
    }

    private subscribeErrorHandler<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log("Entering subscribeErrorHandler()");
            this.onSaveMeetingError = true;
            console.error(error); // log to console instead
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private savePlayoffMeeting(playoffId: number): void {
        let observer = this.meetingService.savePlayoffMeetingDb(this.selectedMeeting, this.tourney.id, playoffId, this.subscribeErrorHandler());
        observer.subscribe(n => this.next(n), e => this.saveTourneyErrorHandler(e));            
    }

    private saveEliminatoryMeeting(eliminatoryId: number): void {
        let observer = this.meetingService.saveEliminatoryMeetingDb(this.selectedMeeting, this.tourney.id, eliminatoryId, this.subscribeErrorHandler());
        observer.subscribe(n => this.next(n), e => this.saveTourneyErrorHandler(e));            
    }

    private newCell(teamName1: string
        , teamName2: string
        , field: string
        , style: string
        , isEditable: boolean
        , isTotal: boolean
        , row: number
        , col: number
        , points: number): Cell 
    {

        let options: CellCombobox[] = [];
        if(teamName1 != null && teamName2 != null) {            
            for(let i=0; i<=this.roundVO.matchWinnerScores; i++) {
                let cb: CellCombobox = {label: "" + i, value: i, row: row, col: col};
                options.push(cb);
            }
        }

        let cell: Cell = {
              id: 0 // this.tourneyService.getSequenceNumber()
            , field: field
            , style: style
            , points: { label: "" + points, value: points, row: row, col: col }
            , isEditable: isEditable
            , isTotal: isTotal
            , isVisited: false
            , teamName1: teamName1 == null ? "" : teamName1
            , teamName2: teamName2 == null ? "" : teamName2
            , options: options
        };

        return cell;
    }

    private getNextLetter(char: String): String {
        var code: number = char.charCodeAt(0);
        code++;
        return String.fromCharCode(code);
    }

    private next(n: any) {
        console.log(n);
    }

    private saveTourneyErrorHandler<T> (operation = 'operation', result?: T) {
        return (res: any): Observable<T> => {
            console.log("Entering saveTourneyErrorHandler()");
            console.log(`${operation} failed!`);
            console.error(res); // log to console instead
            return of(result as T);
        };
    }

}

