import { Round } from "./round";
import { AbstractRoundVO } from "./abstract-round-vo";

export interface RoundVO  extends AbstractRoundVO  {
     isRoundAutoGen?: string;
     rounds?: Round[];
}
