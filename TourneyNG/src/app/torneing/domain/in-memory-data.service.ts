import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, tourneyName: 'Summer week 2018', date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
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
                      , team2: "LE PANCHE", score1:1, score2:7}
                      , {id:5, team1: "ELEVEN"
                      , date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'
                      , team2: "I RHODENSI", score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: "SALLUC", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "PAGA TEAM", score1:7, score2:1}
                    , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:4, score2:7}
                    , {id:3, team1: "FAMA TEAM", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Atletico Mica Tanto", score1:7, score2:2}
                    , {id:4, team1: "ARMA TEAM", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "LE PANCHE", score1:7, score2:5}
                    , {id:5, team1: "I DISPERATI", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "I RHODENSI", score1:0, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: "I RHODENSI", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "PAGA TEAM", score1:7, score2:0}
                    , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "ARMA TEAM", score1:7, score2:0}
                    , {id:3, team1: "FAMA TEAM", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:2, score2:7}
                    , {id:4, team1: "Atletico Mica Tanto", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "LE PANCHE", score1:2, score2:7}
                    , {id:5, team1: "I DISPERATI", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "SALLUC", score1:7, score2:0}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: "I RHODENSI", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:6, score2:7}
                    , {id:2, team1: "PAGA TEAM", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "ARMA TEAM", score1:6, score2:7}
                    , {id:3, team1: "LE PANCHE", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:1, score2:7}
                    , {id:4, team1: "Atletico Mica Tanto", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "FAMA TEAM", score1:7, score2:2}
                    , {id:5, team1: "I DISPERATI", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "SALLUC", score1:7, score2:1}
                  ]
                },            
              ]
              ,classification: [
                { id : 1, teamName: "I RHODENSI", points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, teamName: "PAGA TEAM", points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, teamName: "LE PANCHE", points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, teamName: "Atletico Mica Tanto", points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, teamName: "I DISPERATI", points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, teamName: "ARMA TEAM", points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, teamName: "ELEVEN", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, teamName: "FAMA TEAM", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]            }
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                      , {id:2, team1: "Maldive", date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:2, score2:7}
                      , {id:3, team1: "Poeti", date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:7, score2:2}
                      , {id:4, team1: "Fialette", date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:0}
                      , {id:5, team1: "Attenti a quei 2", date: '01-05-2018', time: '13:45', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:0}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:2}
                    , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:4}
                    , {id:3, team1: "Poeti", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:1, score2:7}
                    , {id:4, team1: "GROOT", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                    , {id:5, team1: "B&B", date: '08-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:5, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:1, score2:7}
                    , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:7, score2:6}
                    , {id:3, team1: "Poeti", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:4}
                    , {id:4, team1: "Fialette", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:1}
                    , {id:5, team1: "B&B", date: '17-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:1}
                    , {id:2, team1: "Maldive", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                    , {id:3, team1: "MINGA BUN", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:5, score2:7}
                    , {id:5, team1: "B&B", date: '24-05-2018', time: '21:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
                  ]
                },
              ]
              ,classification: [
                { id : 1, teamName: "I RHODENSI", points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, teamName: "PAGA TEAM", points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, teamName: "LE PANCHE", points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, teamName: "Atletico Mica Tanto", points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, teamName: "I DISPERATI", points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, teamName: "ARMA TEAM", points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, teamName: "ELEVEN", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, teamName: "FAMA TEAM", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]              
            }  
        ]
      }, 
      {id: 2, tourneyName: 'Festa Dell Unità 2018', date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'
            , rounds: [ 
                {roundName:"Girone A", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: "SALLUC", date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                      , {id:2, team1: "PAGA TEAM", date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "I DISPERATI", score1:7, score2:3}
                      , {id:3, team1: "FAMA TEAM", date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ARMA TEAM", score1:6, score2:7}
                      , {id:4, team1: "Atletico Mica Tanto", date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "LE PANCHE", score1:1, score2:7}
                      , {id:5, team1: "ELEVEN", date: '16-06-2018', time: '19:30', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "I RHODENSI", score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: "SALLUC", date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "PAGA TEAM", score1:7, score2:1}
                    , {id:2, team1: "SALEMI", date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:4, score2:7}
                    , {id:3, team1: "FAMA TEAM", date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Atletico Mica Tanto", score1:7, score2:2}
                    , {id:4, team1: "ARMA TEAM", date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "LE PANCHE", score1:7, score2:5}
                    , {id:5, team1: "I DISPERATI", date: '23-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "I RHODENSI", score1:0, score2:7}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: "I RHODENSI", date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "PAGA TEAM", score1:7, score2:0}
                    , {id:2, team1: "SALEMI", date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ARMA TEAM", score1:7, score2:0}
                    , {id:3, team1: "FAMA TEAM", date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:2, score2:7}
                    , {id:4, team1: "Atletico Mica Tanto", date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "LE PANCHE", score1:2, score2:7}
                    , {id:5, team1: "I DISPERATI", date: '27-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALLUC", score1:7, score2:0}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: "I RHODENSI", date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:6, score2:7}
                    , {id:2, team1: "PAGA TEAM", date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ARMA TEAM", score1:6, score2:7}
                    , {id:3, team1: "LE PANCHE", date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "ELEVEN", score1:1, score2:7}
                    , {id:4, team1: "Atletico Mica Tanto", date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "FAMA TEAM", score1:7, score2:2}
                    , {id:5, team1: "I DISPERATI", date: '30-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALLUC", score1:7, score2:1}
                  ]
                },            
              ]
              ,classification: [
                { id : 1, teamName: "I RHODENSI", points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, teamName: "PAGA TEAM", points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, teamName: "LE PANCHE", points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, teamName: "Atletico Mica Tanto", points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, teamName: "I DISPERATI", points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, teamName: "ARMA TEAM", points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, teamName: "ELEVEN", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, teamName: "FAMA TEAM", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]
            }
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                    {id: 1, meetingName: 'Turno 1'
                    , meetings: [
                        {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                      , {id:2, team1: "Maldive", date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:2, score2:7}
                      , {id:3, team1: "Poeti", date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:7, score2:2}
                      , {id:4, team1: "Fialette", date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:0}
                      , {id:5, team1: "Attenti a quei 2", date: '16-06-2018', time: '20:45', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:0}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                    , meetings: [
                        {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:2}
                      , {id:2, team1: "SALEMI", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:4}
                      , {id:3, team1: "Poeti", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:1, score2:7}
                      , {id:4, team1: "GROOT", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                      , {id:5, team1: "B&B", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:5, score2:7}
                    ]
                  },
                  {id: 3, meetingName: 'Turno 3'
                    , meetings: [
                        {id:1, team1: "Quota Drone", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:1, score2:7}
                      , {id:2, team1: "SALEMI", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:7, score2:6}
                      , {id:3, team1: "Poeti", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:4}
                      , {id:4, team1: "Fialette", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:1}
                      , {id:5, team1: "B&B", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
                    ]
                  },
                  {id: 4, meetingName: 'Turno 4'
                    , meetings: [
                        {id:1, team1: "Quota Drone", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:1}
                      , {id:2, team1: "Maldive", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                      , {id:3, team1: "MINGA BUN", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                      , {id:4, team1: "Fialette", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:5, score2:7}
                      , {id:5, team1: "B&B", date: '16-06-2018', time: '21:00', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:2}
                    ]
                  },
              ]
              ,classification: [
                { id : 1, teamName: "Quota Drone", points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, teamName: "Maldive", points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, teamName: "MINGA BUN", points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, teamName: "Fialette", points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, teamName: "B&B", points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, teamName: "GROOT", points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, teamName: "Attenti a quei 2", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, teamName: "Poeti", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
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
                       {id:1, team1: "VIRTUS BOVISIO GIALLA", team2: "SOLAROSPORT", date: '25/10/2017', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:5, score2:4}
                      ,{id:2, team1: "ORATORIO ZIBIDO G", team2: "ORATORIO ZIBIDO E", date: '24/10/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:6, score2:3}
                      ,{id:3, team1: "AURORA PREGNANA", team2: "AIROLDI ORIGGIO BIANCA", date: '25/10/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:3, score2:6}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 02'
                , meetings: [
                   {id:1, team1: "AIROLDI ORIGGIO BIANCA", team2: "AICS FIGINO A", date: '03/11/2017', time: '21:15', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:3, score2:6}
                  ,{id:2, team1: "ORATORIO ZIBIDO E", team2: "AURORA PREGNANA", date: '04/12/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:3, score2:6}
                  ,{id:3, team1: "SOLAROSPORT", team2: "ORATORIO ZIBIDO G", date: '05/12/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:3, score2:6}
                ]
              },
              {id: 3, meetingName: 'GIORNATA 03'
                , meetings: [
                  {id:1, team1: "ORATORIO ZIBIDO E", team2: "AIROLDI ORIGGIO BIANCA", date: '07/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:9, score2:0}
                  ,{id:2, team1: "AURORA PREGNANA", team2: "SOLAROSPORT", date: '08/11/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:7, score2:2}
                  ,{id:3, team1: "AICS FIGINO A", team2: "ORATORIO ZIBIDO E", date: '09/11/2017', time: '21:00', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                ]
              },
              {id: 4, meetingName: 'GIORNATA 04'
                , meetings: [
                    {id:1, team1: "ORATORIO ZIBIDO G", team2: "VIRTUS BOVISIO GIALLA", date: '14/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:1, score2:8}
                    ,{id:2, team1: "SOLAROSPORT", team2: "AICS FIGINO A", date: '14/11/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:1, score2:8}
                    ,{id:3, team1: "VIRTUS BOVISIO GIALLA", team2: "AURORA PREGNANA", date: '14/11/2017', time: '21:00', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                  ]
              },
              {id: 5, meetingName: 'GIORNATA 05'
                , meetings: [
                    {id:1, team1: "AURORA PREGNANA", team2: "ORATORIO ZIBIDO G", date: '22/11/2017', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:4, score2:5}
                    ,{id:2, team1: "AICS FIGINO A", team2: "VIRTUS BOVISIO GIALLA", date: '23/11/2017', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:4, score2:5}
                    ,{id:3, team1: "AIROLDI ORIGGIO BIANCA", team2: "SOLAROSPORT", date: '24/11/2017', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:7, score2:2}
                  ]
              },
              {id: 6, meetingName: 'GIORNATA 06'
                , meetings: [
                    {id:1, team1: "	SOLAROSPORT", team2: "ORATORIO ZIBIDO E", date: '28/11/2017', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:7, score2:2}
                    ,{id:2, team1: "VIRTUS BOVISIO GIALLA", team2: "AIROLDI ORIGGIO BIANCA", date: '29/11/2017', time: '21:15', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:7, score2:2}
                    ,{id:3, team1: "ORATORIO ZIBIDO G", team2: "AICS FIGINO A", date: '28/11/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                  ]
              },
              {id: 7, meetingName: 'GIORNATA 07'
                , meetings: [
                    {id:1, team1: "AICS FIGINO A", team2: "AURORA PREGNANA", date: '14/12/2017', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:6, score2:3}
                    ,{id:2, team1: "AIROLDI ORIGGIO BIANCA", team2: "ORATORIO ZIBIDO G", date: '15/12/2017', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:1, score2:8}
                    ,{id:3, team1: "ORATORIO ZIBIDO E", team2: "VIRTUS BOVISIO GIALLA", date: '12/12/2017', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                  ]
              },
            ]
            ,classification: [
              { id : 1, teamName: "ORATORIO ZIBIDO G", points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, teamName: "VIRTUS BOVISIO GIALLA", points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, teamName: "AICS FIGINO A", points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, teamName: "AIROLDI ORIGGIO BIANCA", points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, teamName: "AURORA PREGNANA", points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, teamName: "SOLAROSPORT", points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, teamName: "ORATORIO ZIBIDO E", points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
            ]
          }
         ,{roundName: "OPEN A GIRONE A", direction: "RITORNO"
              , calendars: [
                  {id: 1, meetingName: 'GIORNATA 01'
                  , meetings: [
                       {id:1, team1: "SOLAROSPORT", team2: "VIRTUS BOVISIO GIALLA", date: '09/01/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:2, score2:7}
                      ,{id:2, team1: "ORATORIO ZIBIDO E", team2: "ORATORIO ZIBIDO G", date: '09/01/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:1, score2:8}
                      ,{id:3, team1: "AIROLDI ORIGGIO BIANCA", team2: "AURORA PREGNANA", date: '12/01/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:7, score2:2}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 02'
                , meetings: [
                   {id:1, team1: "AICS FIGINO A", team2: "AIROLDI ORIGGIO BIANCA", date: '18/01/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:6, score2:3}
                  ,{id:2, team1: "AURORA PREGNANA", team2: "ORATORIO ZIBIDO E", date: '17/01/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:9, score2:0}
                  ,{id:3, team1: "ORATORIO ZIBIDO G", team2: "SOLAROSPORT", date: '18/01/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'GIORNATA 03'
                , meetings: [
                  {id:1, team1: "VIRTUS BOVISIO GIALLA", team2: "ORATORIO ZIBIDO G", date: '24/01/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:4, score2:5}
                  ,{id:2, team1: "SOLAROSPORT", team2: "AURORA PREGNANA", date: '23/01/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:6, score2:3}
                  ,{id:3, team1: "AICS FIGINO A", team2: "ORATORIO ZIBIDO E", date: '23/01/2018', time: '21:30', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:3, score2:6}
                ]
              },
              {id: 4, meetingName: 'GIORNATA 04'
                , meetings: [
                    {id:1, team1: "AIROLDI ORIGGIO BIANCA", team2: "ORATORIO ZIBIDO E", date: '02/02/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:8, score2:1}
                    ,{id:2, team1: "AICS FIGINO A", team2: "SOLAROSPORT", date: '01/02/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:7, score2:2}
                    ,{id:3, team1: "AURORA PREGNANA", team2: "VIRTUS BOVISIO GIALLA", date: '31/01/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:2, score2:7}
                  ]
              },
              {id: 5, meetingName: 'GIORNATA 05'
                , meetings: [
                    {id:1, team1: "ORATORIO ZIBIDO G", team2: "AURORA PREGNANA", date: '06/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:6, score2:3}
                    ,{id:2, team1: "VIRTUS BOVISIO GIALLA", team2: "AICS FIGINO A", date: '07/02/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                    ,{id:3, team1: "SOLAROSPORT", team2: "AIROLDI ORIGGIO BIANCA", date: '06/02/2018', time: '21:00', address:'VIA S.PAOLO, 6 20020 SOLARO MI', score1:1, score2:8}
                  ]
              },
              {id: 6, meetingName: 'GIORNATA 06'
                , meetings: [
                    {id:1, team1: "ORATORIO ZIBIDO E", team2: "SOLAROSPORT", date: '13/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:4, score2:5}
                    ,{id:2, team1: "AIROLDI ORIGGIO BIANCA", team2: "VIRTUS BOVISIO GIALLA", date: '16/02/2018', time: '21:00', address:'VIA PIANTANIDA 26 21040 ORIGGIO VA', score1:3, score2:6}
                    ,{id:3, team1: "AICS FIGINO A", team2: "ORATORIO ZIBIDO G", date: '15/02/2018', time: '21:00', address:'VIA ZANZOTTERA 32 20153 MILANO MI', score1:4, score2:5}
                  ]
              },
              {id: 7, meetingName: 'GIORNATA 07'
                , meetings: [
                    {id:1, team1: "AURORA PREGNANA", team2: "AICS FIGINO A", date: '21/02/2018', time: '21:00', address:'Via Roma 110, 20010 - Pregnana Milanese (MI)', score1:3, score2:6}
                    ,{id:2, team1: "ORATORIO ZIBIDO G", team2: "AIROLDI ORIGGIO BIANCA", date: '20/02/2018', time: '21:30', address:'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI', score1:7, score2:2}
                    ,{id:3, team1: "VIRTUS BOVISIO GIALLA", team2: "ORATORIO ZIBIDO E", date: '21/02/2018', time: '21:15', address:'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB', score1:7, score2:2}
                  ]
              },
            ]
            ,classification: [
              { id : 1, teamName: "ORATORIO ZIBIDO G", points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, teamName: "VIRTUS BOVISIO GIALLA", points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, teamName: "AICS FIGINO A", points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, teamName: "AIROLDI ORIGGIO BIANCA", points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, teamName: "AURORA PREGNANA", points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, teamName: "SOLAROSPORT", points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, teamName: "ORATORIO ZIBIDO E", points: 23, played : 12, won : 0, lost  : 12,
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
                     {id:1, team1: "VIRTUS BOVISIO GIALLA", team2: "AICS FIGINO A", date: '07/03/2018', time: '21:15', address: 'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB',  score1:5, score2:4}
                     ,{id:2, team1: "OSM ASSAGO GRANATA", team2: "AICS FIGINO C", date: '08/03/2018', time: '21:30', address: 'Campo:VIA C.A.DALLA CHIESA 2 20090 ASSAGO MI',  score1:6, score2:3}
                     ,{id:3, team1: "OSM ASSAGO BLU", team2: "AURORA PREGNANA BLU", date: '08/03/2018', time: '21:30', address: 'Campo:VIA C.A.DALLA CHIESA 2 20090 ASSAGO MI',  score1:5, score2:4}
                     ,{id:4, team1: "AIROLDI ORIGGIO BIANCA", team2: "AURORA PREGNANA", date: '08/03/2018', time: '21:00', address: 'VIA PIANTANIDA 26 21040 ORIGGIO VA',  score1:3, score2:6}
                    ]
                },
                {id: 2, meetingName: 'GIORNATA 2a Giornata'
                  , meetings: [
                     {id:1, team1: "VIRTUS BOVISIO GIALLA", team2: "OSM ASSAGO GRANATA", date: '14/03/2018', time: '21:15', address: 'VIA C.CANTU\' , 2/A 20813 BOVISIO MASCIAGO MB',  score1:7, score2:2}
                     ,{id:2, team1: "AICS FIGINO A", team2: "AICS FIGINO C", date: '15/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:8, score2:1}
                     ,{id:3, team1: "OSM ASSAGO BLU", team2: "AIROLDI ORIGGIO BIANCA", date: '14/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:4, score2:5}
                     ,{id:4, team1: "AURORA PREGNANA BLU", team2: "AURORA PREGNANA", date: '14/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:4, score2:5}
                    ]
                },
                {id: 3, meetingName: 'GIORNATA 3a Giornata'
                  , meetings: [
                     {id:1, team1: "AICS FIGINO C", team2: "VIRTUS BOVISIO GIALLA", date: '22/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:1, score2:8}
                     ,{id:2, team1: "AICS FIGINO A", team2: "OSM ASSAGO GRANATA", date: '23/03/2018', time: '21:00', address: 'VIA ZANZOTTERA 32 20153 MILANO MI',  score1:7, score2:2}
                     ,{id:3, team1: "AURORA PREGNANA", team2: "OSM ASSAGO BLU", date: '21/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:3, score2:6}
                     ,{id:3, team1: "AURORA PREGNANA BLU", team2: "AIROLDI ORIGGIO BIANCA", date: '21/03/2018', time: '21:00', address: 'Via Roma 110, 20010 - Pregnana Milanese (MI)',  score1:7, score2:2}
                    ]
                },
                {id: 4, meetingName: 'GIORNATA Finale 3° e 4° Posto'
                  , meetings: [
                     {id:1, team1: "ORATORIO ZIBIDO D", team2: "OSM ASSAGO BLU", date: '09/04/2018', time: '21:15', address: 'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI',  score1:6, score2:3}
                    ]
                },
                {id: 5, meetingName: 'GIORNATA Finale 1° e 2° Posto'
                  , meetings: [
                     {id:1, team1: "ORATORIO ZIBIDO G", team2: "VIRTUS BOVISIO GIALLA", date: '09/04/2018', time: '21:15', address: 'VIA BINASCO / LARGO GARIBALDI 20080 ZIBIDO SAN GIACOMO MI',  score1:5, score2:4}
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
                        {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                      , {id:2, team1: "Maldive", date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:5, score2:7}
                      , {id:3, team1: "Poeti", date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:5, score2:7}
                      , {id:4, team1: "Fialette", date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:5}
                      , {id:5, team1: "Attenti a quei 2", date: '15-06-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:5}
                    ]
                  },
                  {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:3}
                    , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:1}
                    , {id:3, team1: "Poeti", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:4, score2:7}
                    , {id:4, team1: "GROOT", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:2, score2:7}
                    , {id:5, team1: "B&B", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:2}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:5, score2:7}
                    , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:6, score2:7}
                    , {id:3, team1: "Poeti", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:2, score2:7}
                    , {id:4, team1: "Fialette", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                    , {id:5, team1: "B&B", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:4}
                    , {id:2, team1: "Maldive", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                    , {id:3, team1: "MINGA BUN", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:6, score2:7}
                    , {id:5, team1: "B&B", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALLUC", score1:7, score2:1}
                  ]
                },
              ]
              ,classification: [
                { id : 1, teamName: "Quota Drone", points : 78, played : 12, won : 12, lost : 0,
                  penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
                }
                ,{ id : 2, teamName: "Maldive", points : 70, played : 12, won : 10, lost  : 2,
                  penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
                }
                ,{ id : 3, teamName: "MINGA BUN", points : 62, played : 12, won : 7, lost  : 5,
                  penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
                }
                ,{ id : 4, teamName: "Fialette", points : 58, played : 12, won : 6, lost  : 6,
                  penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
                }
                ,{ id : 5, teamName: "B&B", points : 50, played : 12, won : 4, lost  : 8,
                  penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
                }
                ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                  penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
                }
                ,{ id : 7, teamName: "GROOT", points: 23, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
                }
                ,{ id : 8, teamName: "Attenti a quei 2", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 9, teamName: "Poeti", points: 12, played : 12, won : 0, lost  : 12,
                  penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
                }
                ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                  penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
                }
              ]
              }
            ,{roundName:"Girone B", direction:'ANDATA'
                , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                    , {id:2, team1: "Maldive", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:5, score2:7}
                    , {id:3, team1: "Poeti", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:5}
                    , {id:5, team1: "Attenti a quei 2", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                , meetings: [
                    {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:3}
                  , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:1}
                  , {id:3, team1: "Poeti", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:4, score2:7}
                  , {id:4, team1: "GROOT", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:2, score2:7}
                  , {id:5, team1: "B&B", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'Turno 3'
                , meetings: [
                    {id:1, team1: "Quota Drone", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:5, score2:7}
                  , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:6, score2:7}
                  , {id:3, team1: "Poeti", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:2, score2:7}
                  , {id:4, team1: "Fialette", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                  , {id:5, team1: "B&B", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                ]
              },
              {id: 4, meetingName: 'Turno 4'
                , meetings: [
                    {id:1, team1: "Quota Drone", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:4}
                  , {id:2, team1: "Maldive", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                  , {id:3, team1: "MINGA BUN", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                  , {id:4, team1: "Fialette", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:6, score2:7}
                  , {id:5, team1: "B&B", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, teamName: "Quota Drone", points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, teamName: "Maldive", points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, teamName: "MINGA BUN", points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, teamName: "Fialette", points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, teamName: "B&B", points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, teamName: "GROOT", points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, teamName: "Attenti a quei 2", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, teamName: "Poeti", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
              }
            ]          
          }
          ,{roundName:"Girone C", direction:'ANDATA'
              , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                    , {id:2, team1: "Maldive", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:5, score2:7}
                    , {id:3, team1: "Poeti", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:5}
                    , {id:5, team1: "Attenti a quei 2", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                , meetings: [
                    {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:3}
                  , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:1}
                  , {id:3, team1: "Poeti", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:4, score2:7}
                  , {id:4, team1: "GROOT", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:2, score2:7}
                  , {id:5, team1: "B&B", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:2}
                ]
              },
              {id: 3, meetingName: 'Turno 3'
                , meetings: [
                    {id:1, team1: "Quota Drone", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:5, score2:7}
                  , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:6, score2:7}
                  , {id:3, team1: "Poeti", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:2, score2:7}
                  , {id:4, team1: "Fialette", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                  , {id:5, team1: "B&B", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                ]
              },
              {id: 4, meetingName: 'Turno 4'
                , meetings: [
                    {id:1, team1: "Quota Drone", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:4}
                  , {id:2, team1: "Maldive", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                  , {id:3, team1: "MINGA BUN", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                  , {id:4, team1: "Fialette", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:6, score2:7}
                  , {id:5, team1: "B&B", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, teamName: "Quota Drone", points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, teamName: "Maldive", points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, teamName: "MINGA BUN", points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, teamName: "Fialette", points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, teamName: "B&B", points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, teamName: "GROOT", points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, teamName: "Attenti a quei 2", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, teamName: "Poeti", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
                penalty  : 0, goalsDone: 858, goalsConceded: 298, goalsDiff : 0
              }
            ]          
          }
          ,{roundName:"Girone D", direction:'ANDATA'
              , calendars: [
                  {id: 1, meetingName: 'Turno 1'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:3}
                    , {id:2, team1: "Maldive", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "B&B", score1:5, score2:7}
                    , {id:3, team1: "Poeti", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:7, score2:5}
                    , {id:5, team1: "Attenti a quei 2", date: '01-05-2018', time: '13:45', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:5}
                  ]
                },
                {id: 2, meetingName: 'Turno 2'
                  , meetings: [
                      {id:1, team1: "Luciano Martino - Salvatore Amoroso", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:7, score2:3}
                    , {id:2, team1: "SALEMI", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:7, score2:1}
                    , {id:3, team1: "Poeti", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Fialette", score1:4, score2:7}
                    , {id:4, team1: "GROOT", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:2, score2:7}
                    , {id:5, team1: "B&B", date: '08-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Quota Drone", score1:7, score2:2}
                  ]
                },
                {id: 3, meetingName: 'Turno 3'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Maldive", score1:5, score2:7}
                    , {id:2, team1: "SALEMI", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:6, score2:7}
                    , {id:3, team1: "Poeti", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:2, score2:7}
                    , {id:4, team1: "Fialette", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "MINGA BUN", score1:1, score2:7}
                    , {id:5, team1: "B&B", date: '17-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                  ]
                },
                {id: 4, meetingName: 'Turno 4'
                  , meetings: [
                      {id:1, team1: "Quota Drone", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "SALEMI", score1:7, score2:4}
                    , {id:2, team1: "Maldive", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "GROOT", score1:1, score2:7}
                    , {id:3, team1: "MINGA BUN", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Attenti a quei 2", score1:5, score2:7}
                    , {id:4, team1: "Fialette", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Poeti", score1:6, score2:7}
                    , {id:5, team1: "B&B", date: '24-05-2018', time: '21:00', address: 'Via Gallarate, 33 - 20010 Pregnana Milanese (MI)', team2: "Luciano Martino - Salvatore Amoroso", score1:7, score2:1}
                ]
              },
            ]
            ,classification: [
              { id : 1, teamName: "Quota Drone", points : 78, played : 12, won : 12, lost : 0,
                penalty : 0, goalsDone : 927, goalsConceded : 704, goalsDiff : 0
              }
              ,{ id : 2, teamName: "Maldive", points : 70, played : 12, won : 10, lost  : 2,
                penalty  : 0, goalsDone : 1135, goalsConceded : 892, goalsDiff : 0
              }
              ,{ id : 3, teamName: "MINGA BUN", points : 62, played : 12, won : 7, lost  : 5,
                penalty  : 0, goalsDone : 1046, goalsConceded : 912, goalsDiff : 0
              }
              ,{ id : 4, teamName: "Fialette", points : 58, played : 12, won : 6, lost  : 6,
                penalty  : 0, goalsDone : 969, goalsConceded : 951, goalsDiff : 0
              }
              ,{ id : 5, teamName: "B&B", points : 50, played : 12, won : 4, lost  : 8,
                penalty  : 0, goalsDone : 937, goalsConceded : 1014, goalsDiff : 0
              }
              ,{ id : 6, teamName: "SALEMI", points : 37, played : 12, won : 3, lost  : 9,
                penalty  : 0, goalsDone : 696, goalsConceded : 837, goalsDiff : 0
              }
              ,{ id : 7, teamName: "GROOT", points: 23, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 580, goalsConceded: 908, goalsDiff : 0
              }
              ,{ id : 8, teamName: "Attenti a quei 2", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 9, teamName: "Poeti", points: 12, played : 12, won : 0, lost  : 12,
                penalty  : 0, goalsDone: 58, goalsConceded: 98, goalsDiff : 0
              }
              ,{ id : 10, teamName: "SALLUC", points: 120, played : 12, won : 11, lost  : 1,
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
