
import { Player } from './player';
import { Country } from './country';
import { ClientVO } from './client-vo';

export interface Team {
    id?:       number;
    clientVO?: ClientVO;
    teamName?: string;
    address? : string;
    ruleName?: string;
    country?:  Country;
    players?:  Player[];
}
