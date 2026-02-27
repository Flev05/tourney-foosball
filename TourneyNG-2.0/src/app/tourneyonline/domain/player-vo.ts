import { Country } from "./country";

export class PlayerVO {
    id         : number| null = null;
    playerName : string = "";
    clientId   : number | null = null;
    country    : Country = new Country();
    json       : string = "";
}

