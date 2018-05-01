import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export class UserInMemoryDataService implements InMemoryDbService {
  createDb() {
  
      // entities with string ids that look like numbers
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

    return {users};
  }

}
