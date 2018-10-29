import { Combobox } from './tourney-combobox';

export interface Cell
{
    id     : number;
    isEditable : boolean;
    isTotal : boolean;
    field  : string;
    style  : string;

    points : Combobox;
}
