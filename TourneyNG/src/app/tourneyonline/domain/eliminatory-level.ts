import { Eliminatory } from "./eliminatory";
import { Combobox } from "app/tourneyonline/domain/tourney-combobox";

export class EliminatoryLevel  {
    id: number;
    name: string;
    level: number;
    isOneway: boolean;

    eliminatories: Array<Eliminatory>;
}
