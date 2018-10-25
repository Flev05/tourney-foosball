import { Eliminatory } from "./eliminatory";
import { TeamSortType } from "./enumerations";

export class EliminatoryLevel  {
    id: number;
    name: string;
    level: number;
    isTopLevel: boolean;
    isOneway: boolean;

    teamSortType: TeamSortType;

    eliminatories: Array<Eliminatory>;
}
