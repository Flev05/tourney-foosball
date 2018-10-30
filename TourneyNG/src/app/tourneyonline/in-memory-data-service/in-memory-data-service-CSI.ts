import { TourneyType, AccessMode, PhaseType, EliminatoryMode, TeamSortType, RoundType } from "../domain/enumerations";

export class InMemoryDataServiceCSI  {

  static tourney = {id: 1
    , tourneyName: 'CSI Open A 2017'
    ,datetime: new Date(2018, 11, 24, 10, 33)
    ,address: 'Via Roma, 110'
    ,country: {id:1, city: "Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
    ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

    ,tourneyType: TourneyType.Score

    ,access: AccessMode.PU

    ,phases: [PhaseType.R, PhaseType.P, PhaseType.E]
    ,eliminatoryMode:EliminatoryMode.M
    ,teamSortType: TeamSortType.O

    ,isOnewayRound: false
    ,isOnewayPlayoff: false

    ,raceDuration:90

    ,matchWinnerScores:3
    ,matchLoserScores:0
    ,matchBalanceScores:1
    
    ,pointsNeededToWin:9
    ,pointsGoldenGoalTieBreakWin:2
    ,pointsGoldenGoalTieBreakDefeat:1
    
    ,players:[
        {id:1, firstname:"Salvatore", lastname:"Amoroso", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:2, firstname:"Luciano",   lastname:"Martino", address:"Via Nilde Iotti, 8"
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:3, firstname:"Raimondo",  lastname:"Brancaccio", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:5, firstname:"Valter",    lastname:"Bergamaschi", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:6, firstname:"Emilio",    lastname:"Cattaneo", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:7, firstname:"Orlando",     lastname:"Zambrella", address:""
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:8, firstname:"Mirko",     lastname:"Cuschera", address:""
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:9, firstname:"Andrea",     lastname:"Mangione", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:10, firstname:"Antonio",     lastname:"Pietroforte", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:11, firstname:"Mirko",     lastname:"Boniotti", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:12, firstname:"Andrea",     lastname:"Procopio", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:13, firstname:"Claudio",     lastname:"Boniotti", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:14, firstname:"Salvo",     lastname:"De Luca", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:15, firstname:"Andrea",     lastname:"Di Maria", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:16, firstname:"Antonino",     lastname:"Scarpaci", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:17, firstname:"Michele",     lastname:"Monteleone", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:18, firstname:"Alessio",     lastname:"Lioy", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:19, firstname:"Salvatore",     lastname:"Cavaliere", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:20, firstname:"Giuseppe",     lastname:"Lombardo", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:21, firstname:"Savino",     lastname:"Caporale", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
        ,{id:22, firstname:"Pino",     lastname:"Selini", address:""
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        }
    ]  
    ,teams:[
        {id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110"
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          ,players:[
            {id:2, firstname:"Luciano",   lastname:"Martino"}
            ,{id:3, firstname:"Raimondo",  lastname:"Brancaccio"}
          ]
        }
      ,{id:2,teamName:"AURORA PREGNANA", address:"Via Roma, 110"
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
          ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
        ]              
      }
      ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA, 32"
        ,country: {id:1, city:"ORIGGIO", cityCode:"F206", provinceCode: "MI", zipCode:"20153", countryCode:"IT"}
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
          ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
        ]              
      }
      , {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6"
        ,country: {id:1, city:"SOLARO", cityCode:"F206", provinceCode: "MI", zipCode:"20020", countryCode:"IT"}
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
          ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
        ]              
      }
      , {id:5,teamName:"ORATORIO ZIBIDO A", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
          ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
        ]              
      }
      , {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI"
        ,country: {id:1, city:"ZIBIDO SAN GIACOMO", cityCode:"F206", provinceCode: "MI", zipCode:"20080", countryCode:"IT"}
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
          ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
        ]              
      }
    ]  
    , rounds:[{
        id:1, name: "Girone A", type: RoundType.R
        ,teams:[
            {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
          ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
        ]
        ,meetings:[{
              id: 1,
              name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
              datetime: new Date(2018, 11, 24, 10, 33),
              address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
              country: {id:1, city: "ZIBIDO SAN GIACOMO"},
              team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
              team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
          }
          ,{
              id: 2,
              name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
              datetime: new Date(2018, 11, 30, 15, 0),
              address: "VIA ZANZOTTERA 32 20153 MILANO MI",
              country: {id:1, city: "ORIGGIO"},
              team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
              team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
          }
        ]
        ,classification:[]
      }
      ,{
        id:2, name: "Girone B", type: RoundType.R
        ,teams:[
          {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 20020 SOLARO MI"}
          ,{id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
        ]
        ,meetings:[{
            id: 1,
            name:  "SOLAROSPORT - AURORA PREGNANA BLU",
            datetime: new Date(2018, 11, 30, 15, 0),
            address: "VIA S.PAOLO, 6 20020 SOLARO MI",
            country: {id:1, city: "SOLARO"},
            team1: {id:4, teamName: ""},
            team2: {id:1, teamName: "AURORA PREGNANA BLU"}
        }
        ,{
            id: 2,
            name:  "AURORA PREGNANA BLU - SOLAROSPORT",
            datetime: new Date(2018, 11, 30, 15, 0),
            address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
            country: {id:1, city: "PREGNANA"},
            team1: {id:1, teamName: "AURORA PREGNANA BLU"},
            team2: {id:4, teamName: "SOLAROSPORT"}
        }]
        ,classification:[]
      }
    ]
    ,playoffs:[
      {id:1, round:{
          id:1, name: "Playoff Girone A", type: RoundType.P
          ,teams:[
            {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
            ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
          ]
          ,meetings:[{
                id: 1,
                name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
                datetime: new Date(2018, 11, 30, 15, 0),
                address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
                country: {id:1, city: "ZIBIDO SAN GIACOMO"},
                team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
                team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
            }
            ,{
                id: 2,
                name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
                datetime: new Date(2018, 11, 30, 15, 0),
                address: "VIA ZANZOTTERA 32 20153 MILANO MI",
                country: {id:1, city: "ORIGGIO"},
                team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
                team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
            }
          ]
          ,classification:[]
        }
        ,playoffConfigs:[
              {id:1, fromRound:{id:1, position:{label:"3°", value:3},round:{label:"Girone A", value:1} }}
            ,{id:2, fromRound:{id:2, position:{label:"4°", value:4},round:{label:"Girone B", value:2} }}
          ]
      }
      ,{id:2, round:{
        id:2, name: "Playoff Girone B", type: RoundType.P
        ,teams:[
          {id:6,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 - 20020 SOLARO MI"}
          ,{id:3,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
        ]
        ,meetings:[{
              id: 1,
              name:  "SOLAROSPORT - AURORA PREGNANA BLU",
              datetime: new Date(2018, 11, 30, 15, 0),
              address: "VIA S.PAOLO, 6 - 20020 SOLARO MI",
              country: {id:1, city: "SOLARO"},
              team1: {id:6, teamName: "SOLAROSPORT"},
              team2: {id:3, teamName: "AURORA PREGNANA BLU"}
          }
          ,{
              id: 2,
              name:  "AURORA PREGNANA BLU - SOLAROSPORT",
              datetime: new Date(2018, 11, 30, 15, 0),
              address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
              country: {id:1, city: "PREGNANA"},
              team1: {id:3, teamName: "AURORA PREGNANA BLU"},
              team2: {id:6, teamName: "SOLAROSPORT"}
          }
        ]
        ,classification:[]
      }
    ,playoffConfigs:[
          {id:1, fromRound:{id:1, position:{label:"4°", value:4},round:{label:"Girone A", value:1} }}
        ,{id:2, fromRound:{id:2, position:{label:"3°", value:3},round:{label:"Girone B", value:2} }}
      ]
    }
    ]
    ,eliminatoryLevels: []
    ,selectedEliminatoryLevel:{isOneway:false, eliminatories:[]}
    ,objectives:[]
  }
}
