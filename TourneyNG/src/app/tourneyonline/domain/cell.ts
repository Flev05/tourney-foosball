import { CellCombobox } from "./tourney-combobox";

export interface Cell
{
    id          : number;
    isEditable  : boolean;
    isTotal     : boolean;
    isVisited   : boolean;
    field       : string;
    style       : string;

    points      : CellCombobox;
    teamName1   : string;
    teamName2   : string;
    options     : CellCombobox[];
}
