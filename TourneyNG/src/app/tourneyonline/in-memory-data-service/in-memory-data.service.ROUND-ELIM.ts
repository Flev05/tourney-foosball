import { Round } from 'app/tourneyonline/domain/round';
import { Team } from 'app/tourneyonline/domain/team';
import { RoundType, TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType, Direction, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { TeamsPool } from './teams-pool';
import { Meeting } from '../domain/meeting';
import { Tourney } from '../domain/tourney';
import { MeetingDb } from '../domain/meeting-db';

const tourneyId = 3;
const ROUND_NUM = 4;
const BASE_ROUND_ID = 400;

export class InMemoryDataServiceRoundElim  {
static teams = TeamsPool.prepareTeams(12);

private static meetingsDb: Meeting[] = [];
private static counter: number = 100;

// static getMeetings() : Meeting[] {
//   return InMemoryDataServiceRoundElim.meetingsDb;
// }

static getTourneyDb() {

  let rounds =  InMemoryDataServiceRoundElim.prepareDefaultRounds(InMemoryDataServiceRoundElim.teams, 3)

  let tourney: Tourney =
      {id: tourneyId
      ,tourneyName: 'Gironi+Eliminazioni Dirette'
      ,datetime: new Date(2018, 10, 22, 20, 30)
      ,address: 'Via Roma, 110'
      ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
      ,discipline: {name:"Calcio Balilla", id: 0}

      ,tourneyType: TourneyType.Score

      ,access: AccessMode.PU

      ,phases: [PhaseType.R, PhaseType.E]
      ,eliminatoryMode:EliminatoryMode.A
      ,teamSortType: TeamSortType.O

      ,isOnewayRound: "false"
      ,isOnewayPlayoff: "false"
      ,isDaily: "true"

      ,raceDuration:90

      ,matchWinnerScores:3
      ,matchBalanceScores:1

      ,maxMatchesPerMeeting:1
      ,isAllMatches: "true"
      ,playersPerTeam: 2

      ,pointsNeededToWin:9
      ,pointsGoldenGoalTieBreakWin:2
      ,pointsGoldenGoalTieBreakDefeat:1

      ,teams: InMemoryDataServiceRoundElim.teams
      
      ,rounds: rounds

      ,playoffs:[]
      ,eliminatoryLevels: []
      ,objectives:[]  
    };

  let t = { 
      id: tourney.id
    , json: JSON.stringify(tourney)
  };

  return t;
} 

static prepareDefaultRounds(teams : Team[], roundNo: number ) : Round[] {

    let rounds = new Array<Round>();

    let N = teams.length;
    for(let i=0; i<roundNo; i++) {
      let round: Round = InMemoryDataServiceRoundElim.newRound(i + 1);
      rounds.push(round);

      let r: Round = rounds[i];
      for(let j=0; j<ROUND_NUM; j++ ) {
        let t : Team = teams[i*ROUND_NUM + j];
        r.teams.push(t);
      }
    }
    if(N % ROUND_NUM > 0) {
      let r: Round = InMemoryDataServiceRoundElim.newRound(roundNo + 1);
      rounds.push(r);

      for(let i=roundNo * ROUND_NUM; i<N; i++ ) {
        let t : Team = teams[i];
        r.teams.push(t);
      }
    }

    InMemoryDataServiceRoundElim.meetingsDb = [];

    InMemoryDataServiceRoundElim.counter = 100;
    for(let r=0; r<rounds.length; r++) {
      InMemoryDataServiceRoundElim.prepareDefaultMeeting(rounds[r] );
    }

    return rounds;
}
 
static newRound(roundNo : number): Round {
  return {
      id: BASE_ROUND_ID + roundNo
    , name: "GIRONE." + roundNo
    , type: RoundType.R
    , teams: []
    , onewayMeetings: []
    , roundtripMeetings: []
    , classification: []
    , matrix: null
  };
}

static prepareDefaultMeeting(r : Round  )  {

    let teams = r.teams;
    for(let i=0; i<teams.length; i++) {

      let t1 = teams[i];

      for(let j=i+1; j < teams.length; j++) {
        let t2 = teams[j];

        let m : Meeting =  {
            id: InMemoryDataServiceRoundElim.counter
          , name: t1.teamName + " - " + t2.teamName
          , datetime: new Date(2018, 11, 22, 21, 0)
          , address: t1.address
          , country: t1.country
          , status: MeetingStatus.ToPlay
          , team1: t1
          , team2: t2
          , points1: 0
          , points2: 0
          , direction: Direction.OneWay
          , matches: []
        };

        let mdb : MeetingDb =  {
            id: InMemoryDataServiceRoundElim.counter++
          , tourneyId: tourneyId
          , roundId: r.id
          , playoffId: 0
          , eliminatoryId: 0
          , json: JSON.stringify(m)
        };
        
        InMemoryDataServiceRoundElim.meetingsDb.push(mdb);
      }
    }
  }
}
