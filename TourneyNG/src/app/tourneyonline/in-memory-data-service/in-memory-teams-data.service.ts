import { Team } from '../domain/team';

export class InMemoryTeamsDataService  {
  static teams: Team[] = [
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
}

