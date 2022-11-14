import { Playoff } from "./playoff";
import { AbstractRoundVO } from "./abstract-round-vo";

export interface PlayoffVO extends AbstractRoundVO {
 
    isPlayoffAutoGen?: string;
    
    playoffs?: Playoff[];
}
