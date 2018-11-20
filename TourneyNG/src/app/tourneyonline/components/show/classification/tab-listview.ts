import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Round } from '../../../domain/round';
import { Playoff } from '../../../domain/playoff';

import { AbstractListView } from '../../common/abstract-listview';
import { TourneyService } from '../../../service/tourneyservice';
import { Classification } from 'app/tourneyonline/domain/classification';
import { MeetingStatus } from 'app/tourneyonline/domain/enumerations';

@Component({
    templateUrl: './tab-listview.html',
    styles: [`
        /* Column Priorities */
        @media only all {
            th.ui-p-6,
            td.ui-p-6,
            th.ui-p-5,
            td.ui-p-5,
            th.ui-p-4,
            td.ui-p-4,
            th.ui-p-3,
            td.ui-p-3,
            th.ui-p-2,
            td.ui-p-2,
            th.ui-p-1,
            td.ui-p-1 {
                display: none;
            }
        }
        
        /* Show priority 1 at 320px (20em x 16px) */
        @media screen and (min-width: 20em) {
            th.ui-p-1,
            td.ui-p-1 {
                display: table-cell;
            }
        }
        
        /* Show priority 2 at 480px (30em x 16px) */
        @media screen and (min-width: 30em) {
            th.ui-p-2,
            td.ui-p-2 {
                display: table-cell;
            }
        }
        
        /* Show priority 3 at 640px (40em x 16px) */
        @media screen and (min-width: 40em) {
            th.ui-p-3,
            td.ui-p-3 {
                display: table-cell;
            }
        }
        
        /* Show priority 4 at 800px (50em x 16px) */
        @media screen and (min-width: 50em) {
            th.ui-p-4,
            td.ui-p-4 {
                display: table-cell;
            }
        }
        
        /* Show priority 5 at 960px (60em x 16px) */
        @media screen and (min-width: 60em) {
            th.ui-p-5,
            td.ui-p-5 {
                display: table-cell;
            }
        }
        
        /* Show priority 6 at 1,120px (70em x 16px) */
        @media screen and (min-width: 70em) {
            th.ui-p-6,
            td.ui-p-6 {
                display: table-cell;
            }
        }
    `]
})
export class TabListView extends AbstractListView {
    static tabDvRedirect: string = "classification/lv/classification";

    roundsRows: any[] = [];
    playoffRows: any[] = [];

    constructor(
        protected tourneyService: TourneyService,
        protected router: Router,
        protected location: Location,
    ) {
        super(TabListView.tabDvRedirect, tourneyService, router, location);
    }

    ngOnInit() {
        super.ngOnInit();
        this.selectedTourney = this.tourneyService.selectedTourney;

        let rounds = this.selectedTourney.rounds;
        this.roundsRows = this.prepareRoundClassification(rounds);

        let playoffs = this.selectedTourney.playoffs;
        this.playoffRows = this.preparePlayoffClassification(playoffs, rounds);
    }

    private prepareRoundClassification(rounds: Round[]): any[] {

        let row : number = 0;
        let rows: any[] = [];

        var roundMap: Map<string, Classification> = new Map<string, Classification>();

        for (let round of rounds) {
            
            for (let c of round.classification) {
                
                rows.push(c);
                rows[row].roundName = round.name;    
                rows[row].teamName = c.team.teamName;    
                rows[row].points = c.points;    
                rows[row].played = c.played;    
                rows[row].won = c.won;    
                rows[row].lost = c.lost;    
                rows[row].balanced = c.balanced;    
                rows[row].goalsDone = c.goalsDone;    
                rows[row].goalsConceded = c.goalsConceded;    
                rows[row].goalsDiff = c.goalsDiff;    

                let len = round.meetings.length;

                let currentKey = this.makeKey(round, c);  
                if(!roundMap.has(currentKey)) {
                    roundMap.set(currentKey, c);
                    rows[row].rowspanSize = len;
                } else {
                    rows[row].rowspanSize = undefined;
                }
                row++;                
            }
        }

        return rows;
    }

    private preparePlayoffClassification(playoffs: Playoff[], rounds: Round[]): any[] {
        let rows: any[] = [];

        let playoffRounds: Round[] = [];
        for(let p of playoffs) {
            playoffRounds.push(p.round);
        }

        return rows;
    }

    private makeKey( round : Round, c : Classification) : string {
        let key = round.name + " - " + c.team.teamName;
        return key;
    }

    goBack(): void {
        this.location.back();
    }
}

