import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Tourney } from '../../../domain/tourney';
import { Calendar } from '../../../domain/calendar';
import { Meeting } from '../../../domain/meeting';
import { TourneyService } from '../../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';

const redirect = '/round/dv';

@Component({
    templateUrl: './round-listview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class RoundListView extends CalendarDetailView {
 
}

