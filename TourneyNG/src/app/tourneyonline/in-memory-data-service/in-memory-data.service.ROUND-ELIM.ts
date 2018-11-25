import { Round } from 'app/tourneyonline/domain/round';
import { Team } from 'app/tourneyonline/domain/team';
import { RoundType, TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType, Direction, MeetingStatus } from 'app/tourneyonline/domain/enumerations';
import { Meeting } from 'app/tourneyonline/domain/meeting';
import { TeamsPool } from './teams-pool';
import { PlayersPool } from './players-pool';
import { MeetingDb } from '../domain/meeting-db';
import { Tourney } from '../domain/tourney';

const tourneyId = 3;

export class InMemoryDataServiceRoundElim  {
static teams = TeamsPool.prepareTeams(10);

private static meetingsDb: MeetingDb[] = [];
private static counter: number = 100;

static getMeetings() : MeetingDb[] {
  return InMemoryDataServiceRoundElim.meetingsDb;
}

static getTourneyDb() {

  let rounds =  InMemoryDataServiceRoundElim.prepareDefaultRounds(InMemoryDataServiceRoundElim.teams, 2)

  let tourney: Tourney =
      {id: tourneyId
      ,tourneyName: 'Gironi+Eliminatore 2018/2019'
      ,datetime: new Date(2018, 10, 22, 20, 30)
      ,address: 'Via Roma, 110'
      ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
      ,discipline: {name:"Calcio Balilla", code:"cb"}

      ,tourneyType: TourneyType.Score

      ,access: AccessMode.PU

      ,phases: [PhaseType.R, PhaseType.E]
      ,eliminatoryMode:EliminatoryMode.M
      ,teamSortType: TeamSortType.O

      ,isOnewayRound: false
      ,isOnewayPlayoff: false

      ,raceDuration:90

      ,matchWinnerScores:3
      ,matchLoserScores:0
      ,matchBalanceScores:1

      ,maxMatchesPerMeeting:1
      ,isAllMatches:true
      ,playersPerTeam: 2

      ,pointsNeededToWin:9
      ,pointsGoldenGoalTieBreakWin:2
      ,pointsGoldenGoalTieBreakDefeat:1

      ,players: PlayersPool.players

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
      for(let j=0; j<4; j++ ) {
        let t : Team = teams[i*4 + j];
        r.teams.push(t);
      }
    }
    if(N % 4 > 0) {
      let r: Round = InMemoryDataServiceRoundElim.newRound(roundNo + 1);
      rounds.push(r);

      for(let i=roundNo * 4; i<N; i++ ) {
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
      id: roundNo
    , name: "GIRONE." + roundNo
    , type: RoundType.R
    , teams: []
    , meetings: []
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
        let m: Meeting = {id: InMemoryDataServiceRoundElim.counter++
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
        };

        r.meetings.push(m);
        let json = JSON.stringify(m);
        let mdb : MeetingDb =  {
          id: m.id,
          tourneyId: tourneyId,
          roundId: r.id,
          playoffId: 0,
          eliminatoryId: 0,
          json: json
        };

        InMemoryDataServiceRoundElim.meetingsDb.push(mdb);
      }
    }
  }
}
