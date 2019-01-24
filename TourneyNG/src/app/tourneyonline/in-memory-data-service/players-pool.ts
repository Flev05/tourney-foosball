import { Player } from "app/tourneyonline/domain/player";
import { Team } from "app/tourneyonline/domain/team";

export class PlayersPool {

static players: Player[] = [
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
    ];

  static takePlayers(count: number):Array<Player> {

    let n = count <= PlayersPool.players.length ? count : PlayersPool.players.length;

    let players = new Array<Player>();

    for(let i=0; i<n; i++) {
      players.push(PlayersPool.players[i]);
    }

    return players;
  }

  static prepareTeams(count : number) : Array<Team> {
    let N = count > PlayersPool.players.length / 2 ? PlayersPool.players.length / 2 : count;

    let teams: Array<Team> = new Array<Team>();

    for(let i=0; i<N*2; i+=2 ) {
      let t : Team = {
        id: i
        , teamName: PlayersPool.players[i].playerName
        , address: PlayersPool.players[i].address
        , country: PlayersPool.players[i].country
        , players: [PlayersPool.players[i],PlayersPool.players[i+1]]
      };

      teams.push(t);
    }

    return teams;
  }
}
