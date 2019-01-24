import { TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType, RoundType, Direction, MeetingStatus } from "../domain/enumerations";
import { Tourney } from "../domain/tourney";
import { TourneyDb } from "../domain/tourney.db";
import { MeetingDb } from "../domain/meeting-db";

export class InMemoryDataServiceCSI  {
  static json1: string = JSON.stringify({
    id: 1,
    status: MeetingStatus.ToPlay,
    name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
    datetime: new Date(2018, 11, 24, 10, 33),
    address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
    country: {id:1, city: "ZIBIDO SAN GIACOMO"},
    team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
    team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
    ,points1: 0
    ,points2: 0
    ,direction: Direction.OneWay
    ,matches: []
  });
  static json2: string = JSON.stringify( {
    id: 2,
    status: MeetingStatus.ToPlay,
    name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
    datetime: new Date(2018, 11, 30, 15, 0),
    address: "VIA ZANZOTTERA 32 20153 MILANO MI",
    country: {id:1, city: "ORIGGIO"},
    team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
    team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
    ,points1: 0
    ,points2: 0
    ,direction: Direction.RoundTrip
    ,matches: []
  });

  static json3: string = JSON.stringify({
    id: 3,
    name:  "SOLAROSPORT - AURORA PREGNANA BLU",
    status: MeetingStatus.ToPlay,
    datetime: new Date(2018, 11, 30, 15, 0),
    address: "VIA S.PAOLO, 6 20020 SOLARO MI",
    country: {id:1, city: "SOLARO"},
    team1: {id:4, teamName: "SOLAROSPORT"},
    team2: {id:1, teamName: "AURORA PREGNANA BLU"}
    ,points1: 0
    ,points2: 0
    ,direction: Direction.OneWay
    ,matches: []
  });
  static json4: string = JSON.stringify({
    id: 4,
    name:  "AURORA PREGNANA BLU - SOLAROSPORT",
    status: MeetingStatus.ToPlay,
    datetime: new Date(2018, 11, 30, 15, 0),
    address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
    country: {id:1, city: "PREGNANA MILANESE"},
    team1: {id:1, teamName: "AURORA PREGNANA BLU"},
    team2: {id:4, teamName: "SOLAROSPORT"}
    ,points1: 0
    ,points2: 0
    ,direction: Direction.RoundTrip
    ,matches: []
  });
  static json5: string = JSON.stringify({
    id: 5,
      name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
    status: MeetingStatus.ToPlay,
    datetime: new Date(2018, 11, 30, 15, 0),
    address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
    country: {id:1, city: "ZIBIDO SAN GIACOMO"},
    team1: null,
    team2: null,
    direction: Direction.OneWay
    ,matches: []
    ,rule1: {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone A", value:1} }}
    ,rule2: {id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone B", value:2} }}
    ,points1: 0
    ,points2: 0
  });
  static json6: string = JSON.stringify( {
    id: 6,
    name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
    status: MeetingStatus.ToPlay,
    datetime: new Date(2018, 11, 30, 15, 0),
    address: "VIA ZANZOTTERA 32 20153 MILANO MI",
    country: {id:1, city: "ORIGGIO"},
    team1: null,
    team2: null,
    direction: Direction.RoundTrip
    ,matches: []
    ,rule2: {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone B", value:1} }}
    ,rule1: {id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone A", value:2} }}
    ,points1: 0
    ,points2: 0
  });

   private static tourney: Tourney = {
      id: 1
    , tourneyName: 'Gironi+Playoff+Eliminazioni'
    ,datetime: new Date(2018, 11, 24, 10, 33)
    ,address: 'Via Roma, 110'
    ,country: {id:1, city: "Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
    ,discipline: {name:"Calcio Balilla", code:"cb"}

    ,tourneyType: TourneyType.Score

    ,access: AccessMode.PU

    ,phases: [PhaseType.R, PhaseType.P, PhaseType.E]
    ,eliminatoryMode:EliminatoryMode.M
    ,teamSortType: TeamSortType.O

    ,isOnewayRound: false
    ,isOnewayPlayoff: false

    ,raceDuration:90

    ,matchWinnerScores:1
    ,matchBalanceScores:0

    ,maxMatchesPerMeeting:9
    ,isAllMatches:true
    ,playersPerTeam: 2

    ,pointsNeededToWin:9
    ,pointsGoldenGoalTieBreakWin:1
    ,pointsGoldenGoalTieBreakDefeat:0
    
    ,players:[
        {id:1, playerName:"Salvatore Amoroso", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:2, playerName:"Luciano Martino", address:"Via Nilde Iotti, 8"
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:3, playerName:"Raimondo Brancaccio", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:4, playerName:"Roberto Bergamaschi", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:5, playerName:"Valter Bergamaschi", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:6, playerName:"Emilio Cattaneo", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:7, playerName:"Orlando Zambrella", address:""
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:8, playerName:"Mirko Cuschera", address:""
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:9, playerName:"Andrea Mangione", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:10, playerName:"Antonio Pietroforte", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:11, playerName:"Mirko Boniotti", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:12, playerName:"Andrea Procopio", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:13, playerName:"Claudio Boniotti", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:14, playerName:"Salvo De Luca", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:15, playerName:"Andrea Di Maria", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:16, playerName:"Antonino Scarpaci", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:17, playerName:"Michele Monteleone", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:18, playerName:"Alessio Lioy", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:19, playerName:"Salvatore Cavaliere", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:20, playerName:"Giuseppe Lombardo", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:21, playerName:"Savino Caporale", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:22, playerName:"Pino Selini", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
    ]  
    ,teams:[
        {id:20,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110"
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          ,players:[
            {id:2, playerName:"Luciano Martino"}
            ,{id:3, playerName:"Raimondo Brancaccio"}
          ]
        }
      ,{id:21,teamName:"AURORA PREGNANA", address:"Via Roma, 110"
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso"}
          ,{id:4, playerName:"Roberto Bergamaschi"}
        ]              
      }
      ,{id:22,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA, 32"
        ,country: {id:1, city:"ORIGGIO", cityCode:"F206", provinceCode: "MI", zipCode:"20153", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso"}
          ,{id:4, playerName:"Roberto Bergamaschi"}
        ]              
      }
      , {id:23,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6"
        ,country: {id:1, city:"SOLARO", cityCode:"F206", provinceCode: "MI", zipCode:"20020", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso"}
          ,{id:4, playerName:"Roberto Bergamaschi"}
        ]              
      }
      , {id:24,teamName:"ORATORIO ZIBIDO A", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso"}
          ,{id:4, playerName:"Roberto Bergamaschi"}
        ]              
      }
      , {id:25,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso"}
          ,{id:4, playerName:"Roberto Bergamaschi"}
        ]              
      }
    ]  
    , rounds:[{
        id:1, name: "Girone A", type: RoundType.R
        ,teams:[
            {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
          ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
        ]
        ,meetings:[]
        ,classification:[]
      }
      ,{
        id:2, name: "Girone B", type: RoundType.R
        ,teams:[
          {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 20020 SOLARO MI"}
          ,{id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
        ]
        ,meetings:[]
        ,classification:[]
      }
    ]
    ,playoffs: [
      {id:1, round:{
          id:1, name: "Playoff Girone A", type: RoundType.P
          ,teams:[]
          ,meetings:[]
          ,classification:[]
        }
        ,playoffRules:[
             {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone A", value:1} }}
            ,{id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone B", value:2} }}
          ]
      }
      ,{id:2, round:{
        id:2, name: "Playoff Girone B", type: RoundType.P
        ,teams:[]
        ,meetings:[]
        ,classification:[]
      }
    ,playoffRules:[
         {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone B", value:2} }}
        ,{id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone A", value:1} }}
      ]
    }
    ]
    ,eliminatoryLevels: []
    ,objectives:[]
  }
    
  static tourneyDb : TourneyDb = {
      id: InMemoryDataServiceCSI.tourney.id
    , json: JSON.stringify(InMemoryDataServiceCSI.tourney)
  };

  static getMeetings() : MeetingDb[] {

    let mts : MeetingDb[] =  [{
        id: 1,
        tourneyId: 1,
        roundId: 1,
        playoffId: 0,
        eliminatoryId: 0,
        json: InMemoryDataServiceCSI.json1
    }
    ,{
        id: 2,
        tourneyId: 1,
        roundId: 1,
        playoffId: 0,
        eliminatoryId: 0,
        json: InMemoryDataServiceCSI.json2
    }
    ,{
      id: 3,
      tourneyId: 1,
      roundId: 2,
      playoffId: 0,
      eliminatoryId: 0,
      json: InMemoryDataServiceCSI.json3
    }
    ,{
        id: 4,
        tourneyId: 1,
        roundId: 2,
        playoffId: 0,
        eliminatoryId: 0,
        json: InMemoryDataServiceCSI.json4            
    }
    ,{
      id: 5,
      tourneyId: 1,
      roundId: 1,
      playoffId: 1,
      eliminatoryId: 0,
      json: InMemoryDataServiceCSI.json5
    }
    ,{
        id: 6,
        tourneyId: 1,
        roundId: 1,
        playoffId: 2,
        eliminatoryId: 0,
        json: InMemoryDataServiceCSI.json6
    }];
   
    return mts;
  }
}
