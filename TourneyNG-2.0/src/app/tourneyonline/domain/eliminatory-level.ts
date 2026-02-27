import { AbstractRoundVO } from "./abstract-round-vo";
import { Eliminatory } from "./eliminatory";
import { Direction } from "./enumerations";

export class EliminatoryLevel   {
    id?             : number;
    name            : string = "";
    level           : number = 0;
    isTopLevel      : boolean = true;
    isOptional      : boolean = true;
    direction       : Direction = Direction.OneWay;
    topLevelTeamNo  : number = 0;
    abstractRoundVO : AbstractRoundVO = new AbstractRoundVO();
    eliminatories   : Array<Eliminatory> = [];
}
