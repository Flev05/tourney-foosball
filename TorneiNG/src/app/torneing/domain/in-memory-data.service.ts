import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export class InMemoryDataService implements InMemoryDbService {
  createDb() {
      const tornei = [
        {id: 1, name: 'Summer week 2018', when: '2018-05-01 13:45:00', address: 'Via Roma 110 - 20010 Pregnana Milanese (MI)'},
        {id: 2, name: 'Festa Dell Unità 2018', when: '2018-06-16', address: 'Via Gallarate 22 - 20010 Pregnana Milanese (MI)'},
        {id: 3, name: 'Coppa CSI 2018', when: '2018-03-01 15:30:00', address: 'Via De Sanctis, 33 - 20010 Assago (MI)'},
      ];
      const users = [
        { id: 1, username: 'lmartino', firstname: 'Luciano', lastname: 'Martino',
          ruoli: [
            {
              id: 1, rolename: 'Developer', description: ''
            },
            {
              id: 2, rolename: 'Owner', description: ''
            },
            {
              id: 3, rolename: 'Admin', description: ''
            },
            {
              id: 4, rolename: 'User', description: ''
            }
          ]
        },
        { id: 2, username: 'rbergamaschi', firstname: 'Roberto', lastname: 'Bergamaschi',
          ruoli: [
            {
              id: 2, rolename: 'Owner', description: 'Il proprietario'
            },
            {
              id: 3, rolename: 'Admin', description: 'Amministratore di sistema'
            }
          ]
        },
        { id: 3, username: 'vbergamaschi', firstname: 'Valter', lastname: 'Bergamaschi',
          ruoli: [
            {
              id: 3, rolename: 'Admin', description: 'Amministratore di sistema'
            }
          ]
        },
        { id: 4, username: 'vmartino', firstname: 'Vito', lastname: 'Martino',
          ruoli: [
            {
              id: 4, rolename: 'User', description: ''
            }
          ]
        },
        { id: 5, username: 'linamiele', firstname: 'Line', lastname: 'Miele',
          ruoli: [
            {
              id: 4, rolename: 'User', description: ''
            }
          ]
        }
      ];

    return {tornei, users};
  }
}
