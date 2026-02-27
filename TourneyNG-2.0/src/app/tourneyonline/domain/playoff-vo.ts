import { Playoff } from "./playoff";
import { AbstractRoundVO } from "./abstract-round-vo";

export class PlayoffVO extends AbstractRoundVO {
    isPlayoffAutoGen: string = ""; 
    playoffs: Playoff[] = [];
}
