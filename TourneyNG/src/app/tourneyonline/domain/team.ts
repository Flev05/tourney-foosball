import { Player } from './player';
import { Country } from './country';

export interface Team {
    id?         : number;
    clientId?   : number;
    teamName?   : string;
    isDummy?    : boolean;
    address?    : string;
    ruleName?   : string;
    asd?        : string;
    country?    : Country;
    players?    : Player[];
    operators?  : string[];
}
