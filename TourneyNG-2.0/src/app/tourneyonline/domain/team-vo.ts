import { Country } from "./country";

export class TeamVO {
    id         : number | null = null;
    teamName   : string = "";
    clientId   : number | null = null;
    country    : Country = new Country();
    json       : string = ""; 
}
