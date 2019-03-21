
import { Player } from './player';
import { Country } from './country';

export interface Team {
    id?:       number;
    clientId?: number;
    teamName?: string;
    address? : string;
    ruleName?: string;
    country?:  Country;
    players?:  Player[];
}
