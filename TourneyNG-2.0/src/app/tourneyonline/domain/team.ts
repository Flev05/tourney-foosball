import { Player } from './player';
import { Country } from './country';

export class Team {
    id          : number | null = null;
    clientId    : number | null = null;
    teamName    : string = "";
    isDummy     : boolean = false;
    isNew       : boolean = false;
    chaosEnabled : boolean = false;
    address     : string = "";
    ruleName    : string = "";
    asd         : string = "";
    country     : Country = new Country();
    players     : Player[] = [];
    operators   : string[] = [];
}
