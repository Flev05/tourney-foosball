import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Classification } from 'app/tourneyonline/domain/classification';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { Subscription, interval } from 'rxjs';
import { MeetingRoundService } from '../admin/round/meeting-round-service';
import { Round } from 'app/tourneyonline/domain/round';

// Simplified structural interfaces based on your TourneyNG architecture
export interface Tournament {
  id: number;
  name: string;
  meetingMap: { [day: number]: Meeting[] };
  classification: Classification[]; // Your Classification[] array
}

@Component({
  selector: 'app-projector-view',
  standalone: false,
  templateUrl: './projector-view-component.html',
  styleUrls: ['./projector-view-component.css']
})
export class ProjectorViewComponent implements OnInit  {
  // Your 8 tournaments with 6 teams each
  public tournaments: Tournament[] = []; 
  
  // Track which tournament is currently being projected
  public currentIndex: number = 0;
  public currentTournament!: Tournament;

  private rotationSubscription!: Subscription;
  private readonly ROTATION_TIME = 10000; // 30 seconds in milliseconds

  constructor(private router: Router,
    public tourneyService: TourneyService
    , private meetingRoundService: MeetingRoundService
  ) 
  {
    console.log("constructor");
  }

  ngOnInit(): void {
    this.loadTournamentsData();
    if (this.tournaments.length > 0) {
      this.currentTournament = this.tournaments[this.currentIndex];
      this.startAutomaticRotation();
    }
  }

  private loadTournamentsData(): void {
    const st = this.tourneyService.selectedTourney;
    this.tournaments = [];

    for( let r of st.roundVO.rounds ) {
 
      const classifications : Classification [] = [];
      for( let c of r.classification ) {
        classifications.push(c);
      }

      const meetingMap: { [day: number]: Meeting[] } = this.loadTournamentsDataAlternate(r);
      let t : Tournament = {id: st.id == null ? 0 : st.id, name: r.name, meetingMap: meetingMap, classification: classifications};
      this.tournaments.push(t);
    }
  }

  public loadTournamentsDataAlternate(currentRound : Round): { [day: number]: Meeting[] } {
    const st = this.tourneyService.selectedTourney;
    const onewayOnly : boolean = st.isOnewayRound == "true";
    const meetingMap: { [day: number]: Meeting[] } = {};
    this.meetingRoundService.prepareMeetingsMap(currentRound);
    for (let d = 1; d <= currentRound.daysNo; d++) {
        if (!meetingMap[d]) {
          meetingMap[d] = [];
        }
        let om = this.meetingRoundService.getOnewayMeetingsOfDay(d) ;
        meetingMap[d].push(...om);
        if( !onewayOnly ) {
          let rm = this.meetingRoundService.getRoundtripMeetingsOfDay(d) ;
          meetingMap[d].push(...rm);
        }
    }
    return meetingMap;
  }

  private startAutomaticRotation(): void {
    // Emits every 30 seconds
    this.rotationSubscription = interval(this.ROTATION_TIME).subscribe(() => {
      this.nextTournament();
    });
  }

  private nextTournament(): void {
    // Loop through the 8 tournaments (0 to 7)
    this.currentIndex = (this.currentIndex + 1) % this.tournaments.length;
    this.currentTournament = this.tournaments[this.currentIndex];
  }

  // Method to return back to the admin control panel
  public exitProjectorMode(): void {
    this.router.navigate(['/dashboard']); // Adjust to your actual dashboard route path
  }

  ngOnDestroy(): void {
    if (this.rotationSubscription) {
      this.rotationSubscription.unsubscribe();
    }
  }
}