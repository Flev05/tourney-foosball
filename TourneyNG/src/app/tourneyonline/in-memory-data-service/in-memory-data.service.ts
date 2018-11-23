import { InMemoryDbService } from 'angular-in-memory-web-api';
import { InMemoryDataServiceCSI } from './in-memory-data-service-CSI';
import { InMemoryDataServiceELIM } from './in-memory-data.service.ELIM';
import { InMemoryDataServiceRoundElim } from './in-memory-data.service.ROUND-ELIM';
import { MeetingStatus, Direction } from '../domain/enumerations';
import { MeetingDb } from '../domain/meeting-db';
import { TourneyDb } from '../domain/tourney.db';

export class InMemoryDataService implements InMemoryDbService {

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
      ,direction: Direction.RoundTrip
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
      ,direction: Direction.RoundTrip
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
      ,rule1: {id:1, fromRound:{id:1, position:{label:"3°", value:3},round:{label:"Girone A", value:1} }}
      ,rule2: {id:2, fromRound:{id:2, position:{label:"4°", value:4},round:{label:"Girone B", value:2} }}
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
      ,rule2: {id:1, fromRound:{id:1, position:{label:"3°", value:3},round:{label:"Girone A", value:1} }}
      ,rule1: {id:2, fromRound:{id:2, position:{label:"4°", value:4},round:{label:"Girone B", value:2} }}
      ,points1: 0
      ,points2: 0
    });


  createDb() {
      const tourneys = [
          InMemoryDataServiceCSI.tourneyDb 
        , InMemoryDataServiceELIM.tourneyDb
        , InMemoryDataServiceRoundElim.tourneyDb
      ];

      const meetings : MeetingDb[] = [{
            id: 1,
            tourneyId: 1,
            roundId: 1,
            playoffId: 0,
            eliminatoryId: 0,
            json: InMemoryDataService.json1
        }
        ,{
            id: 2,
            tourneyId: 1,
            roundId: 1,
            playoffId: 0,
            eliminatoryId: 0,
            json: InMemoryDataService.json2
        }
        ,{
          id: 3,
          tourneyId: 1,
          roundId: 2,
          playoffId: 0,
          eliminatoryId: 0,
          json: InMemoryDataService.json3
        }
        ,{
            id: 4,
            tourneyId: 1,
            roundId: 2,
            playoffId: 0,
            eliminatoryId: 0,
            json: InMemoryDataService.json4            
        }
        ,{
          id: 5,
          tourneyId: 1,
          roundId: 1,
          playoffId: 1,
          eliminatoryId: 0,
          json: InMemoryDataService.json5
        }
        ,{
            id: 6,
            tourneyId: 1,
            roundId: 1,
            playoffId: 2,
            eliminatoryId: 0,
            json: InMemoryDataService.json6
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
        {id:6943
          , city:'SOLARO'
          ,cityCode:'I786'
          ,provinceCode:'MI'
          ,zipCode:'20020'
          ,countryCode:'IT'
        }
        ,{id: 8075
          ,city: 'ZIBIDO SAN GIACOMO'
          ,cityCode: 'M176'
          ,provinceCode:'MI'
          ,zipCode:'20080'
          ,countryCode:'IT'
        }
        ,{id:4790
          ,city: 'ORIGGIO'
          ,cityCode: 'G103'
          ,provinceCode:'VA'
          ,zipCode:'21040'
          ,countryCode:'IT'
         }
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
        , meetings
      };
  }
}
