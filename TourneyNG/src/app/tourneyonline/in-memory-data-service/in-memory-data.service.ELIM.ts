import { TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType } from "app/tourneyonline/domain/enumerations";
import { TeamsPool } from "./teams-pool";
import { PlayersPool } from "./players-pool";

export class InMemoryDataServiceELIM {

private static tourney = 
  {id: 2
    , tourneyName: 'Eliminatore 2018/2019'
      ,datetime: new Date(2018, 10, 22, 20, 30)
      ,address: 'Via Roma, 110'
      ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
      ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

      ,tourneyType: TourneyType.Score

      ,access: AccessMode.PU

      ,phases: [PhaseType.E]
      ,eliminatoryMode:EliminatoryMode.A
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
      ,teams: TeamsPool.teams

      ,rounds: []
      ,playoffs:[]
      ,meetings:[]  
      ,eliminatoryLevels: []
      ,selectedEliminatoryLevel:{isOneway:false, eliminatories:[]}
      ,objectives:[]  
    };

    static tourneyDb = {
        id: InMemoryDataServiceELIM.tourney.id
      , json: JSON.stringify(InMemoryDataServiceELIM.tourney)
    } 
}
