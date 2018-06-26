import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, name: 'Summer week 2018', date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
            , calendars: [
              {id: 1, name: 'Turno 1.1', date: '01-05-2018', time: '13:45'
              , meetings: [
                  {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "SALEMI", score1:7, score2:3}
                , {id:2, team1: "Maldive", team2: "B&B", score1:7, score2:3}
                , {id:3, team1: "Poeti", team2: "GROOT", score1:6, score2:7}
                , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:1, score2:7}
                , {id:5, team1: "Attenti a quei 2", team2: "Quota Drone", score1:7, score2:5}
              ]
            },
            {id: 2, name: 'Turno 1.2', date: '08-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "Maldive", score1:7, score2:1}
              , {id:2, team1: "SALEMI", team2: "Attenti a quei 2", score1:4, score2:7}
              , {id:3, team1: "Poeti", team2: "Fialette", score1:7, score2:2}
              , {id:4, team1: "GROOT", team2: "MINGA BUN", score1:7, score2:5}
              , {id:5, team1: "B&B", team2: "Quota Drone", score1:0, score2:7}
            ]
          },
          {id: 3, name: 'Turno 1.3', date: '17-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "Maldive", score1:7, score2:0}
              , {id:2, team1: "SALEMI", team2: "GROOT", score1:7, score2:0}
              , {id:3, team1: "Poeti", team2: "Attenti a quei 2", score1:2, score2:7}
              , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:2, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:0}
            ]
          },
          {id: 4, name: 'Turno 1.4', date: '24-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "SALEMI", score1:6, score2:7}
              , {id:2, team1: "Maldive", team2: "GROOT", score1:6, score2:7}
              , {id:3, team1: "MINGA BUN", team2: "Attenti a quei 2", score1:1, score2:7}
              , {id:4, team1: "Fialette", team2: "Poeti", score1:7, score2:2}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
            ]
          },
        ]
        },
        {id: 2, name: 'Festa Dell Unità 2018', date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
            , calendars: [
              {id: 1, name: 'Turno 2.1', date: '01-05-2018', time: '13:45'
              , meetings: [
                  {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "SALEMI", score1:7, score2:3}
                , {id:2, team1: "Maldive", team2: "B&B", score1:2, score2:7}
                , {id:3, team1: "Poeti", team2: "GROOT", score1:7, score2:2}
                , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:7, score2:0}
                , {id:5, team1: "Attenti a quei 2", team2: "Quota Drone", score1:7, score2:0}
              ]
            },
            {id: 2, name: 'Turno 2.2', date: '08-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "Maldive", score1:7, score2:2}
              , {id:2, team1: "SALEMI", team2: "Attenti a quei 2", score1:7, score2:4}
              , {id:3, team1: "Poeti", team2: "Fialette", score1:1, score2:7}
              , {id:4, team1: "GROOT", team2: "MINGA BUN", score1:1, score2:7}
              , {id:5, team1: "B&B", team2: "Quota Drone", score1:5, score2:7}
            ]
          },
          {id: 3, name: 'Turno 2.3', date: '17-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "Maldive", score1:1, score2:7}
              , {id:2, team1: "SALEMI", team2: "GROOT", score1:7, score2:6}
              , {id:3, team1: "Poeti", team2: "Attenti a quei 2", score1:7, score2:4}
              , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:7, score2:1}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
            ]
          },
          {id: 4, name: 'Turno 2.4', date: '24-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "SALEMI", score1:7, score2:1}
              , {id:2, team1: "Maldive", team2: "GROOT", score1:1, score2:7}
              , {id:3, team1: "MINGA BUN", team2: "Attenti a quei 2", score1:5, score2:7}
              , {id:4, team1: "Fialette", team2: "Poeti", score1:5, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
            ]
          },
        ]
        },
        {id: 3, name: 'Coppa CSI 2018', date: '01-03-2018', time: '20:00', address: 'Via De Sanctis, 33 - 20010 Assago (MI)'
            , calendars: [
              {id: 1, name: 'Turno 3.1', date: '01-05-2018', time: '13:45'
              , meetings: [
                  {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "SALEMI", score1:7, score2:1}
                , {id:2, team1: "Maldive", team2: "B&B", score1:5, score2:7}
                , {id:3, team1: "Poeti", team2: "GROOT", score1:4, score2:7}
                , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:4, score2:7}
                , {id:5, team1: "Attenti a quei 2", team2: "Quota Drone", score1:7, score2:3}
              ]
            },
            {id: 2, name: 'Turno 3.2', date: '08-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "Maldive", score1:7, score2:3}
              , {id:2, team1: "SALEMI", team2: "Attenti a quei 2", score1:1, score2:7}
              , {id:3, team1: "Poeti", team2: "Fialette", score1:0, score2:7}
              , {id:4, team1: "GROOT", team2: "MINGA BUN", score1:7, score2:0}
              , {id:5, team1: "B&B", team2: "Quota Drone", score1:7, score2:2}
            ]
          },
          {id: 3, name: 'Turno 3.3', date: '17-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "Maldive", score1:7, score2:1}
              , {id:2, team1: "SALEMI", team2: "GROOT", score1:6, score2:7}
              , {id:3, team1: "Poeti", team2: "Attenti a quei 2", score1:5, score2:7}
              , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:4, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:4, score2:7}
            ]
          },
          {id: 4, name: 'Turno 3.4', date: '24-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "SALEMI", score1:7, score2:5}
              , {id:2, team1: "Maldive", team2: "GROOT", score1:7, score2:3}
              , {id:3, team1: "MINGA BUN", team2: "Attenti a quei 2", score1:1, score2:7}
              , {id:4, team1: "Fialette", team2: "Poeti", score1:0, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
            ]
          },
        ]
      },
        {id: 4, name: 'Festa dello Sport 2018', date: '15-06-2018', time: '19:30', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
            , calendars: [
              {id: 1, name: 'Turno 4.1', date: '01-05-2018', time: '13:45'
              , meetings: [
                  {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "SALEMI", score1:7, score2:3}
                , {id:2, team1: "Maldive", team2: "B&B", score1:5, score2:7}
                , {id:3, team1: "Poeti", team2: "GROOT", score1:5, score2:7}
                , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:7, score2:5}
                , {id:5, team1: "Attenti a quei 2", team2: "Quota Drone", score1:7, score2:5}
              ]
            },
            {id: 2, name: 'Turno 4.2', date: '08-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Luciano Martino - Salvatore Amoroso", team2: "Maldive", score1:7, score2:3}
              , {id:2, team1: "SALEMI", team2: "Attenti a quei 2", score1:7, score2:1}
              , {id:3, team1: "Poeti", team2: "Fialette", score1:4, score2:7}
              , {id:4, team1: "GROOT", team2: "MINGA BUN", score1:2, score2:7}
              , {id:5, team1: "B&B", team2: "Quota Drone", score1:7, score2:2}
            ]
          },
          {id: 3, name: 'Turno 4.3', date: '17-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "Maldive", score1:5, score2:7}
              , {id:2, team1: "SALEMI", team2: "GROOT", score1:6, score2:7}
              , {id:3, team1: "Poeti", team2: "Attenti a quei 2", score1:2, score2:7}
              , {id:4, team1: "Fialette", team2: "MINGA BUN", score1:1, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
            ]
          },
          {id: 4, name: 'Turno 4.4', date: '24-05-2018', time: '21:00'
            , meetings: [
                {id:1, team1: "Quota Drone", team2: "SALEMI", score1:7, score2:4}
              , {id:2, team1: "Maldive", team2: "GROOT", score1:1, score2:7}
              , {id:3, team1: "MINGA BUN", team2: "Attenti a quei 2", score1:5, score2:7}
              , {id:4, team1: "Fialette", team2: "Poeti", score1:6, score2:7}
              , {id:5, team1: "B&B", team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
            ]
          },
        ]
      },
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

      return {login
        , logout
        , tourneys
        , userng
        , clients
        , roles
        , countries
        , changePassword
        , resetPassword
      };
  }
}
