import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Tourney } from '../../domain/tourney';
import { Calendar } from '../../domain/calendar';
import { Meeting } from '../../domain/meeting';
import { TourneyService } from '../../service/tourneyservice';
import { CalendarDetailView } from '../calendar/calendar-detailview';

@Component({
    templateUrl: './round-detailview.html',
    styles: [`        
        .ui-table table {
            border-collapse: collapse;
            width: auto;
            table-layout: fixed;
        }
  `]
})
export class RoundDetailView extends CalendarDetailView {
}
