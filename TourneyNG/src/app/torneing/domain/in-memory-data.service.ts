import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable ,  of } from 'rxjs';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tourneys = [
        {id: 1, name: 'Summer week 2018', when: '2018-05-01 13:45:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'},
        {id: 2, name: 'Festa Dell Unità 2018', when: '2018-06-16', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'},
        {id: 3, name: 'Coppa CSI 2018', when: '2018-03-01 15:30:00', address: 'Via De Sanctis, 33 - 20010 Assago (MI)'},
      ];

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
      return {tourneys, userng, clients, roles, countries};
  }
}
