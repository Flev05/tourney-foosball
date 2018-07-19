import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, tourneyName: 'Summer week 2018', date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
            ,teams: [
              {teamName:"SALLUC"}
              ,{teamName:"SALEMI"}
              ,{teamName:"PAGA TEAM"}
              ,{teamName:"FAMA TEAM"}
              ,{teamName:"ARMA TEAM"}
              ,{teamName:"ELEVEN"}
              ,{teamName:"I DISPERATI"}
              ,{teamName:"MIRO TEAM"}
              ,{teamName:"MALDIVE"}
              ,{teamName:"LE PANCHE"}
              ,{teamName:"I RHODENSI"}
            ]
            ,players:[
               {firstname:"Salvatore", lastname:"Amoroso"}
              ,{firstname:"Luciano", lastname:"Martino"}
              ,{firstname:"Salvatore", lastname:"Cavaliere"}
              ,{firstname:"Emilio", lastname:"Cattaneo"}
              ,{firstname:"Massilìmiliano", lastname:"Paganotti"}
              ,{firstname:"Samuele", lastname:"Paganotti"}
              ,{firstname:"Roberto", lastname:"Begamaschi"}
              ,{firstname:"Valter", lastname:"Begamaschi"}
              ,{firstname:"Riccardo", lastname:"Armadillo"}
              ,{firstname:"Tommaso", lastname:"Armadillo"}
              ,{firstname:"Raimondo", lastname:"Brancaccio"}
              ,{firstname:"Simone", lastname:"Castronuovo"}
              ,{firstname:"Riccardo", lastname:"Fabbro"}
              ,{firstname:"Roberto", lastname:"Franzosi"}
              ,{firstname:"Jacopo", lastname:"Meravglia"}
              ,{firstname:"Alessandro", lastname:"Scalise"}
              ,{firstname:"Orlando", lastname:"Zambrella"}
              ,{firstname:"Gianfranco", lastname:"Elia"}
              ,{firstname:"Antonio", lastname:"Pietroforte"}
              ,{firstname:"Mirco", lastname:"Pietroforte"}
              ,{firstname:"Andrea", lastname:"Melidona"}
              ,{firstname:"Giuseppe", lastname:"Melidona"}
              ,{firstname:"Enrico", lastname:"Chiminelli"}
              ,{firstname:"Savino", lastname:"Caporale"}
              ,{firstname:"Pino", lastname:"Felini"}
            ]            
            , rounds: [ 
              {roundName:"Girone A", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1
                          , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                          , team1: {teamName:"SALLUC"
                              , palyers: [
                                {firstname:"Salvatore", lastname:"Amoroso"}
                                ,{firstname:"Luciano", lastname:"Martino"}
                            ]}
                          , team2: {teamName:"SALEMI"
                            , palyers: [
                                {firstname:"Salvatore", lastname:"Cavaliere"}
                              ,{firstname:"Emilio", lastname:"Cattaneo"}
                          ]}
                          , score1:7, score2:3}
                      , {id:2, team1: {teamName:"PAGA TEAM"
                            , palyers: [
                                {firstname:"Massilìmiliano", lastname:"Paganotti"}
                              ,{firstname:"Samuele", lastname:"Paganotti"}
                          ]} 
                          , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                          , team2: {teamName:"I DISPERATI"
                          , palyers: [
                              {firstname:"Valter", lastname:"Begamaschi"}
                            ,{firstname:"Giorgio", lastname:"Begamaschi"}
                          ]}
                        , score1:7, score2:3}
                      , {id:3, team1: {teamName:"FAMA TEAM"
                        , palyers: [
                            {firstname:"Riccardo", lastname:"Fabbro"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                        ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"ARMA TEAM"
                      , palyers: [
                          {firstname:"Riccardo", lastname:"Armadillo"}
                        ,{firstname:"Tommaso", lastname:"Armadillo"}
                      ]}
                      , score1:6, score2:7}
                      , {id:4, team1:{teamName:"Atletico Mica Tanto"
                      , palyers: [
                          {firstname:"Micol", lastname:"Micol"}
                        ,{firstname:"Tommaso", lastname:"Tommaso"}
                      ]} 
                      , date: '01-05-2018', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', time: '13:45'
                      , team2: {teamName:"LE PANCHE"
                      , palyers: [
                          {firstname:"Toto", lastname:"Toto"}
                        ,{firstname:"Roberto", lastname:"Franzosi"}
                      ]}
                      , score1:1, score2:7}
                      , {id:5, team1: {teamName:"ELEVEN"
                      , palyers: [
                          {firstname:"Raimondo", lastname:"Brancaccio"}
                        ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                      ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}
                      , score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: {teamName:"SALLUC"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                      , date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"PAGA TEAM"
                        , palyers: [
                            {firstname:"Massilìmiliano", lastname:"Paganotti"}
                          ,{firstname:"Samuele", lastname:"Paganotti"}
                      ]}
                      , score1:7, score2:1}
                    , {id:2, team1: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:4, score2:7}
                    , {id:3, team1: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}
                    , score1:7, score2:2}
                    , {id:4, team1: {teamName:"ARMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Armadillo"}
                      ,{firstname:"Tommaso", lastname:"Armadillo"}
                    ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"LE PANCHE"
                    , palyers: [
                        {firstname:"Toto", lastname:"Toto"}
                      ,{firstname:"Roberto", lastname:"Franzosi"}
                    ]}
                    , score1:7, score2:5}
                    , {id:5, team1: {teamName:"I DISPERATI"
                    , palyers: [
                        {firstname:"Valter", lastname:"Begamaschi"}
                      ,{firstname:"Giorgio", lastname:"Begamaschi"}
                    ]}, date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"I RHODENSI"
                    , palyers: [
                        {firstname:"Simone", lastname:"Castronuovo"}
                      ,{firstname:"Andrea", lastname:"Castronuovo"}
                    ]}, score1:0, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"PAGA TEAM"
                      , palyers: [
                          {firstname:"Massilìmiliano", lastname:"Paganotti"}
                        ,{firstname:"Samuele", lastname:"Paganotti"}
                    ]}, score1:7, score2:0}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"ARMA TEAM"
                  , palyers: [
                      {firstname:"Riccardo", lastname:"Armadillo"}
                    ,{firstname:"Tommaso", lastname:"Armadillo"}
                  ]}
                  , score1:7, score2:0}
                    , {id:3, team1: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:2, score2:7}
                    , {id:4, team1: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: "LE PANCHE"
                    , score1:2, score2:7}
                    , {id:5, team1: {teamName:"I DISPERATI"
                    , palyers: [
                        {firstname:"Valter", lastname:"Begamaschi"}
                      ,{firstname:"Giorgio", lastname:"Begamaschi"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALLUC"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:0}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:6, score2:7}
                    , {id:2, team1: {teamName:"PAGA TEAM"
                    , palyers: [
                        {firstname:"Massilìmiliano", lastname:"Paganotti"}
                      ,{firstname:"Samuele", lastname:"Paganotti"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"ARMA TEAM"
                  , palyers: [
                      {firstname:"Riccardo", lastname:"Armadillo"}
                    ,{firstname:"Tommaso", lastname:"Armadillo"}
                  ]}
                  , score1:6, score2:7}
                    , {id:3, team1: {teamName:"LE PANCHE"
                    , palyers: [
                        {firstname:"Toto", lastname:"Toto"}
                      ,{firstname:"Roberto", lastname:"Franzosi"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:1, score2:7}
                    , {id:4, team1: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}, score1:7, score2:2}
                    , {id:5, team1: {teamName:"I DISPERATI"
                    , palyers: [
                        {firstname:"Valter", lastname:"Begamaschi"}
                      ,{firstname:"Giorgio", lastname:"Begamaschi"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALLUC"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                  ]
                },            
              ]
              ,classification: [
                { id : 1, team: {teamName: "I RHODENSI"}, points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, team: {teamName: "PAGA TEAM"}, points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, team: {teamName: "LE PANCHE"}, points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, team: {teamName: "Atletico Mica Tanto"}, points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, team: {teamName: "I DISPERATI"}, points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, team: {teamName: "ARMA TEAM"}, points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, team: {teamName: "ELEVEN"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, team: {teamName: "FAMA TEAM"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]}
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                        , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"SALEMI"
                        , palyers: [
                            {firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ]}
                        , score1:7, score2:3}
                      , {id:2, team1: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"B&B"
                        , palyers: [
                            {firstname:"Roberto", lastname:"Bergamaschi"}
                          ,{firstname:"Valter", lastname:"Bergamaschi"}
                      ]}
                      , score1:2, score2:7}
                      , {id:3, team1: {teamName:"Poeti"
                        , palyers: [
                            {firstname:"Raimondo", lastname:"Francaccio"}
                          ,{firstname:"Andrea", lastname:"Procopio"}
                      ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"GROOT"
                        , palyers: [
                            {firstname:"Jacopo", lastname:"Meravglia"}
                          ,{firstname:"Alessandro", lastname:"Scalise"}
                      ]}
                      , score1:7, score2:2}
                      , {id:4, team1: {teamName:"Fialette"
                        , palyers: [
                            {firstname:"Orlando", lastname:"Zambrella"}
                          ,{firstname:"Gianfranco", lastname:"Elia"}
                      ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"MINGA BUN"
                      , palyers: [
                            {firstname:"Antonio", lastname:"Pietroforte"}
                          ,{firstname:"Mirco", lastname:"Pietroforte"}
                      ]}
                      , score1:7, score2:0}
                      , {id:5, team1: {teamName:"Attenti a quei 2"
                        , palyers: [
                              {firstname:"Andrea", lastname:"Melidona"}
                            ,{firstname:"Giuseppe", lastname:"Melidona"}
                        ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Quota Drone"
                        , palyers: [
                            {firstname:"Enrico", lastname:"Chiminelli"}
                          ,{firstname:"Fabio", lastname:"Chiminelli"}
                      ]}
                      , score1:7, score2:0}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}, date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , score1:7, score2:2}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:7, score2:4}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}
                    , score1:1, score2:7}
                    , {id:4, team1: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:1, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Quota Drone"
                  , palyers: [
                      {firstname:"Enrico", lastname:"Chiminelli"}
                    ,{firstname:"Fabio", lastname:"Chiminelli"}
                ]}, score1:5, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , score1:1, score2:7}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:7, score2:6}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:7, score2:4}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:7, score2:1}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:2}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:1}
                    , {id:2, team1: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:1, score2:7}
                    , {id:3, team1: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, score1:5, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:2}
                  ]
                },
              ]
              ,classification: [
                { id : 1, team: {teamName: "I RHODENSI"}, points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, team: {teamName: "PAGA TEAM"}, points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, team: {teamName: "LE PANCHE"}, points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, team: {teamName: "Atletico Mica Tanto"}, points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, team: {teamName: "I DISPERATI"}, points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, team: {teamName: "ARMA TEAM"}, points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, team: {teamName: "ELEVEN"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, team: {teamName: "FAMA TEAM"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]              
            }  
        ]
        ,eliminations: [{
          expanded: true
          ,type: 'leaf'
          ,label: 'Francia-Croazia 4-2'
          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
          ,children:[{
              label: 'Francia-Belgio 1-0'
              ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
              ,expanded: true,
                  children: [{expanded: true
                      ,label: 'Francia-Uruguay 2-0'
                      ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      ,children: [{expanded: true
                          ,label: 'Francia-Argentina 4-3'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                      ,{expanded: true
                          ,label: 'Uruguay-Portogallo 2-1'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                  ]}
                  ,{expanded: true
                      ,label: 'Brasile-Belgio 1-2'
                      ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      ,children: [{expanded: true
                          ,label: 'Belgio-Giappone 3-2'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                      ,{expanded: true
                          ,label: 'Brasile-Messico 3-0'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                  ]}
              ]
          }
          ,{
              label: 'Croazia-Inghilterra 2-1'
              ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
              ,expanded: true
              ,children: [
                  {expanded: true
                      ,label: 'Croazia-Russia 5-3'
                      ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      ,children: [{expanded: true
                          ,label: 'Croazia-Danimarca 5-4'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                      ,{expanded: true
                          ,label: 'Russia-Spagna 5-3'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }]
                  }
                  ,{expanded: true
                      ,label: 'Inghilterra-Svezia 2-0'
                      ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      ,children: [{expanded: true
                          ,label: 'Inghilterra-Colombia 2-0'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }
                      ,{expanded: true
                          ,label: 'Svezia-Svizzera 1-0'
                          ,data: {date:"18/07/2018", location:"San Pietro Burgo"}
                      }]
                  }
              ]                     
          }
      ]}
      ]
      }, 
      {id: 2, tourneyName: 'Festa Dell Unità 2018', date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
            , rounds: [ 
                {roundName:"Girone A", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: {teamName:"SALLUC"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}, date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"SALEMI"
                        , palyers: [
                            {firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ]}
                        , score1:7, score2:3}
                      , {id:2, team1: {teamName:"PAGA TEAM"
                      , palyers: [
                          {firstname:"Massilìmiliano", lastname:"Paganotti"}
                        ,{firstname:"Samuele", lastname:"Paganotti"}
                    ]}, date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"I DISPERATI"
                      , palyers: [
                          {firstname:"Valter", lastname:"Begamaschi"}
                        ,{firstname:"Giorgio", lastname:"Begamaschi"}
                      ]}, score1:7, score2:3}
                      , {id:3, team1: {teamName:"FAMA TEAM"
                      , palyers: [
                          {firstname:"Riccardo", lastname:"Fabbro"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                      , date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"ARMA TEAM"
                      , palyers: [
                          {firstname:"Riccardo", lastname:"Armadillo"}
                        ,{firstname:"Tommaso", lastname:"Armadillo"}
                      ]}
                      , score1:6, score2:7}
                      , {id:4, team1: {teamName:"Atletico Mica Tanto"
                      , palyers: [
                          {firstname:"Micol", lastname:"Micol"}
                        ,{firstname:"Tommaso", lastname:"Tommaso"}
                      ]}, date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"LE PANCHE"
                      , palyers: [
                          {firstname:"Toto", lastname:"Toto"}
                        ,{firstname:"Roberto", lastname:"Franzosi"}
                      ]}
                      , score1:1, score2:7}
                      , {id:5, team1: {teamName:"ELEVEN"
                      , palyers: [
                          {firstname:"Raimondo", lastname:"Brancaccio"}
                        ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                      ]}, date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}, score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: {teamName:"SALLUC"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}, date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"PAGA TEAM"
                    , palyers: [
                        {firstname:"Massilìmiliano", lastname:"Paganotti"}
                      ,{firstname:"Samuele", lastname:"Paganotti"}
                  ]}
                    , score1:7, score2:1}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:4, score2:7}
                    , {id:3, team1: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                    , date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}
                    , score1:7, score2:2}
                    , {id:4, team1: {teamName:"ARMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Armadillo"}
                      ,{firstname:"Tommaso", lastname:"Armadillo"}
                    ]}, date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"LE PANCHE"
                    , palyers: [
                        {firstname:"Toto", lastname:"Toto"}
                      ,{firstname:"Roberto", lastname:"Franzosi"}
                    ]}
                    , score1:7, score2:5}
                    , {id:5, team1: {teamName:"I DISPERATI"
                    , palyers: [
                        {firstname:"Valter", lastname:"Begamaschi"}
                      ,{firstname:"Giorgio", lastname:"Begamaschi"}
                    ]}, date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"I RHODENSI"
                    , palyers: [
                        {firstname:"Simone", lastname:"Castronuovo"}
                      ,{firstname:"Andrea", lastname:"Castronuovo"}
                    ]}, score1:0, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}, date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"PAGA TEAM"
                        , palyers: [
                            {firstname:"Massilìmiliano", lastname:"Paganotti"}
                          ,{firstname:"Samuele", lastname:"Paganotti"}
                      ]}, score1:7, score2:0}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ARMA TEAM"
                      , palyers: [
                          {firstname:"Riccardo", lastname:"Armadillo"}
                        ,{firstname:"Tommaso", lastname:"Armadillo"}
                      ]}, score1:7, score2:0}
                    , {id:3, team1: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                    , date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:2, score2:7}
                    , {id:4, team1: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}, date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"LE PANCHE"
                    , palyers: [
                        {firstname:"Toto", lastname:"Toto"}
                      ,{firstname:"Roberto", lastname:"Franzosi"}
                    ]}
                    , score1:2, score2:7}
                    , {id:5, team1: {teamName:"I DISPERATI"
                          , palyers: [
                              {firstname:"Valter", lastname:"Begamaschi"}
                            ,{firstname:"Giorgio", lastname:"Begamaschi"}
                          ]}, date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                          , team2: {teamName:"SALLUC"
                          , palyers: [
                            {firstname:"Salvatore", lastname:"Amoroso"}
                            ,{firstname:"Luciano", lastname:"Martino"}
                        ]}
                        , score1:7, score2:0}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: {teamName:"I RHODENSI"
                      , palyers: [
                          {firstname:"Simone", lastname:"Castronuovo"}
                        ,{firstname:"Andrea", lastname:"Castronuovo"}
                      ]}, date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:6, score2:7}
                    , {id:2, team1: {teamName:"PAGA TEAM"
                    , palyers: [
                        {firstname:"Massilìmiliano", lastname:"Paganotti"}
                      ,{firstname:"Samuele", lastname:"Paganotti"}
                  ]}, date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"ARMA TEAM"
                  , palyers: [
                      {firstname:"Riccardo", lastname:"Armadillo"}
                    ,{firstname:"Tommaso", lastname:"Armadillo"}
                  ]}
                  , score1:6, score2:7}
                    , {id:3, team1: {teamName:"LE PANCHE"
                    , palyers: [
                        {firstname:"Toto", lastname:"Toto"}
                      ,{firstname:"Roberto", lastname:"Franzosi"}
                    ]}
                    , date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"ELEVEN"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Fabrizio", lastname:"Fabrizio"}
                    ]}
                    , score1:1, score2:7}
                    , {id:4, team1: {teamName:"Atletico Mica Tanto"
                    , palyers: [
                        {firstname:"Micol", lastname:"Micol"}
                      ,{firstname:"Tommaso", lastname:"Tommaso"}
                    ]}, date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"FAMA TEAM"
                    , palyers: [
                        {firstname:"Riccardo", lastname:"Fabbro"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                    , score1:7, score2:2}
                    , {id:5, team1: {teamName:"I DISPERATI"
                    , palyers: [
                        {firstname:"Valter", lastname:"Begamaschi"}
                      ,{firstname:"Giorgio", lastname:"Begamaschi"}
                    ]}, date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALLUC"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                  ]
                },            
              ]
              ,classification: [
                { id : 1, team: {teamName: "I RHODENSI"}, points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, team: {teamName: "PAGA TEAM"}, points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, team: {teamName: "LE PANCHE"}, points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, team: {teamName: "Atletico Mica Tanto"}, points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, team: {teamName: "I DISPERATI"}, points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, team: {teamName: "ARMA TEAM"}, points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, team: {teamName: "ELEVEN"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, team: {teamName: "FAMA TEAM"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]
            }
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                        , date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"SALEMI"
                        , palyers: [
                            {firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ]}
                        , score1:7, score2:3}
                      , {id:2, team1:{teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"B&B"
                      , palyers: [
                          {firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Valter", lastname:"Bergamaschi"}
                    ]}
                      , score1:2, score2:7}
                      , {id:3, team1: {teamName:"Poeti"
                      , palyers: [
                          {firstname:"Raimondo", lastname:"Francaccio"}
                        ,{firstname:"Andrea", lastname:"Procopio"}
                    ]}, date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"GROOT"
                      , palyers: [
                          {firstname:"Jacopo", lastname:"Meravglia"}
                        ,{firstname:"Alessandro", lastname:"Scalise"}
                    ]}
                      , score1:7, score2:2}
                      , {id:4, team1: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}, date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, score1:7, score2:0}
                      , {id:5, team1: {teamName:"Attenti a quei 2"
                      , palyers: [
                            {firstname:"Andrea", lastname:"Melidona"}
                          ,{firstname:"Giuseppe", lastname:"Melidona"}
                      ]}, date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}
                      , score1:7, score2:0}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                    , meetings: [
                        {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                        , date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"Maldive"
                        , palyers: [
                            {firstname:"Savino", lastname:"Caporale"}
                          ,{firstname:"Pino", lastname:"Felini"}
                      ]}
                        , score1:7, score2:2}
                      , {id:2, team1: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:7, score2:4}
                      , {id:3, team1: {teamName:"Poeti"
                      , palyers: [
                          {firstname:"Raimondo", lastname:"Francaccio"}
                        ,{firstname:"Andrea", lastname:"Procopio"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}
                      , score1:1, score2:7}
                      , {id:4, team1: {teamName:"GROOT"
                      , palyers: [
                          {firstname:"Jacopo", lastname:"Meravglia"}
                        ,{firstname:"Alessandro", lastname:"Scalise"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, score1:1, score2:7}
                      , {id:5, team1: {teamName:"B&B"
                      , palyers: [
                          {firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Valter", lastname:"Bergamaschi"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}, score1:5, score2:7}
                    ]
                  },
                  {id: 3, meetingName: 'Turno 3'
                    , meetings: [
                        {id:1, team1: {teamName:"Quota Drone"
                        , palyers: [
                            {firstname:"Enrico", lastname:"Chiminelli"}
                          ,{firstname:"Fabio", lastname:"Chiminelli"}
                      ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"Maldive"
                        , palyers: [
                            {firstname:"Savino", lastname:"Caporale"}
                          ,{firstname:"Pino", lastname:"Felini"}
                      ]}
                        , score1:1, score2:7}
                      , {id:2, team1: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"GROOT"
                      , palyers: [
                          {firstname:"Jacopo", lastname:"Meravglia"}
                        ,{firstname:"Alessandro", lastname:"Scalise"}
                    ]}
                      , score1:7, score2:6}
                      , {id:3, team1: {teamName:"Poeti"
                      , palyers: [
                          {firstname:"Raimondo", lastname:"Francaccio"}
                        ,{firstname:"Andrea", lastname:"Procopio"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:7, score2:4}
                      , {id:4, team1: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, score1:7, score2:1}
                      , {id:5, team1: {teamName:"B&B"
                      , palyers: [
                          {firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Valter", lastname:"Bergamaschi"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , score1:7, score2:2}
                    ]
                  },
                  {id: 4, meetingName: 'Turno 4'
                    , meetings: [
                        {id:1, team1: {teamName:"Quota Drone"
                        , palyers: [
                            {firstname:"Enrico", lastname:"Chiminelli"}
                          ,{firstname:"Fabio", lastname:"Chiminelli"}
                      ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"SALEMI"
                        , palyers: [
                            {firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ]}
                        , score1:7, score2:1}
                      , {id:2, team1: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                      , palyers: [
                          {firstname:"Jacopo", lastname:"Meravglia"}
                        ,{firstname:"Alessandro", lastname:"Scalise"}
                    ]}
                    , score1:1, score2:7}
                      , {id:3, team1: {teamName:"MINGA BUN"
                      , palyers: [
                            {firstname:"Antonio", lastname:"Pietroforte"}
                          ,{firstname:"Mirco", lastname:"Pietroforte"}
                      ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                      , palyers: [
                            {firstname:"Andrea", lastname:"Melidona"}
                          ,{firstname:"Giuseppe", lastname:"Melidona"}
                      ]}, score1:5, score2:7}
                      , {id:4, team1: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, score1:5, score2:7}
                      , {id:5, team1: {teamName:"B&B"
                      , palyers: [
                          {firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Valter", lastname:"Bergamaschi"}
                    ]}, date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , score1:7, score2:2}
                    ]
                  },
              ]
              ,classification: [
                { id : 1, team: {teamName: "Quota Drone"}, points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, team: {teamName: "Maldive"}, points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, team: {teamName: "MINGA BUN"}, points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, team: {teamName: "Fialette"}, points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, team: {teamName: "B&B"}, points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, team: {teamName: "GROOT"}, points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, team: {teamName: "Attenti a quei 2"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, team: {teamName: "Poeti"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]
            }  
          ]
        },
        {id: 3, tourneyName: 'Campionato CSI 2017/2018', date: '25/10/2017', time: '20:00', address: 'Via De Sanctis, 33 - 20010 Assago (MI)'
          , rounds: [ 
              {roundName: "OPEN A GIRONE A", direction: "ANDATA"
                , calendars: [
                  {id: 1, meetingName: 'GIORNATA 01'
                  , meetings: [
                       {id:1, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                        , palyers: [
                          {firstname:"vbgNome1", lastname:"vbgCognome1"}
                          ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                          ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                      ]}
                       , team2: {teamName:"SOLAROSPORT"
                       , palyers: [
                         {firstname:"solaroNome1", lastname:"solaroCognome1"}
                         ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                         ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                         ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                     ]}
                       , date: '25/10/2017', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:5, score2:4}
                      ,{id:2, team1: {teamName:"ORATORIO ZIBIDO G"
                      , palyers: [
                        {firstname:"Mimmo", lastname:"Santoro"}
                        ,{firstname:"Pancrazio", lastname:"Santoro"}
                        ,{firstname:"moglie", lastname:"Santoro"}
                        ,{firstname:"figlia", lastname:"Santoro"}
                    ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                      , palyers: [
                        {firstname:"ozeNome1", lastname:"ozeCognome1"}
                        ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                        ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                    ]}, date: '24/10/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:6, score2:3}
                      ,{id:3, team1: {teamName:"AURORA PREGNANA"
                        , palyers: [
                          {firstname:"Luciano", lastname:"Martino"}
                          ,{firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Roberto", lastname:"Bergamaschi"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                          ,{firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Giannicola", lastname:"Alberghina"}
                      ]}
                      , team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                        , palyers: [
                          {firstname:"aobNome1", lastname:"aobCognome1"}
                          ,{firstname:"aobNome2", lastname:"aobCognome2"}
                          ,{firstname:"aobNome3", lastname:"aobCognome3"}
                      ]}
                      , date: '25/10/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:3, score2:6}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 02'
                , meetings: [
                   {id:1, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                   , palyers: [
                     {firstname:"aobNome1", lastname:"aobCognome1"}
                     ,{firstname:"aobNome2", lastname:"aobCognome2"}
                     ,{firstname:"aobNome3", lastname:"aobCognome3"}
                 ]}, team2: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}
                 , date: '03/11/2017', time: '21:15', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:3, score2:6}
                  ,{id:2, team1: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, team2: {teamName:"AURORA PREGNANA"
                , palyers: [
                  {firstname:"Luciano", lastname:"Martino"}
                  ,{firstname:"Salvatore", lastname:"Amoroso"}
                  ,{firstname:"Roberto", lastname:"Bergamaschi"}
                  ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ,{firstname:"Raimondo", lastname:"Brancaccio"}
                  ,{firstname:"Giuseppe", lastname:"Lombardo"}
              ]}, date: '04/12/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:3, score2:6}
                  ,{id:3, team1: {teamName:"SOLAROSPORT"
                  , palyers: [
                    {firstname:"solaroNome1", lastname:"solaroCognome1"}
                    ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                    ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                    ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                ]}, team2: {teamName:"ORATORIO ZIBIDO G"
                , palyers: [
                  {firstname:"Mimmo", lastname:"Santoro"}
                  ,{firstname:"Pancrazio", lastname:"Santoro"}
                  ,{firstname:"moglie", lastname:"Santoro"}
                  ,{firstname:"figlia", lastname:"Santoro"}
              ]}, date: '05/12/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:3, score2:6}
                ]
              },
              {id: 3, meetingName: 'GIORNATA 03'
                , meetings: [
                  {id:1, team1: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                , palyers: [
                  {firstname:"aobNome1", lastname:"aobCognome1"}
                  ,{firstname:"aobNome2", lastname:"aobCognome2"}
                  ,{firstname:"aobNome3", lastname:"aobCognome3"}
              ]}, date: '07/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:9, score2:0}
                  ,{id:2, team1: "AURORA PREGNANA", team2: {teamName:"SOLAROSPORT"
                  , palyers: [
                    {firstname:"solaroNome1", lastname:"solaroCognome1"}
                    ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                    ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                    ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                ]}, date: '08/11/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:7, score2:2}
                  ,{id:3, team1: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, date: '09/11/2017', time: '21:00', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                ]
              },
              {id: 4, meetingName: 'GIORNATA 04'
                , meetings: [
                    {id:1, team1: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, date: '14/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:1, score2:8}
                    ,{id:2, team1: {teamName:"SOLAROSPORT"
                    , palyers: [
                      {firstname:"solaroNome1", lastname:"solaroCognome1"}
                      ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                      ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                      ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                  ]}, team2: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, date: '14/11/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:1, score2:8}
                    ,{id:3, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, team2: {teamName:"AURORA PREGNANA"
                  , palyers: [
                    {firstname:"Luciano", lastname:"Martino"}
                    ,{firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ,{firstname:"Andrea", lastname:"Poocopio"}
                    ,{firstname:"Alessandro", lastname:"Scalise"}
                ]}, date: '14/11/2017', time: '21:00', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                  ]
              },
              {id: 5, meetingName: 'GIORNATA 05'
                , meetings: [
                    {id:1, team1: {teamName:"AURORA PREGNANA"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Giannicola", lastname:"Alberghina"}
                      ,{firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ,{firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Giuseppe", lastname:"Lombardo"}
                  ]}, team2: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, date: '22/11/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:4, score2:5}
                    ,{id:2, team1: {teamName:"AICS FIGINO A"
                    , palyers: [
                      {firstname:"afaNome1", lastname:"afaCognome1"}
                      ,{firstname:"afaNome2", lastname:"afaCognome2"}
                      ,{firstname:"afaNome3", lastname:"afaCognome3"}
                  ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, date: '23/11/2017', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:4, score2:5}
                    ,{id:3, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                    , palyers: [
                      {firstname:"aobNome1", lastname:"aobCognome1"}
                      ,{firstname:"aobNome2", lastname:"aobCognome2"}
                      ,{firstname:"aobNome3", lastname:"aobCognome3"}
                  ]}, team2: {teamName:"SOLAROSPORT"
                    , palyers: [
                      {firstname:"solaroNome1", lastname:"solaroCognome1"}
                      ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                      ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                      ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                  ]}, date: '24/11/2017', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:7, score2:2}
                  ]
              },
              {id: 6, meetingName: 'GIORNATA 06'
                , meetings: [
                    {id:1, team1: "	SOLAROSPORT", team2: {teamName:"ORATORIO ZIBIDO E"
                    , palyers: [
                      {firstname:"ozeNome1", lastname:"ozeCognome1"}
                      ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                      ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                  ]}, date: '28/11/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:7, score2:2}
                    ,{id:2, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                  , palyers: [
                    {firstname:"aobNome1", lastname:"aobCognome1"}
                    ,{firstname:"aobNome2", lastname:"aobCognome2"}
                    ,{firstname:"aobNome3", lastname:"aobCognome3"}
                ]}, date: '29/11/2017', time: '21:15', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:7, score2:2}
                    ,{id:3, team1: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, team2: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, date: '28/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                  ]
              },
              {id: 7, meetingName: 'GIORNATA 07'
                , meetings: [
                    {id:1, team1: {teamName:"AICS FIGINO A"
                    , palyers: [
                      {firstname:"afaNome1", lastname:"afaCognome1"}
                      ,{firstname:"afaNome2", lastname:"afaCognome2"}
                      ,{firstname:"afaNome3", lastname:"afaCognome3"}
                  ]}
                    , team2: {teamName:"AURORA PREGNANA"
                    , palyers: [
                        {firstname:"Luciano", lastname:"Martino"}
                        ,{firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Andrea", lastname:"Procopio"}
                        ,{firstname:"Alessandro", lastname:"Scalise"}
                        ,{firstname:"Raimondo", lastname:"Brancaccio"}
                        ,{firstname:"Giuseppe", lastname:"Lombardo"}
                    ]}
                    , date: '14/12/2017', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:6, score2:3}
                    ,{id:2, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                    , palyers: [
                      {firstname:"aobNome1", lastname:"aobCognome1"}
                      ,{firstname:"aobNome2", lastname:"aobCognome2"}
                      ,{firstname:"aobNome3", lastname:"aobCognome3"}
                  ]}, team2: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, date: '15/12/2017', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:1, score2:8}
                    ,{id:3, team1: {teamName:"ORATORIO ZIBIDO E"
                    , palyers: [
                      {firstname:"ozeNome1", lastname:"ozeCognome1"}
                      ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                      ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                  ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, date: '12/12/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                  ]
              },
            ]
            ,classification: [
              { id : 1, team: {teamName: "ORATORIO ZIBIDO G"}, points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{id : 2, team: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}
                , points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, team: {teamName: "AICS FIGINO A"}, points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, team: {teamName: "AIROLDI ORIGGIO BIANCA"}, points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, team: {teamName: "AURORA PREGNANA"}, points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, team: {teamName: "SOLAROSPORT"}, points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, team: {teamName: "ORATORIO ZIBIDO E"}, points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
            ]
          }
         ,{roundName: "OPEN A GIRONE A", direction: "RITORNO"
              , calendars: [
                  {id: 1, meetingName: 'GIORNATA 01'
                  , meetings: [
                       {id:1, team1: {teamName:"SOLAROSPORT"
                       , palyers: [
                         {firstname:"solaroNome1", lastname:"solaroCognome1"}
                         ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                         ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                         ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                     ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                       , palyers: [
                         {firstname:"vbgNome1", lastname:"vbgCognome1"}
                         ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                         ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                     ]}, date: '09/01/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:2, score2:7}
                      ,{id:2, team1: {teamName:"ORATORIO ZIBIDO E"
                      , palyers: [
                        {firstname:"ozeNome1", lastname:"ozeCognome1"}
                        ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                        ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                    ]}
                      , team2: {teamName:"ORATORIO ZIBIDO G"
                      , palyers: [
                        {firstname:"Mimmo", lastname:"Santoro"}
                        ,{firstname:"Pancrazio", lastname:"Santoro"}
                        ,{firstname:"moglie", lastname:"Santoro"}
                        ,{firstname:"figlia", lastname:"Santoro"}
                    ]}
                      , date: '09/01/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:1, score2:8}
                      ,{id:3, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                      , palyers: [
                        {firstname:"aobNome1", lastname:"aobCognome1"}
                        ,{firstname:"aobNome2", lastname:"aobCognome2"}
                        ,{firstname:"aobNome3", lastname:"aobCognome3"}
                    ]}
                      , team2: {teamName:"AURORA PREGNANA"
                      , palyers: [
                        {firstname:"Luciano", lastname:"Martino"}
                        ,{firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                        ,{firstname:"Raimondo", lastname:"Brancaccio"}
                        ,{firstname:"Giuseppe", lastname:"Lombardo"}
                    ]}
                      , date: '12/01/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:7, score2:2}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 02'
                , meetings: [
                   {id:1, team1: {teamName:"AICS FIGINO A"
                   , palyers: [
                     {firstname:"afaNome1", lastname:"afaCognome1"}
                     ,{firstname:"afaNome2", lastname:"afaCognome2"}
                     ,{firstname:"afaNome3", lastname:"afaCognome3"}
                 ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                   , palyers: [
                     {firstname:"aobNome1", lastname:"aobCognome1"}
                     ,{firstname:"aobNome2", lastname:"aobCognome2"}
                     ,{firstname:"aobNome3", lastname:"aobCognome3"}
                 ]}, date: '18/01/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:6, score2:3}
                  ,{id:2, team1: {teamName:"AURORA PREGNANA"
                  , palyers: [
                    {firstname:"Luciano", lastname:"Martino"}
                    ,{firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ,{firstname:"Raimondo", lastname:"Brancaccio"}
                    ,{firstname:"Giuseppe", lastname:"Lombardo"}
                ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, date: '17/01/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:9, score2:0}
                  ,{id:3, team1: {teamName:"ORATORIO ZIBIDO G"
                  , palyers: [
                    {firstname:"Mimmo", lastname:"Santoro"}
                    ,{firstname:"Pancrazio", lastname:"Santoro"}
                    ,{firstname:"moglie", lastname:"Santoro"}
                    ,{firstname:"figlia", lastname:"Santoro"}
                ]}, team2: {teamName:"SOLAROSPORT"
                  , palyers: [
                    {firstname:"solaroNome1", lastname:"solaroCognome1"}
                    ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                    ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                    ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                ]}, date: '18/01/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'GIORNATA 03'
                , meetings: [
                  {id:1, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                  , palyers: [
                    {firstname:"vbgNome1", lastname:"vbgCognome1"}
                    ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                    ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                ]}, team2: {teamName:"ORATORIO ZIBIDO G"
                , palyers: [
                  {firstname:"Mimmo", lastname:"Santoro"}
                  ,{firstname:"Pancrazio", lastname:"Santoro"}
                  ,{firstname:"moglie", lastname:"Santoro"}
                  ,{firstname:"figlia", lastname:"Santoro"}
              ]}, date: '24/01/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:4, score2:5}
                  ,{id:2, team1: {teamName:"SOLAROSPORT"
                  , palyers: [
                    {firstname:"solaroNome1", lastname:"solaroCognome1"}
                    ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                    ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                    ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                ]}, team2: {teamName:"AURORA PREGNANA"
                , palyers: [
                  {firstname:"Luciano", lastname:"Martino"}
                  ,{firstname:"Salvatore", lastname:"Amoroso"}
                  ,{firstname:"Roberto", lastname:"Bergamaschi"}
                  ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ,{firstname:"Raimondo", lastname:"Brancaccio"}
                  ,{firstname:"Giuseppe", lastname:"Lombardo"}
              ]}, date: '23/01/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:6, score2:3}
                  ,{id:3, team1: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, date: '23/01/2018', time: '21:30', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:3, score2:6}
                ]
              },
              {id: 4, meetingName: 'GIORNATA 04'
                , meetings: [
                    {id:1, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                    , palyers: [
                      {firstname:"aobNome1", lastname:"aobCognome1"}
                      ,{firstname:"aobNome2", lastname:"aobCognome2"}
                      ,{firstname:"aobNome3", lastname:"aobCognome3"}
                  ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                    , palyers: [
                      {firstname:"ozeNome1", lastname:"ozeCognome1"}
                      ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                      ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                  ]}, date: '02/02/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:8, score2:1}
                    ,{id:2, team1: {teamName:"AICS FIGINO A"
                    , palyers: [
                      {firstname:"afaNome1", lastname:"afaCognome1"}
                      ,{firstname:"afaNome2", lastname:"afaCognome2"}
                      ,{firstname:"afaNome3", lastname:"afaCognome3"}
                  ]}, team2: {teamName:"SOLAROSPORT"
                    , palyers: [
                      {firstname:"solaroNome1", lastname:"solaroCognome1"}
                      ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                      ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                      ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                  ]}, date: '01/02/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:7, score2:2}
                    ,{id:3, team1: {teamName:"AURORA PREGNANA"
                    , palyers: [
                      {firstname:"Luciano", lastname:"Martino"}
                      ,{firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ,{firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Giuseppe", lastname:"Lombardo"}
                  ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, date: '31/01/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:2, score2:7}
                  ]
              },
              {id: 5, meetingName: 'GIORNATA 05'
                , meetings: [
                    {id:1, team1: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, team2: {teamName:"AURORA PREGNANA"
                  , palyers: [
                    {firstname:"Luciano", lastname:"Martino"}
                    ,{firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ,{firstname:"Raimondo", lastname:"Brancaccio"}
                    ,{firstname:"Giuseppe", lastname:"Lombardo"}
                ]}, date: '06/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:6, score2:3}
                    ,{id:2, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, team2: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, date: '07/02/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                    ,{id:3, team1: {teamName:"SOLAROSPORT"
                    , palyers: [
                      {firstname:"solaroNome1", lastname:"solaroCognome1"}
                      ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                      ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                      ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                  ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                  , palyers: [
                    {firstname:"aobNome1", lastname:"aobCognome1"}
                    ,{firstname:"aobNome2", lastname:"aobCognome2"}
                    ,{firstname:"aobNome3", lastname:"aobCognome3"}
                ]}, date: '06/02/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:1, score2:8}
                  ]
              },
              {id: 6, meetingName: 'GIORNATA 06'
                , meetings: [
                    {id:1, team1: {teamName:"ORATORIO ZIBIDO E"
                    , palyers: [
                      {firstname:"ozeNome1", lastname:"ozeCognome1"}
                      ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                      ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                  ]}, team2: {teamName:"SOLAROSPORT"
                    , palyers: [
                      {firstname:"solaroNome1", lastname:"solaroCognome1"}
                      ,{firstname:"solaroNome2", lastname:"solaroCognome2"}
                      ,{firstname:"solaroNome3", lastname:"solaroCognome3"}
                      ,{firstname:"solaroNome4", lastname:"solaroCognome4"}
                  ]}, date: '13/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:4, score2:5}
                    ,{id:2, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                    , palyers: [
                      {firstname:"aobNome1", lastname:"aobCognome1"}
                      ,{firstname:"aobNome2", lastname:"aobCognome2"}
                      ,{firstname:"aobNome3", lastname:"aobCognome3"}
                  ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, date: '16/02/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:3, score2:6}
                    ,{id:3, team1: {teamName:"AICS FIGINO A"
                    , palyers: [
                      {firstname:"afaNome1", lastname:"afaCognome1"}
                      ,{firstname:"afaNome2", lastname:"afaCognome2"}
                      ,{firstname:"afaNome3", lastname:"afaCognome3"}
                  ]}, team2: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, date: '15/02/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:4, score2:5}
                  ]
              },
              {id: 7, meetingName: 'GIORNATA 07'
                , meetings: [
                    {id:1, team1: {teamName:"AURORA PREGNANA"
                    , palyers: [
                      {firstname:"Luciano", lastname:"Martino"}
                      ,{firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ,{firstname:"Raimondo", lastname:"Brancaccio"}
                      ,{firstname:"Giuseppe", lastname:"Lombardo"}
                  ]}, team2: {teamName:"AICS FIGINO A"
                  , palyers: [
                    {firstname:"afaNome1", lastname:"afaCognome1"}
                    ,{firstname:"afaNome2", lastname:"afaCognome2"}
                    ,{firstname:"afaNome3", lastname:"afaCognome3"}
                ]}, date: '21/02/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:3, score2:6}
                    ,{id:2, team1: {teamName:"ORATORIO ZIBIDO G"
                    , palyers: [
                      {firstname:"Mimmo", lastname:"Santoro"}
                      ,{firstname:"Pancrazio", lastname:"Santoro"}
                      ,{firstname:"moglie", lastname:"Santoro"}
                      ,{firstname:"figlia", lastname:"Santoro"}
                  ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                  , palyers: [
                    {firstname:"aobNome1", lastname:"aobCognome1"}
                    ,{firstname:"aobNome2", lastname:"aobCognome2"}
                    ,{firstname:"aobNome3", lastname:"aobCognome3"}
                ]}, date: '20/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                    ,{id:3, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                    , palyers: [
                      {firstname:"vbgNome1", lastname:"vbgCognome1"}
                      ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                      ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                  ]}, team2: {teamName:"ORATORIO ZIBIDO E"
                  , palyers: [
                    {firstname:"ozeNome1", lastname:"ozeCognome1"}
                    ,{firstname:"ozeNome2", lastname:"ozeCognome2"}
                    ,{firstname:"ozeNome3", lastname:"ozeCognome3"}
                ]}, date: '21/02/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                  ]
              },
            ]
            ,classification: [
              { id : 1, team: {teamName: "ORATORIO ZIBIDO G"}, points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, team: {teamName: "VIRTUS BOVISIO GIALLA"}, points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, team: {teamName: "AICS FIGINO A"}, points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, team: {teamName: "AIROLDI ORIGGIO BIANCA"}, points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, team: {teamName: "AURORA PREGNANA"}, points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, team: {teamName: "SOLAROSPORT"}, points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, team: {teamName: "ORATORIO ZIBIDO E"}, points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
            ]            
          }        
        ]
        ,playoffs: [
            {roundName:"OPEN A FASI FINALI", direction: "SOLO ANDATA"
              , calendars: [
                {id: 1, meetingName: 'GIORNATA 1a Giornata'
                  , meetings: [
                     {id:1, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                     , palyers: [
                       {firstname:"vbgNome1", lastname:"vbgCognome1"}
                       ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                       ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                   ]}, team2: {teamName:"AICS FIGINO A"
                   , palyers: [
                     {firstname:"afaNome1", lastname:"afaCognome1"}
                     ,{firstname:"afaNome2", lastname:"afaCognome2"}
                     ,{firstname:"afaNome3", lastname:"afaCognome3"}
                 ]}, date: '07/03/2018', time: '21:15', address: 'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB',  score1:5, score2:4}
                     ,{id:2, team1: {teamName:{teamName:"OSM ASSAGO GRANATA"
                      , palyers: [
                        {firstname:"oagNome1", lastname:"oagCognome1"}
                        ,{firstname:"oagNome2", lastname:"oagCognome2"}
                        ,{firstname:"oagNome3", lastname:"oagCognome3"}
                    ]}
                      , palyers: [
                        {firstname:"oagNome1", lastname:"oagCognome1"}
                        ,{firstname:"oagNome2", lastname:"oagCognome2"}
                        ,{firstname:"oagNome3", lastname:"oagCognome3"}
                    ]}
                     , team2: {teamName:"AICS FIGINO C"
                     , palyers: [
                        {firstname:"afcNome1", lastname:"afcCognome1"}
                        ,{firstname:"afcNome2", lastname:"afcCognome2"}
                        ,{firstname:"afcNome3", lastname:"afcCognome3"}
                    ]}, date: '08/03/2018', time: '21:30', address: 'Campo:VIA C.A.DALLA CHIESA 2 20090 ASSAGO MI',  score1:6, score2:3}
                     ,{id:3, team1: {teamName:"OSM ASSAGO BLU"
                     , palyers: [
                       {firstname:"oabNome1", lastname:"oabCognome1"}
                       ,{firstname:"oabNome2", lastname:"oabCognome2"}
                       ,{firstname:"oabNome3", lastname:"oabCognome3"}
                   ]}
                     , team2: {teamName:"AURORA PREGNANA BLU"
                     , palyers: [
                       {firstname:"Salvatore", lastname:"De Luca"}
                       ,{firstname:"Jacopo", lastname:"Meraviglia"}
                       ,{firstname:"Valter", lastname:"Bergamaschi"}
                       ,{firstname:"Nino", lastname:"Scarpaci"}
                       ,{firstname:"Andrea", lastname:"Melidona"}
                       ,{firstname:"Savino", lastname:"Caporale"}
                   ]}
                     , date: '08/03/2018', time: '21:30', address: 'Campo:VIA C.A.DALLA CHIESA 2 20090 ASSAGO MI',  score1:5, score2:4}
                     ,{id:4, team1: {teamName:"AIROLDI ORIGGIO BIANCA"
                     , palyers: [
                       {firstname:"aobNome1", lastname:"aobCognome1"}
                       ,{firstname:"aobNome2", lastname:"aobCognome2"}
                       ,{firstname:"aobNome3", lastname:"aobCognome3"}
                   ]}, team2: {teamName:"AURORA PREGNANA"
                     , palyers: [
                       {firstname:"Luciano", lastname:"Martino"}
                       ,{firstname:"Salvatore", lastname:"Amoroso"}
                       ,{firstname:"Roberto", lastname:"Bergamaschi"}
                       ,{firstname:"Emilio", lastname:"Cattaneo"}
                       ,{firstname:"Raimondo", lastname:"Brancaccio"}
                       ,{firstname:"Giuseppe", lastname:"Lombardo"}
                   ]}, date: '08/03/2018', time: '21:00', address: 'VIA PIANTANIDA 26 21040 ORIGGIO VA',  score1:3, score2:6}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 2a Giornata'
                  , meetings: [
                     {id:1, team1: {teamName:"VIRTUS BOVISIO GIALLA"
                     , palyers: [
                       {firstname:"vbgNome1", lastname:"vbgCognome1"}
                       ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                       ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                   ]}, team2: {teamName:"OSM ASSAGO GRANATA"
                   , palyers: [
                     {firstname:"oagNome1", lastname:"oagCognome1"}
                     ,{firstname:"oagNome2", lastname:"oagCognome2"}
                     ,{firstname:"oagNome3", lastname:"oagCognome3"}
                 ]}, date: '14/03/2018', time: '21:15', address: 'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB',  score1:7, score2:2}
                     ,{id:2, team1: {teamName:"AICS FIGINO A"
                     , palyers: [
                       {firstname:"afaNome1", lastname:"afaCognome1"}
                       ,{firstname:"afaNome2", lastname:"afaCognome2"}
                       ,{firstname:"afaNome3", lastname:"afaCognome3"}
                   ]}, team2: {teamName:"AICS FIGINO C"
                   , palyers: [
                     {firstname:"afcNome1", lastname:"afcCognome1"}
                     ,{firstname:"afcNome2", lastname:"afcCognome2"}
                     ,{firstname:"afcNome3", lastname:"afcCognome3"}
                 ]}, date: '15/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:8, score2:1}
                     ,{id:3, team1: {teamName:"OSM ASSAGO BLU"
                     , palyers: [
                       {firstname:"oabNome1", lastname:"oabCognome1"}
                       ,{firstname:"oabNome2", lastname:"oabCognome2"}
                       ,{firstname:"oabNome3", lastname:"oabCognome3"}
                   ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                     , palyers: [
                       {firstname:"aobNome1", lastname:"aobCognome1"}
                       ,{firstname:"aobNome2", lastname:"aobCognome2"}
                       ,{firstname:"aobNome3", lastname:"aobCognome3"}
                   ]}, date: '14/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:4, score2:5}
                     ,{id:4, team1: {teamName:"AURORA PREGNANA BLU"
                     , palyers: [
                       {firstname:"Salvatore", lastname:"De Luca"}
                       ,{firstname:"Jacopo", lastname:"Meraviglia"}
                       ,{firstname:"Valter", lastname:"Bergamaschi"}
                       ,{firstname:"Pino", lastname:"Felini"}
                       ,{firstname:"Marco", lastname:"Laratta"}
                       ,{firstname:"Savino", lastname:"Caporale"}
                   ]}
                     , team2: {teamName:"AURORA PREGNANA"
                      , palyers: [
                        {firstname:"Luciano", lastname:"Martino"}
                        ,{firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Roberto", lastname:"Bergamaschi"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                        ,{firstname:"Raimondo", lastname:"Brancaccio"}
                        ,{firstname:"Giuseppe", lastname:"Lombardo"}
                    ]}, date: '14/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:4, score2:5}
                    ]
                },
                {id: 3, meetingName: 'GIORNATA 3a Giornata'
                  , meetings: [
                     {id:1, team1: {teamName:"AICS FIGINO C"
                     , palyers: [
                       {firstname:"afcNome1", lastname:"afcCognome1"}
                       ,{firstname:"afcNome2", lastname:"afcCognome2"}
                       ,{firstname:"afcNome3", lastname:"afcCognome3"}
                   ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                     , palyers: [
                       {firstname:"vbgNome1", lastname:"vbgCognome1"}
                       ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                       ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                   ]}, date: '22/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:1, score2:8}
                     ,{id:2, team1: {teamName:"AICS FIGINO A"
                     , palyers: [
                       {firstname:"afaNome1", lastname:"afaCognome1"}
                       ,{firstname:"afaNome2", lastname:"afaCognome2"}
                       ,{firstname:"afaNome3", lastname:"afaCognome3"}
                   ]}, team2: {teamName:"OSM ASSAGO GRANATA"
                     , palyers: [
                       {firstname:"oagNome1", lastname:"oagCognome1"}
                       ,{firstname:"oagNome2", lastname:"oagCognome2"}
                       ,{firstname:"oagNome3", lastname:"oagCognome3"}
                   ]}, date: '23/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:7, score2:2}
                     ,{id:3, team1: {teamName:"AURORA PREGNANA"
                     , palyers: [
                       {firstname:"Luciano", lastname:"Martino"}
                       ,{firstname:"Salvatore", lastname:"Amoroso"}
                       ,{firstname:"Roberto", lastname:"Bergamaschi"}
                       ,{firstname:"Emilio", lastname:"Cattaneo"}
                       ,{firstname:"Raimondo", lastname:"Brancaccio"}
                       ,{firstname:"Giuseppe", lastname:"Lombardo"}
                   ]}, team2: {teamName:"OSM ASSAGO BLU"
                    , palyers: [
                      {firstname:"oabNome1", lastname:"oabCognome1"}
                      ,{firstname:"oabNome2", lastname:"oabCognome2"}
                      ,{firstname:"oabNome3", lastname:"oabCognome3"}
                  ]}, date: '21/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:3, score2:6}
                     ,{id:3, team1: {teamName:"AURORA PREGNANA BLU"
                     , palyers: [
                       {firstname:"Salvatore", lastname:"De Luca"}
                       ,{firstname:"Leo", lastname:"Leo"}
                       ,{firstname:"Valter", lastname:"Bergamaschi"}
                       ,{firstname:"Pino", lastname:"Felini"}
                       ,{firstname:"Savino", lastname:"Caporale"}
                       ,{firstname:"Carlo", lastname:"Carli"}
                   ]}, team2: {teamName:"AIROLDI ORIGGIO BIANCA"
                   , palyers: [
                     {firstname:"aobNome1", lastname:"aobCognome1"}
                     ,{firstname:"aobNome2", lastname:"aobCognome2"}
                     ,{firstname:"aobNome3", lastname:"aobCognome3"}
                 ]}, date: '21/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:7, score2:2}
                    ]
                },
                {id: 4, meetingName: 'GIORNATA Finale 3° e 4° Posto'
                  , meetings: [
                     {id:1, team1: {teamName:"ORATORIO ZIBIDO D"
                      , palyers: [
                        {firstname:"azdNome1", lastname:"azdCognome1"}
                        ,{firstname:"azdNome2", lastname:"azdCognome2"}
                        ,{firstname:"azdNome3", lastname:"azdCognome3"}
                    ]}
                     , team2: {teamName:"OSM ASSAGO BLU"
                     , palyers: [
                       {firstname:"oabNome1", lastname:"oabCognome1"}
                       ,{firstname:"oabNome2", lastname:"oabCognome2"}
                       ,{firstname:"oabNome3", lastname:"oabCognome3"}
                   ]}, date: '09/04/2018', time: '21:15', address: 'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI',  score1:6, score2:3}
                    ]
                },
                {id: 5, meetingName: 'GIORNATA Finale 1° e 2° Posto'
                  , meetings: [
                     {id:1, team1: {teamName:"ORATORIO ZIBIDO G"
                     , palyers: [
                       {firstname:"Mimmo", lastname:"Santoro"}
                       ,{firstname:"Pancrazio", lastname:"Santoro"}
                       ,{firstname:"moglie", lastname:"Santoro"}
                       ,{firstname:"figlia", lastname:"Santoro"}
                   ]}, team2: {teamName:"VIRTUS BOVISIO GIALLA"
                     , palyers: [
                       {firstname:"vbgNome1", lastname:"vbgCognome1"}
                       ,{firstname:"vbgNome2", lastname:"vbgCognome2"}
                       ,{firstname:"vbgNome3", lastname:"vbgCognome3"}
                   ]}, date: '09/04/2018', time: '21:15', address: 'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI',  score1:5, score2:4}
                    ]
                },
              ]
            }
          ]
        },
        {id: 4, tourneyName: 'Festa dello Sport 2018', date: '15-06-2018', time: '19:30', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
          , rounds: [ 
              {roundName:"Girone A", direction: "SOLO ANDATA"
                  , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                        , palyers: [
                          {firstname:"Salvatore", lastname:"Amoroso"}
                          ,{firstname:"Luciano", lastname:"Martino"}
                      ]}
                        , date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                        , team2: {teamName:"SALEMI"
                        , palyers: [
                            {firstname:"Salvatore", lastname:"Cavaliere"}
                          ,{firstname:"Emilio", lastname:"Cattaneo"}
                      ]}
                        , score1:7, score2:3}
                      , {id:2, team1: {teamName:"Maldive"
                        , palyers: [
                            {firstname:"Savino", lastname:"Caporale"}
                          ,{firstname:"Pino", lastname:"Felini"}
                      ]}
                      , date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"B&B"
                        , palyers: [
                            {firstname:"Roberto", lastname:"Bergamaschi"}
                          ,{firstname:"Valter", lastname:"Bergamaschi"}
                      ]}
                      , score1:5, score2:7}
                      , {id:3, team1: {teamName:"Poeti"
                      , palyers: [
                            {firstname:"Raimondo", lastname:"Francaccio"}
                          ,{firstname:"Andrea", lastname:"Procopio"}
                      ]}, date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"GROOT"
                      , palyers: [
                            {firstname:"Jacopo", lastname:"Meravglia"}
                          ,{firstname:"Alessandro", lastname:"Scalise"}
                      ]}
                      , score1:5, score2:7}
                      , {id:4, team1: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}, date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, score1:7, score2:5}
                      , {id:5, team1: {teamName:"Attenti a quei 2"
                      , palyers: [
                            {firstname:"Andrea", lastname:"Melidona"}
                          ,{firstname:"Giuseppe", lastname:"Melidona"}
                      ]}, date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2:{teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , score1:7, score2:3}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:7, score2:1}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}
                    , score1:4, score2:7}
                    , {id:4, team1: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:2, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Quota Drone"
                  , palyers: [
                      {firstname:"Enrico", lastname:"Chiminelli"}
                    ,{firstname:"Fabio", lastname:"Chiminelli"}
                ]}
                  , score1:7, score2:2}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , score1:5, score2:7}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:6, score2:7}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:2, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:1, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:4}
                    , {id:2, team1: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:1, score2:7}
                    , {id:3, team1: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, score1:6, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALLUC"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                  ]
                },
              ]
              ,classification: [
                { id : 1, team: {teamName: "Quota Drone"}, points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, team: {teamName: "Maldive"}, points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, team: {teamName: "MINGA BUN"}, points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, team: {teamName: "Fialette"}, points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, team: {teamName: "B&B"}, points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, team: {teamName: "GROOT"}, points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, team: {teamName: "Attenti a quei 2"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, team: {teamName: "Poeti"}, points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]
              }
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:3}
                    , {id:2, team1: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}
                    , score1:5, score2:7}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:7, score2:5}
                    , {id:5, team1: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}
                    , score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                , meetings: [
                    {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2:{teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , score1:7, score2:3}
                  , {id:2, team1: {teamName:"SALEMI"
                  , palyers: [
                      {firstname:"Salvatore", lastname:"Cavaliere"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                ]}
                  , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:7, score2:1}
                  , {id:3, team1: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}
                  , score1:4, score2:7}
                  , {id:4, team1: {teamName:"GROOT"
                  , palyers: [
                      {firstname:"Jacopo", lastname:"Meravglia"}
                    ,{firstname:"Alessandro", lastname:"Scalise"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                , palyers: [
                      {firstname:"Antonio", lastname:"Pietroforte"}
                    ,{firstname:"Mirco", lastname:"Pietroforte"}
                ]}, score1:2, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                , team2: {teamName:"Quota Drone"
                , palyers: [
                    {firstname:"Enrico", lastname:"Chiminelli"}
                  ,{firstname:"Fabio", lastname:"Chiminelli"}
              ]}
                , score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'Turno 3'
                , meetings: [
                    {id:1, team1: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , score1:5, score2:7}
                  , {id:2, team1: {teamName:"SALEMI"
                  , palyers: [
                      {firstname:"Salvatore", lastname:"Cavaliere"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                ]}
                  , date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2:{teamName:"GROOT"
                  , palyers: [
                      {firstname:"Jacopo", lastname:"Meravglia"}
                    ,{firstname:"Alessandro", lastname:"Scalise"}
                ]}
                  , score1:6, score2:7}
                  , {id:3, team1: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                , palyers: [
                      {firstname:"Andrea", lastname:"Melidona"}
                    ,{firstname:"Giuseppe", lastname:"Melidona"}
                ]}, score1:2, score2:7}
                  , {id:4, team1: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                , palyers: [
                      {firstname:"Antonio", lastname:"Pietroforte"}
                    ,{firstname:"Mirco", lastname:"Pietroforte"}
                ]}, score1:1, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                  , palyers: [
                    {firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Luciano", lastname:"Martino"}
                ]}
                  , score1:7, score2:1}
                ]
              },
              {id: 4, meetingName: 'Turno 4'
                , meetings: [
                    {id:1, team1: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , score1:7, score2:4}
                  , {id:2, team1: {teamName:"Maldive"
                  , palyers: [
                      {firstname:"Savino", lastname:"Caporale"}
                    ,{firstname:"Pino", lastname:"Felini"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                , team2:{teamName:"GROOT"
                , palyers: [
                    {firstname:"Jacopo", lastname:"Meravglia"}
                  ,{firstname:"Alessandro", lastname:"Scalise"}
              ]}
                , score1:1, score2:7}
                  , {id:3, team1: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:5, score2:7}
                  , {id:4, team1: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                , palyers: [
                    {firstname:"Raimondo", lastname:"Francaccio"}
                  ,{firstname:"Andrea", lastname:"Procopio"}
              ]}, score1:6, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                  , palyers: [
                    {firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Luciano", lastname:"Martino"}
                ]}
                  , score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, team: {teamName: "Quota Drone"}, points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, team: {teamName: "Maldive"}, points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, team: {teamName: "MINGA BUN"}, points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, team: {teamName: "Fialette"}, points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, team: {teamName: "B&B"}, points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, team: {teamName: "GROOT"}, points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, team: {teamName: "Attenti a quei 2"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, team: {teamName: "Poeti"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
              }
            ]          
          }
          ,{roundName:"Girone C", direction:'ANDATA'
              , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:3}
                    , {id:2, team1: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}
                  , score1:5, score2:7}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                      , palyers: [
                          {firstname:"Orlando", lastname:"Zambrella"}
                        ,{firstname:"Gianfranco", lastname:"Elia"}
                    ]}
                    , date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, score1:7, score2:5}
                    , {id:5, team1: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}
                    , score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                , meetings: [
                    {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , score1:7, score2:3}
                  , {id:2, team1: {teamName:"SALEMI"
                  , palyers: [
                      {firstname:"Salvatore", lastname:"Cavaliere"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                ]}
                  , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:7, score2:1}
                  , {id:3, team1: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}
                  , score1:4, score2:7}
                  , {id:4, team1: {teamName:"GROOT"
                  , palyers: [
                      {firstname:"Jacopo", lastname:"Meravglia"}
                    ,{firstname:"Alessandro", lastname:"Scalise"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                , palyers: [
                      {firstname:"Antonio", lastname:"Pietroforte"}
                    ,{firstname:"Mirco", lastname:"Pietroforte"}
                ]}, score1:2, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                , team2: {teamName:"Quota Drone"
                , palyers: [
                    {firstname:"Enrico", lastname:"Chiminelli"}
                  ,{firstname:"Fabio", lastname:"Chiminelli"}
              ]}
                , score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'Turno 3'
                , meetings: [
                    {id:1, team1: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}
                    , score1:5, score2:7}
                  , {id:2, team1: {teamName:"SALEMI"
                  , palyers: [
                      {firstname:"Salvatore", lastname:"Cavaliere"}
                    ,{firstname:"Emilio", lastname:"Cattaneo"}
                ]}
                  , date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"GROOT"
                  , palyers: [
                      {firstname:"Jacopo", lastname:"Meravglia"}
                    ,{firstname:"Alessandro", lastname:"Scalise"}
                ]}
                  , score1:6, score2:7}
                  , {id:3, team1: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                , palyers: [
                      {firstname:"Andrea", lastname:"Melidona"}
                    ,{firstname:"Giuseppe", lastname:"Melidona"}
                ]}, score1:2, score2:7}
                  , {id:4, team1: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                , palyers: [
                      {firstname:"Antonio", lastname:"Pietroforte"}
                    ,{firstname:"Mirco", lastname:"Pietroforte"}
                ]}, score1:1, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                  , palyers: [
                    {firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Luciano", lastname:"Martino"}
                ]}
                  , score1:7, score2:1}
                ]
              },
              {id: 4, meetingName: 'Turno 4'
                , meetings: [
                    {id:1, team1: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , score1:7, score2:4}
                  , {id:2, team1: {teamName:"Maldive"
                  , palyers: [
                      {firstname:"Savino", lastname:"Caporale"}
                    ,{firstname:"Pino", lastname:"Felini"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                , team2: {teamName:"GROOT"
                , palyers: [
                    {firstname:"Jacopo", lastname:"Meravglia"}
                  ,{firstname:"Alessandro", lastname:"Scalise"}
              ]}
                , score1:1, score2:7}
                  , {id:3, team1: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:5, score2:7}
                  , {id:4, team1: {teamName:"Fialette"
                  , palyers: [
                      {firstname:"Orlando", lastname:"Zambrella"}
                    ,{firstname:"Gianfranco", lastname:"Elia"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                , palyers: [
                    {firstname:"Raimondo", lastname:"Francaccio"}
                  ,{firstname:"Andrea", lastname:"Procopio"}
              ]}, score1:6, score2:7}
                  , {id:5, team1: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                  , palyers: [
                    {firstname:"Salvatore", lastname:"Amoroso"}
                    ,{firstname:"Luciano", lastname:"Martino"}
                ]}
                  , score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, team: {teamName: "Quota Drone"}, points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, team: {teamName: "Maldive"}, points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, team: {teamName: "MINGA BUN"}, points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, team: {teamName: "Fialette"}, points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, team: {teamName: "B&B"}, points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, team: {teamName: "GROOT"}, points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, team: {teamName: "Attenti a quei 2"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, team: {teamName: "Poeti"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
              }
            ]          
          }
          ,{roundName:"Girone D", direction:'ANDATA'
              , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:3}
                    , {id:2, team1: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"B&B"
                  , palyers: [
                      {firstname:"Roberto", lastname:"Bergamaschi"}
                    ,{firstname:"Valter", lastname:"Bergamaschi"}
                ]}
                  , score1:5, score2:7}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:7, score2:5}
                    , {id:5, team1: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Quota Drone"
                    , palyers: [
                        {firstname:"Enrico", lastname:"Chiminelli"}
                      ,{firstname:"Fabio", lastname:"Chiminelli"}
                  ]}
                    , score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: {teamName:"Luciano Martino - Salvatore Amoroso"
                      , palyers: [
                        {firstname:"Salvatore", lastname:"Amoroso"}
                        ,{firstname:"Luciano", lastname:"Martino"}
                    ]}
                      , date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Maldive"
                        , palyers: [
                            {firstname:"Savino", lastname:"Caporale"}
                          ,{firstname:"Pino", lastname:"Felini"}
                      ]}, score1:7, score2:3}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:7, score2:1}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}
                    , score1:4, score2:7}
                    , {id:4, team1: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:2, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"Quota Drone"
                  , palyers: [
                      {firstname:"Enrico", lastname:"Chiminelli"}
                    ,{firstname:"Fabio", lastname:"Chiminelli"}
                ]}
                  , score1:7, score2:2}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"Maldive"
                      , palyers: [
                          {firstname:"Savino", lastname:"Caporale"}
                        ,{firstname:"Pino", lastname:"Felini"}
                    ]}
                      , score1:5, score2:7}
                    , {id:2, team1: {teamName:"SALEMI"
                    , palyers: [
                        {firstname:"Salvatore", lastname:"Cavaliere"}
                      ,{firstname:"Emilio", lastname:"Cattaneo"}
                  ]}
                    , date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                    , score1:6, score2:7}
                    , {id:3, team1: {teamName:"Poeti"
                    , palyers: [
                        {firstname:"Raimondo", lastname:"Francaccio"}
                      ,{firstname:"Andrea", lastname:"Procopio"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                  , palyers: [
                        {firstname:"Andrea", lastname:"Melidona"}
                      ,{firstname:"Giuseppe", lastname:"Melidona"}
                  ]}, score1:2, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"MINGA BUN"
                  , palyers: [
                        {firstname:"Antonio", lastname:"Pietroforte"}
                      ,{firstname:"Mirco", lastname:"Pietroforte"}
                  ]}, score1:1, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: {teamName:"Quota Drone"
                      , palyers: [
                          {firstname:"Enrico", lastname:"Chiminelli"}
                        ,{firstname:"Fabio", lastname:"Chiminelli"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                      , team2: {teamName:"SALEMI"
                      , palyers: [
                          {firstname:"Salvatore", lastname:"Cavaliere"}
                        ,{firstname:"Emilio", lastname:"Cattaneo"}
                    ]}
                      , score1:7, score2:4}
                    , {id:2, team1: {teamName:"Maldive"
                    , palyers: [
                        {firstname:"Savino", lastname:"Caporale"}
                      ,{firstname:"Pino", lastname:"Felini"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                  , team2: {teamName:"GROOT"
                    , palyers: [
                        {firstname:"Jacopo", lastname:"Meravglia"}
                      ,{firstname:"Alessandro", lastname:"Scalise"}
                  ]}
                  , score1:1, score2:7}
                    , {id:3, team1: {teamName:"MINGA BUN"
                    , palyers: [
                          {firstname:"Antonio", lastname:"Pietroforte"}
                        ,{firstname:"Mirco", lastname:"Pietroforte"}
                    ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Attenti a quei 2"
                    , palyers: [
                          {firstname:"Andrea", lastname:"Melidona"}
                        ,{firstname:"Giuseppe", lastname:"Melidona"}
                    ]}, score1:5, score2:7}
                    , {id:4, team1: {teamName:"Fialette"
                    , palyers: [
                        {firstname:"Orlando", lastname:"Zambrella"}
                      ,{firstname:"Gianfranco", lastname:"Elia"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: {teamName:"Poeti"
                  , palyers: [
                      {firstname:"Raimondo", lastname:"Francaccio"}
                    ,{firstname:"Andrea", lastname:"Procopio"}
                ]}, score1:6, score2:7}
                    , {id:5, team1: {teamName:"B&B"
                    , palyers: [
                        {firstname:"Roberto", lastname:"Bergamaschi"}
                      ,{firstname:"Valter", lastname:"Bergamaschi"}
                  ]}, date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)'
                    , team2: {teamName:"Luciano Martino - Salvatore Amoroso"
                    , palyers: [
                      {firstname:"Salvatore", lastname:"Amoroso"}
                      ,{firstname:"Luciano", lastname:"Martino"}
                  ]}
                    , score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, team: {teamName: "Quota Drone"}, points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, team: {teamName: "Maldive"}, points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, team: {teamName: "MINGA BUN"}, points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, team: {teamName: "Fialette"}, points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, team: {teamName: "B&B"}, points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, team: {teamName: "SALEMI"}, points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, team: {teamName: "GROOT"}, points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, team: {teamName: "Attenti a quei 2"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, team: {teamName: "Poeti"}, points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, team: {teamName: "SALLUC"}, points: 120, played : 12, won : 11, lost  : 1,
                penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
              }
            ]
          }
        ],
      }];

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
