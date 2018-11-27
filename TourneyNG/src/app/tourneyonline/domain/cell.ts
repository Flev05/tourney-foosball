import { CellCombobox } from "./tourney-combobox";

export interface Cell
{
    id          : number;
    isEditable  : boolean;
    isTotal     : boolean;
    field       : string;
    style       : string;

    points      : CellCombobox;
    team1Id     : number;
    team2Id     : number;
    options     : CellCombobox[];
}
