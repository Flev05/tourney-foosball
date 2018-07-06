import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import {TreeNode} from 'primeng/api';

import { Tourney } from '../../../domain/tourney';
import { Calendar } from '../../../domain/calendar';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';


@Component({
    templateUrl: './elimination-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class EliminationListView extends CalendarDetailView {
    data: TreeNode[];

    ngOnInit() {
        super.ngOnInit();

        this.data = [{
            label: 'Finale: ORATORIO ZIBIDO G Vs VIRTUS BOVISIO GIALLA',
            children: [
                {
                    label: 'Semifinali:',
                    children: [
                        {
                            label: 'ORATORIO ZIBIDO G'
                        },
                        {
                            label: 'VIRTUS BOVISIO GIALLA'
                        }
                    ]
                },
                {
                    label: 'Child 2',
                    children: [
                        {
                            label: 'Child 2.1'
                        },
                        {
                            label: 'Child 2.2'
                        }
                    ]
                }
            ]
        }];
    }
}
