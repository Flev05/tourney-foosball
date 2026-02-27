import { Country } from './country';

export class Player
{
    id             : number | null = null;
    clientId       : number | null = null;
    playerName     : string = "";
    code           : string = "";
    address        : string = "";
    phoneNumber    : string = "";
    email          : string = "";
    country        : Country = new Country();
}
