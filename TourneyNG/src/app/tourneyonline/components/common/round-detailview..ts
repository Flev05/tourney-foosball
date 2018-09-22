import { Location } from '@angular/common';

import { Round } from '../../domain/round';
import { Meeting } from '../../domain/meeting';
import { TourneyService } from '../../service/tourneyservice';
import { AbstractTourneyDetailView } from './tourney-detailview';
import { CountryService } from 'app/tourneyonline/service/countryservice';

export abstract class RoundDetailView extends AbstractTourneyDetailView {

    rounds: [Round];

    protected rows: any[] = [];

    constructor(protected tourneyService: TourneyService, protected location: Location, protected countryService: CountryService ) {
        super(tourneyService, location, countryService);
    }

    ngOnInit() {
        this.rounds = this.selectedTourney.rounds;

        this.updateRowGroupMetaData();
    }

   protected updateRowGroupMetaData() {

        let row : number = 0;

        var roundMap: Map<string, Meeting> = new Map<string, Meeting>();

        for (let i = 0; i < this.rounds.length; i++) {
            
            let round : Round = this.rounds[i];

            for (let j = 0; j < round.calendars.length; j++) {
                
                let m : Meeting = round.calendars[j];

                let currentKey = this.makeKey(round, m);  
                let len = round.calendars.length;
                console.log(currentKey + " rowspan=" + len);       

                this.rows.push(m);
                this.rows[row].roundName = round.name;    
                this.rows[row].meetingName = m.name;    
                if(!roundMap.has(currentKey)) {
                    roundMap.set(currentKey, m);
                    this.rows[row].rowspanSize = len;
                } else {
                    this.rows[row].rowspanSize = undefined;
                }

                this.rows[row].teamName1 = m.team1.teamName;
                this.rows[row].teamName2 = m.team2.teamName;
                
                this.rows[row].date = m.date;    
                this.rows[row].time = m.time;    
                this.rows[row].address = m.address;    

                this.rows[row].score1 = m.score1;
                this.rows[row].score2 = m.score2;
                
                row++;                
            }
        }
    }
    
    makeKey( round : Round, cal : Meeting) : string {
        let key = round.name + " - " + cal.name;
        return key;
    }
}
