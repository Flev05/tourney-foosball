import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users = [
      { id: 1, username: "lmartino", firstname: 'Luciano', lastname: "Martino" },
      { id: 2, username: "vmartino", firstname: 'Vito', lastname: "Martino" },
      { id: 2, username: "acaputo", firstname: 'Angela', lastname: "Caputo" }
    ];
    return {users};
  }
}
