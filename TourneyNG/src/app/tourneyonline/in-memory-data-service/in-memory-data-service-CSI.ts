import { TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType, RoundType, Direction, MeetingStatus } from "../domain/enumerations";
import { Tourney } from "../domain/tourney";
import { TourneyVO } from "../domain/tourney.vo";

export class InMemoryDataServiceCSI  {
  static json1: string = JSON.stringify({
  });
  static json2: string = JSON.stringify( {
  });

  static json3: string = JSON.stringify({
  });
  static json4: string = JSON.stringify({
  });
  static json5: string = JSON.stringify({
  });
  static json6: string = JSON.stringify( {
  });

   private static tourney: Tourney = {
      id: 1
    , tourneyName: 'Gironi+Playoff+Eliminazioni'
    ,datetime: new Date(2018, 11, 24, 10, 33)
    ,address: 'Via Roma, 110'
    ,country: {id:1, city: "Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
    ,discipline: {name:"Calcio Balilla", id: 0}

    ,tourneyType: TourneyType.Score

    ,access: AccessMode.PU

    ,phases: [PhaseType.R, PhaseType.P, PhaseType.E]
    ,eliminatoryMode:EliminatoryMode.M
    ,teamSortType: TeamSortType.O

    ,isOnewayRound: "false"
    ,isOnewayPlayoff: "false"

    ,raceDuration:90

    ,matchWinnerScores:1
    ,matchBalanceScores:0

    ,maxMatchesPerMeeting:9
    ,isAllMatches: "true"
    ,isDaily: "true"
    ,playersPerTeam: 2

    ,pointsNeededToWin:9
    ,pointsGoldenGoalTieBreakWin:1
    ,pointsGoldenGoalTieBreakDefeat:0
   
    ,teams:[
        {id:20,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110"
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          ,players:[
            {id:2, playerName:"Luciano Martino", address:"Via Nilde Iotti, 8"
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
            ,{id:3, playerName:"Raimondo Brancaccio", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
          ]
        }
      ,{id:21,teamName:"AURORA PREGNANA", address:"Via Roma, 110"
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,players:[
            {id:1, playerName:"Salvatore Amoroso", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
            ,{id:4, playerName:"Roberto Bergamaschi", address:""
            ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          }
        ]              
      }
      ,{id:22,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA, 32"
        ,country: {id:1, city:"ORIGGIO", cityCode:"F206", provinceCode: "MI", zipCode:"20153", countryCode:"IT"}
        ,players:[
              {id:5, playerName:"Valter Bergamaschi", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
              ,{id:6, playerName:"Emilio Cattaneo", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
        ]              
      }
      , {id:23,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6"
        ,country: {id:1, city:"SOLARO", cityCode:"F206", provinceCode: "MI", zipCode:"20020", countryCode:"IT"}
        ,players:[
            {id:7, playerName:"Orlando Zambrella", address:""
            ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
            ,{id:8, playerName:"Mirko Cuschera", address:""
            ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
        ]              
      }
      , {id:24,teamName:"ORATORIO ZIBIDO A", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
              {id:9, playerName:"Andrea Mangione", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
            ,{id:10, playerName:"Antonio Pietroforte", address:""
            ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          }
        ]              
      }
      , {id:25,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
              {id:11, playerName:"Mirko Boniotti", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
              ,{id:12, playerName:"Andrea Procopio", address:""
              ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
            }
        ]              
      }
    ]  
    , rounds:[{
        id:1, name: "Girone A", type: RoundType.R
        ,direction: Direction.OneWay
        ,pageSize: 1
        ,daysNo: 1
        ,teamNames:[
            "ORATORIO ZIBIDO B"
          ,"AIROLDI ORIGGIO BIANCA"
        ]
        ,onewayMeetings:[]
        ,roundtripMeetings:[]
        ,classification:[]
      }
      ,{
        id:2, name: "Girone B", type: RoundType.R
        ,direction: Direction.OneWay
        ,pageSize: 1
        ,daysNo: 1
        ,teamNames:[
          "SOLAROSPORT"
          ,"AURORA PREGNANA BLU"
        ]
        ,onewayMeetings:[]
        ,roundtripMeetings:[]
        ,classification:[]
      }
    ]
    ,playoffs: [
      {id:1, round:{
          id:1, name: "Playoff Girone A", type: RoundType.P
          ,direction: Direction.OneWay
          ,pageSize: 1
          ,daysNo: 1
            ,teamNames:[]
          ,onewayMeetings:[]
          ,roundtripMeetings:[]
          ,classification:[]
        }
        ,playoffRules:[
             {id:1
              , ruleName:""
              , isDummy: false
              , fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone A", value:1}
              , bandPosition: 0
              , isAutomatic:true
              ,isDummy: false
            }}
            ,{id:2
              , ruleName:""
              , isDummy: false
              , fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone B", value:2}
            , bandPosition: 0
            , isAutomatic:true
            ,isDummy: false
          }}
          ]
      }
      ,{id:2, round:{
          id:2, name: "Playoff Girone B", type: RoundType.P
          ,direction: Direction.OneWay
          ,pageSize: 1
          ,daysNo: 1
            ,teamNames:[]
          ,onewayMeetings:[]
          ,roundtripMeetings:[]
          ,classification:[]
      }
      ,playoffRules:[
          {id:1
            , ruleName:""
            , isDummy: false
            , fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone B", value:2}
          , bandPosition: 0
          , isAutomatic:true
          ,isDummy: false
        }}
          ,{id:2
            , ruleName:""            
            , isDummy: false
            , fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone A", value:1}
          , bandPosition: 0
          , isAutomatic:true
          ,isDummy: false
        }}
        ]
      }
    ]
    ,eliminatoryLevels: []
    ,objectives:[]
  }
    
  static tourneyDb : TourneyVO = {
      id: InMemoryDataServiceCSI.tourney.id
    , json: JSON.stringify(InMemoryDataServiceCSI.tourney)
  };

  // static getMeetings() : MeetingDb[] {

  //   let mList : Meeting[] =  [{
  //       id: 1,
  //       status: MeetingStatus.ToPlay,
  //       name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
  //       datetime: new Date(2018, 11, 24, 10, 33),
  //       address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
  //       country: {id:1, city: "ZIBIDO SAN GIACOMO"},
  //       team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
  //       team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
  //       ,points1: 0
  //       ,points2: 0
  //       ,direction: Direction.OneWay
  //       ,matches: []
  //     }
  //   ,{
  //       id: 2,
  //       status: MeetingStatus.ToPlay,
  //       name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
  //       datetime: new Date(2018, 11, 30, 15, 0),
  //       address: "VIA ZANZOTTERA 32 20153 MILANO MI",
  //       country: {id:1, city: "ORIGGIO"},
  //       team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
  //       team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
  //       ,points1: 0
  //       ,points2: 0
  //       ,direction: Direction.RoundTrip
  //       ,matches: []
  //     }
  //   ,{
  //     id: 3,
  //     name:  "SOLAROSPORT - AURORA PREGNANA BLU",
  //     status: MeetingStatus.ToPlay,
  //     datetime: new Date(2018, 11, 30, 15, 0),
  //     address: "VIA S.PAOLO, 6 20020 SOLARO MI",
  //     country: {id:1, city: "SOLARO"},
  //     team1: {id:4, teamName: "SOLAROSPORT"},
  //     team2: {id:1, teamName: "AURORA PREGNANA BLU"}
  //     ,points1: 0
  //     ,points2: 0
  //     ,direction: Direction.OneWay
  //     ,matches: []
  //     }
  //   ,{
  //       id: 4,
  //       name:  "AURORA PREGNANA BLU - SOLAROSPORT",
  //       status: MeetingStatus.ToPlay,
  //       datetime: new Date(2018, 11, 30, 15, 0),
  //       address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
  //       country: {id:1, city: "PREGNANA MILANESE"},
  //       team1: {id:1, teamName: "AURORA PREGNANA BLU"},
  //       team2: {id:4, teamName: "SOLAROSPORT"}
  //       ,points1: 0
  //       ,points2: 0
  //       ,direction: Direction.RoundTrip
  //       ,matches: []
  //     }
  //   ,{
  //     id: 5,
  //     name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
  //     status: MeetingStatus.ToPlay,
  //     datetime: new Date(2018, 11, 30, 15, 0),
  //     address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
  //     country: {id:1, city: "ZIBIDO SAN GIACOMO"},
  //     team1: {id:1, teamName: "ORATORIO ZIBIDO B"},
  //     team2: {id:4, teamName: "AIROLDI ORIGGIO BIANCA"}
  //     ,direction: Direction.OneWay
  //     ,matches: []
  //     ,rule1: {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone A", value:1} }}
  //     ,rule2: {id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone B", value:2} }}
  //     ,points1: 0
  //     ,points2: 0
  //     }
  //   ,{
  //       name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
  //       status: MeetingStatus.ToPlay,
  //       datetime: new Date(2018, 11, 30, 15, 0),
  //       address: "VIA ZANZOTTERA 32 20153 MILANO MI",
  //       country: {id:1, city: "ORIGGIO"},
  //       team1: {id:1, teamName: "AIROLDI ORIGGIO BIANCA"},
  //       team2: {id:4, teamName: "ORATORIO ZIBIDO B"}
  //       ,direction: Direction.RoundTrip
  //       ,matches: []
  //       ,rule2: {id:1, fromRound:{id:1, position:{label:"1°", value:1},round:{label:"Girone B", value:1} }}
  //       ,rule1: {id:2, fromRound:{id:2, position:{label:"2°", value:2},round:{label:"Girone A", value:2} }}
  //       ,points1: 0
  //       ,points2: 0
  //     }];

  //     let mts : MeetingDb[] =  [{
  //       id: 1,
  //       tourneyId: 1,
  //       roundId: 1,
  //       playoffId: 0,
  //       eliminatoryId: 0,
  //       json: JSON.stringify(mList[0])
  //     }
  //   ,{
  //       id: 2,
  //       tourneyId: 1,
  //       roundId: 1,
  //       playoffId: 0,
  //       eliminatoryId: 0,
  //       json: JSON.stringify(mList[1])
  //     }
  //   ,{
  //     id: 3,
  //     tourneyId: 1,
  //     roundId: 2,
  //     playoffId: 0,
  //     eliminatoryId: 0,
  //     json: JSON.stringify(mList[2])
  //   }
  //   ,{
  //       id: 4,
  //       tourneyId: 1,
  //       roundId: 2,
  //       playoffId: 0,
  //       eliminatoryId: 0,
  //       json: JSON.stringify(mList[3])
  //     }
  //   ,{
  //     id: 5,
  //     tourneyId: 1,
  //     roundId: 1,
  //     playoffId: 1,
  //     eliminatoryId: 0,
  //     json: JSON.stringify(mList[4])
  //   }
  //   ,{
  //       id: 6,
  //       tourneyId: 1,
  //       roundId: 1,
  //       playoffId: 2,
  //       eliminatoryId: 0,
  //       json: JSON.stringify(mList[5])
  //     }];

  //   return mts;
  // }
}
