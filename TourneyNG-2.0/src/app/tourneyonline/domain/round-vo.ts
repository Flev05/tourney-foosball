import { Round } from "./round";
import { AbstractRoundVO } from "./abstract-round-vo";

export class RoundVO  extends AbstractRoundVO  {
     isRoundAutoGen: string = "";
     rounds: Round[] = [];
}
