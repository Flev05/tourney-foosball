import { Eliminatory } from "./eliminatory";

export class EliminatoryLevel  {
    id: number;
    name: string;
    level: number;
    isTopLevel: boolean;
    isOneway: boolean;

    eliminatories: Array<Eliminatory>;
}
