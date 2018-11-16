import { Location } from '@angular/common';

import { AbstractView } from './abstract-view';
import { Round } from 'app/tourneyonline/domain/round';
import { Classification } from 'app/tourneyonline/domain/classification';
import { TourneyService } from 'app/tourneyonline/service/tourneyservice';
import { CountryService } from 'app/tourneyonline/service/countryservice';
import { PlayoffRule } from '../../domain/playoff-rule';
import { Direction } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Team } from 'app/tourneyonline/domain/team';
import { Match } from 'app/tourneyonline/domain/match';

export abstract class AbstractDetailView extends AbstractView {

    it: any;

    constructor(
        protected tourneyService: TourneyService,
        protected location: Location,
        protected countryService: CountryService,
    ) {
        super(tourneyService, location);
    }

    ngOnInit() {
        this.selectedTourney = this.tourneyService.selectedTourney;

        this.countryService.loadCountries().subscribe(c => {
            this.countries = c;
        });

        this.it = {
        	firstDayOfWeek: 1,
        	dayNames: [ "domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato" ],
        	dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
        	dayNamesMin: [ "D","L","M","M","G","V","S" ],
            
            monthNames: [ "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno"
                         ,"Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre" ],

        	monthNamesShort: [ "Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic" ],
            today: 'Oggi',
            clear: 'Clear'
        };

        let today = new Date();

        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        
        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
    }

    protected initClassification(r : Round) {
        r.classification = [];
        for(let t of r.teams) {
            let c : Classification = {id:this.tourneyService.getSequenceNumber()
                , team: t
                , points: 0
                , played: 0
                , won: 0
                , lost: 0
                , penalty: 0
                , goalsDone: 0
                , goalsConceded: 0
                , goalsDiff: 0
            };
            r.classification.push(c);
        }
    }

    protected createMeeting(t1: Team, t2: Team, pc1: PlayoffRule, pc2: PlayoffRule, d: Direction): Meeting {
        let matches = new Array<Match>();

        for(let i=0; i<this.selectedTourney.maxMatchesPerMeeting; i++) {
            let m: Match = {id:this.tourneyService.getSequenceNumber()
                ,players1: []
                ,players2: []
                ,score1:0
                ,score2:0
            };
            matches.push(m);
        }

        let m : Meeting = {
            id: this.tourneyService.getSequenceNumber(),
            name: "",
            datetime: this.selectedTourney.datetime,
            address: this.selectedTourney.address,
            country: this.selectedTourney.country,
            team1: t1,
            team2: t2,
            score1: 0,
            score2: 0,
            rule1: pc1,
            rule2: pc2,
            ruleName: "",
            direction: d,
            matches: matches
        };

        return m;
    }

}
