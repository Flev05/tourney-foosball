import { InMemoryDbService } from 'angular-in-memory-web-api';
 import {TourneyType} from './tourneyType';
import { RoundType } from 'app/tourneyonline/domain/roundType';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, tourneyName: 'CSI Open A 2017'
        ,dateInMillis: 1543606200000
        ,dateAsString: "30/11/2018"
        ,timeAsString: "20:30:00"
        ,address: 'Via Roma, 110'
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

        ,tourneyType: TourneyType.Score

        ,access: "public"

        ,phases: ["playoff", "elimination"]

        ,raceDuration:90

        ,matchWinnerScores:3
        ,matchLoserScores:0
        ,matchBalanceScores:1
        
        ,pointsNeededToWin:9
        ,pointsGoldenGoalTieBreakWin:2
        ,pointsGoldenGoalTieBreakDefeat:1

        ,teamNo:32
        ,roundNo:2
        ,playoffNo:0
        ,eliminationLevel:16
        
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
           ,{id:7, firstname:"Marco",     lastname:"La Ratta", address:""
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
            id:1, name: "Girone A", type: RoundType.R, isRoundTrip: true
            ,teams:[
               {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
              ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
            ]
            ,meetings:[{
                  id: 1,
                  name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
                  dateInMillis : 1543606200000,
                  date: "30/11/2018",
                  time: "20:30:00",
                  address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
                  country: {id:1, city: "ZIBIDO SAN GIACOMO"},
                  team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
                  team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
              }
              ,{
                  id: 2,
                  name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
                  dateInMillis : 1543606200000,
                  date: "30/11/2018",
                  time: "20:30:00",
                  address: "VIA ZANZOTTERA 32 20153 MILANO MI",
                  country: {id:1, city: "ORIGGIO"},
                  team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
                  team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
              }
            ]
          }
          ,{
            id:2, name: "Girone B", type: RoundType.R, isRoundTrip: true
            ,teams:[
              {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 20020 SOLARO MI"}
             ,{id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
            ]
            ,meetings:[{
                id: 1,
                name:  "SOLAROSPORT - AURORA PREGNANA BLU",
                dateInMillis : 1543606200000,
                date: "30/11/2018",
                time: "20:30:00",
                address: "VIA S.PAOLO, 6 20020 SOLARO MI",
                country: {id:1, city: "SOLARO"},
                team1: {id:4, teamName: ""},
                team2: {id:1, teamName: "AURORA PREGNANA BLU"}
            }
            ,{
                id: 2,
                name:  "AURORA PREGNANA BLU - SOLAROSPORT",
                dateInMillis : 1543606200000,
                date: "30/11/2018",
                time: "20:30:00",
                address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
                country: {id:1, city: "PREGNANA"},
                team1: {id:1, teamName: "AURORA PREGNANA BLU"},
                team2: {id:4, teamName: "SOLAROSPORT"}
            }]
          }
        ]
        ,playoffs:[
          {id:1, round:{
              id:1, name: "Playoff Girone A", type: RoundType.P, isRoundTrip: true
              ,teams:[
                {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
                ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
              ]
              ,meetings:[{
                    id: 1,
                    name:  "ORATORIO ZIBIDO B - AIROLDI ORIGGIO BIANCA",
                    dateInMillis : 1543606200000,
                    date: "30/11/2018",
                    time: "20:30:00",
                    address: "VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI",
                    country: {id:1, city: "ZIBIDO SAN GIACOMO"},
                    team1: {id:6, teamName: "ORATORIO ZIBIDO B"},
                    team2: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"}
                }
                ,{
                    id: 2,
                    name:  "AIROLDI ORIGGIO BIANCA - ORATORIO ZIBIDO B",
                    dateInMillis : 1543606200000,
                    date: "30/11/2018",
                    time: "20:30:00",
                    address: "VIA ZANZOTTERA 32 20153 MILANO MI",
                    country: {id:1, city: "ORIGGIO"},
                    team1: {id:3, teamName: "AIROLDI ORIGGIO BIANCA"},
                    team2: {id:6, teamName: "ORATORIO ZIBIDO B"}
                }
              ]
            }
            ,playoffConfigs:[
                 {id:1, fromRound:{id:1, position:{label:"3°", value:3},round:{label:"Girone A", value:1} }}
                ,{id:2, fromRound:{id:2, position:{label:"4°", value:4},round:{label:"Girone B", value:2} }}
              ]
          }
          ,{id:2, round:{
            id:2, name: "Playoff Girone B", type: RoundType.P, isRoundTrip: true
            ,teams:[
              {id:6,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 - 20020 SOLARO MI"}
              ,{id:3,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
            ]
            ,meetings:[{
                  id: 1,
                  name:  "SOLAROSPORT - AURORA PREGNANA BLU",
                  dateInMillis : 1543606200000,
                  date: "30/11/2018",
                  time: "20:30:00",
                  address: "VIA S.PAOLO, 6 - 20020 SOLARO MI",
                  country: {id:1, city: "SOLARO"},
                  team1: {id:6, teamName: "SOLAROSPORT"},
                  team2: {id:3, teamName: "AURORA PREGNANA BLU"}
              }
              ,{
                  id: 2,
                  name:  "AURORA PREGNANA BLU - SOLAROSPORT",
                  dateInMillis : 1543606200000,
                  date: "30/11/2018",
                  time: "20:30:00",
                  address: "Via Roma, 110 - 20010 Pregnana Milanese (MI)",
                  country: {id:1, city: "PREGNANA"},
                  team1: {id:3, teamName: "AURORA PREGNANA BLU"},
                  team2: {id:6, teamName: "SOLAROSPORT"}
              }
            ]
          }
        ,playoffConfigs:[
             {id:1, fromRound:{id:1, position:{label:"4°", value:4},round:{label:"Girone A", value:1} }}
            ,{id:2, fromRound:{id:2, position:{label:"3°", value:3},round:{label:"Girone B", value:2} }}
          ]
        }
        ]
        ,eliminatories:[

        ]
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
