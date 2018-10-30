import { Player } from "app/tourneyonline/domain/player";
import { Team } from "app/tourneyonline/domain/team";

export class PlayersPool {

static players: Player[] = [
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
        , teamName: PlayersPool.players[i].lastname + " - " + PlayersPool.players[i+1].lastname
        , address: PlayersPool.players[i].address
        , country: PlayersPool.players[i].country
        , players: [PlayersPool.players[i],PlayersPool.players[i+1]]
      };

      teams.push(t);
    }

    return teams;
  }
}
