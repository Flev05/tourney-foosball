import { Eliminatory } from "./eliminatory";
import { Round } from "./round";

export class EliminatoryLevel  {
    id: number;
    name: string;
    level: number;
    isTopLevel: boolean;
    isOneway: boolean;

    // standaloneRounds: Round[];

    eliminatories: Array<Eliminatory>;
}
