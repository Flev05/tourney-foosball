import { InMemoryDbService } from 'angular-in-memory-web-api';
 import {TourneyType} from './tourneyType';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, tourneyName: 'Summer week 2018'
        ,dateInMillis: 1543606200000
        ,dateAsString: "2018/11/30"
        ,timeAsString: "20:30:00"
        ,address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
        ,country: {id:1, city:"Pregnana Milanese", cityCode:"F206", provinceCode: "MI", zipCode:"20010", countryCode:"IT"}
        ,discipline: {id:2, name:"Calcio Balilla", code:"cb"}

        ,tourneyType: TourneyType.Score

        ,phases: ["elimination"]

        ,raceDuration:90

        ,matchWinnerScores:3
        ,matchLoserScores:0
        ,matchBalanceScores:1
        
        ,pointsNeededToWin:9
        ,pointsGoldenGoalTieBreakWin:0
        ,pointsGoldenGoalTieBreakDefeat:1

        ,teamNo:32
        ,roundNo:2
        ,playoffNo:0
        ,eliminationLevel:16
        
        ,players:[
            {id:1, firstname:"Salvatore", lastname:"Amoroso"}
           ,{id:2, firstname:"Luciano",   lastname:"Martino"}
           ,{id:3, firstname:"Raimondo",  lastname:"Brancaccio"}
           ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
           ,{id:5, firstname:"Valter",    lastname:"Bergamaschi"}
           ,{id:6, firstname:"Emilio",    lastname:"Cattaneo"}
           ,{id:7, firstname:"Marco",     lastname:"La Ratta"}
          ]  
        ,teams:[
           {id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"
             ,players:[
                {id:2, firstname:"Luciano",   lastname:"Martino"}
                ,{id:3, firstname:"Raimondo",  lastname:"Brancaccio"}
              ]
            }
          ,{id:2,teamName:"AURORA PREGNANA", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"
            ,players:[
               {id:1, firstname:"Salvatore", lastname:"Amoroso"}
              ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
            ]              
          }
          ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"
            ,players:[
               {id:1, firstname:"Salvatore", lastname:"Amoroso"}
              ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
            ]              
          }
          , {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 - 20020 SOLARO MI"
            ,players:[
               {id:1, firstname:"Salvatore", lastname:"Amoroso"}
              ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
            ]              
          }
          , {id:5,teamName:"ORATORIO ZIBIDO A", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"
            ,players:[
               {id:1, firstname:"Salvatore", lastname:"Amoroso"}
              ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
            ]              
          }
          , {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"
            ,players:[
               {id:1, firstname:"Salvatore", lastname:"Amoroso"}
              ,{id:4, firstname:"Roberto",   lastname:"Bergamaschi"}
            ]              
          }
        ]  
        , rounds:[{
            id:1, name: "Girone A"
            ,teams:[
               {id:6,teamName:"ORATORIO ZIBIDO B", address:"VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI"}
              ,{id:3,teamName:"AIROLDI ORIGGIO BIANCA", address:"VIA ZANZOTTERA 32 20153 MILANO MI"}
            ]
          }
          ,{
            id:2, name: "Girone B"
            ,teams:[
              {id:4,teamName:"SOLAROSPORT", address:"VIA S.PAOLO, 6 20020 SOLARO MI"}
             ,{id:1,teamName:"AURORA PREGNANA BLU", address:"Via Roma, 110 - 20010 Pregnana Milanese (MI)"}
            ]
          }
        ]
        ,playoffs:[]
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
