import { Eliminatory } from "./eliminatory";
import { Direction } from "./enumerations";

export class EliminatoryLevel  {
    id: number;
    name: string;
    level: number;
    isTopLevel: boolean;
    isOptional: boolean;

    direction?      : Direction;

    eliminatories: Array<Eliminatory>;
}
