import { InMemoryDbService } from 'angular-in-memory-web-api';
 import {TourneyType, TeamSortType} from './enumerations';
import { RoundType } from './enumerations';
import { PhaseType, EliminatoryMode, AccessMode } from './enumerations';
import { Team } from './team';
import { Round } from 'app/tourneyonline/domain/round';
import { Meeting } from './meeting';

const  teams1 = [
  {id:1,teamName:"SALLUC", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
      {id:2, firstname:"Luciano",   lastname:"Martino"}
      ,{id:3, firstname:"Salvatore",  lastname:"Amoroso"}
    ]
  }
  ,{id:2,teamName:"B&B", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Roberto",   lastname:"Bergamaschi"}
      ,{id:3, firstname:"Valter",  lastname:"Bergamaschi"}
    ]
  }
  ,{id:3,teamName:"I POETI", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Raimondo", lastname:"Brancaccio"}
      ,{id:3, firstname:"Andrea",   lastname:"Procopio"}
    ]
  }
  ,{id:4,teamName:"MALDIVE", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Savino", lastname:"Caporale"}
      ,{id:3, firstname:"Pino",   lastname:"Selini"}
    ]
  }
  ,{id:5,teamName:"BINGABUNGA", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Antonio", lastname:"Pietroforte"}
      ,{id:3, firstname:"Andrea",   lastname:"Mangione"}
    ]
  }
  ,{id:6,teamName:"DelucaDimaria", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Salvo", lastname:"De Luca"}
      ,{id:3, firstname:"Andrea",   lastname:"Di Maria"}
    ]
  }
  ,{id:7,teamName:"OrlandoMirko", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Orlando", lastname:"Zambrella"}
      ,{id:3, firstname:"Mirko",   lastname:"Cuschera"}
    ]
  }
  ,{id:8,teamName:"MicheleAlessio", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Michele", lastname:"Monteleone"}
      ,{id:3, firstname:"Alessio",   lastname:"Lioy"}
    ]
  }
  ,{id:9,teamName:"I BONIOTTI", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Mirko", lastname:"Boniotti"}
      ,{id:3, firstname:"Claudio",   lastname:"Boniotti"}
    ]
  }
  ,{id:10,teamName:"CavalieriLombardo", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Salvatore", lastname:"Cavaliere"}
      ,{id:3, firstname:"Giuseppe",   lastname:"Lombardo"}
    ]
  }
  ,{id:11,teamName:"EmilioNino1", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:12,teamName:"EmilioNino2", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:13,teamName:"EmilioNino3", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:14,teamName:"EmilioNino4", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:15,teamName:"EmilioNino5", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:16,teamName:"EmilioNino6", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
  ,{id:17,teamName:"EmilioNino7", address:"Via Roma, 110"
  ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
  ,players:[
       {id:2, firstname:"Emilio", lastname:"Cattaneo"}
      ,{id:3, firstname:"Antonino",   lastname:"Scarpaci"}
    ]
  }
];

export class InMemoryDataService implements InMemoryDbService {

  prepareDefaultRounds(teams : Team[]) : Round[] {

    let meetings = this.prepareDefaultMeeting(teams);

    let round : Round = {
      id: 1
      , name: "Mono Round"
      , type: RoundType.R
      , isOneway: true
      , teams: teams
      , meetings: meetings
      , classification: []
    };

    let rounds = new Array<Round>();

    rounds.push(round);

    return rounds;
  }
 
  private prepareDefaultMeeting(teams : Array<Team>) : Array<Meeting> {

    let meetings = new Array<Meeting>();

    for(let i=0; i<teams.length; i++) {

      let t1 = teams[i];

      for(let j=i+1; j < teams.length; j++) {
        let t2 = teams[j];
        let m: Meeting = {id: i+j
          , name: t1.teamName + " - " + t2.teamName
          , datetime: new Date(2018, 11, 22, 21, 0)
          , address: t1.address
          , country: t1.country
          , team1: t1
          , team2: t2
          , score1: 0
          , score2: 0
        };

        meetings.push(m);
      }
    }

    return meetings;
  }

  createDb() {
      const tourneys = [
        {id: 1, tourneyName: 'CSI Open A 2017'
        ,datetime: new Date(2018, 11, 24, 10, 33)
        ,address: 'Via Roma, 110'
        ,country: {id:1, city: "Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

        ,tourneyType: TourneyType.Score

        ,access: AccessMode.PU

        ,phases: [PhaseType.R, PhaseType.P, PhaseType.E]
        ,eliminatoryMode:EliminatoryMode.M
        ,teamSortType: TeamSortType.O

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
            id:1, name: "Girone A", type: RoundType.R, isOneway: false 
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
            id:2, name: "Girone B", type: RoundType.R , isOneway: false
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
              id:1, name: "Playoff Girone A", type: RoundType.P, isOneway: false 
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
            id:2, name: "Playoff Girone B", type: RoundType.P , isOneway: false
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
      ,{id: 2, tourneyName: 'Preliminari 2018/2019'
          ,datetime: new Date(2018, 10, 22, 20, 30)
          ,address: 'Via Roma, 110'
          ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
          ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

          ,tourneyType: TourneyType.Score

          ,access: AccessMode.PU

          ,phases: [PhaseType.R]
          ,eliminatoryMode:EliminatoryMode.M
          ,teamSortType: TeamSortType.O

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
            ,teams: teams1 
            ,rounds: this.prepareDefaultRounds(teams1) 
            ,playoffs:[]
            ,meetings:[]  
            ,eliminatoryLevels: []
            ,selectedEliminatoryLevel:{isOneway:true, eliminatories:[]}
            ,objectives:[]  
          }
        ];

      const login = [
      { id: 1
          , username: 'lmartino'
          , password: 'pippo0000'
      }];

      const logout = [
      { id: 1
          , username: 'lmartino'
          , password: 'pippo0000'
      }];
      const changePassword = [
      { id: 1
          , username: 'lmartino'
          , password: 'pippo0000'
      }];
      
      const resetPassword = [
      { id: 1
          , username: 'lmartino'
          , password: 'pippo0000'
      }];
      
        const roles = [
        {
          id: 1, name: 'Developer', description: 'Il costruttore'
        },
        {
          id: 2, name: 'Owner', description: 'Il proprietario'
        },
        {
          id: 3, name: 'Admin', description: 'L\'amministratore'
        },
        {
          id: 4, name: 'User', description: 'L\'utilizzatore'
        }
      ];

      const userng = [
        { id: 1
          , firstname: 'Luciano'
          , lastname: 'Martino'
          , username: 'lmartino'
          , password: 'pippo'
          , address: 'Via Nilde Iotti, 8 - 20010 Pregnana Milanase (MI)'
          , email: 'luciano.martino@gmail.com'
          , phoneNumber: '339 78 58 194'
          , roles: [
            {
              id: 1, name: 'Developer', description: ''
            },
            {
              id: 2, name: 'Owner', description: ''
            },
            {
              id: 3, name: 'Admin', description: ''
            },
            {
              id: 4, name: 'User', description: ''
            }
          ]
        },
        { id: 2 
        , firstname: 'Roberto'
        , lastname: 'Bergamaschi'
        , username: 'rbergamaschi'
        , password: 'pippo'
        , address: 'Via Novara, 46 - 20010 Pregnana Milanase (MI)'
        , email: 'gino.eolo@gmail.com'
        , phoneNumber: '339 78 58 194'
        , roles: [
            {
              id: 2, name: 'Owner', description: 'Il proprietario'
            },
            {
              id: 3, name: 'Admin', description: 'Amministratore di sistema'
            }
          ]
        },
        { id: 3 
        , firstname: 'Valter'
        , lastname: 'Bergamaschi'
        , username: 'vbergamaschi'
        , password: 'pippo'
        , address: 'Via Novara, 46 - 20010 Pregnana Milanase (MI)'
        , email: 'gino.eolo@gmail.com'
        , phoneNumber: '339 78 58 194'
        , roles: [
            {
              id: 4, name: 'User', description: 'Amministratore di sistema'
            }
          ]
        },
      ];

      const clients = [
        {id: 1
          , firstname: 'Luciano'
          , lastname: 'Martino'
          , businessName: ''
          , address: 'Via Nilde Iotti, 8 - 20010 Pregnana Milanese (MI)'
          , email: 'luciano.martino@gmail.com'
          , phoneNumber: '339 78 58 194'
          , country: {"id":10,"city":"ACATE","cityCode":"A014","provinceCode":"RG","zipCode":"97011","countryCode":"IT"}
        },
        {id: 2
          , firstname: ''
          , lastname: ''
          , businessName: 'ASD Aurora Pregnana'
          , address: 'Via Roma, 100 - 20010 Pregnana Milanese (MI)'
          , email: 'info@asdaurorapregnana.it'
          , phoneNumber: '02 23 33 44 55'
          , country: {"id":100,"city":"ALASSIO","cityCode":"A122","provinceCode":"SV","zipCode":"17021","countryCode":"IT"}
        },
        {id: 3
          , firstname: 'Roberto'
          , lastname: 'Bergamaschi'
          , businessName: ''
          , address: 'Via Novara, 26 - 20010 Pregnana Milanese (MI)'
          , email: 'gino.eolo@gmail.com'
          , phoneNumber: '333 33 44 555'
          , country: {"id":800,"city":"BORGO PACE","cityCode":"B026","provinceCode":"PU","zipCode":"61040","countryCode":"IT"}
        },
      ];

      const countries = [
        {id: 10
          , city: 'ACATE'
          , cityCode: 'A014'
          , provinceCode: 'RG'
          , zipCode: '97011'
          , countryCode: 'IT'
        },
        {id: 100
          , city: 'ALASSIO'
          , cityCode: 'A122'
          , provinceCode: 'SV'
          , zipCode: '17021'
          , countryCode: 'IT'
        },
        {id: 800
          , city: 'BORGO PACE'
          , cityCode: 'B026'
          , provinceCode: 'PU'
          , zipCode: '61040'
          , countryCode: 'IT'
        },
        {id: 801
          , city: 'PREGNANA MILANESE'
          , cityCode: 'H106'
          , provinceCode: 'MI'
          , zipCode: '20010'
          , countryCode: 'IT'
        },
        {id: 8000
          , city: 'VITTORIO VENETO'
          , cityCode: 'M089'
          , provinceCode: 'TV'
          , zipCode: '31029'
          , countryCode: 'IT'
        },
      ];

      const typologies = [
            {name:"Calcio Balilla", code:"cb"}
            ,{name:"Calcio a 5", code:"c5"}
            ,{name:"Palla Canestro", code:"basket"}
            ,{name:"Palla Volo", code:"volley"}
          ]  ;

      return {login
        , logout
        , tourneys
        , userng
        , clients
        , roles
        , countries
        , changePassword
        , resetPassword
        , typologies
      };
  }
}
