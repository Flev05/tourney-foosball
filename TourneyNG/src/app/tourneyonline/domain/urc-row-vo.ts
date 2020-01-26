import { Combobox } from "./tourney-combobox";

export interface UserRoleClientRow 
{
    id            : number;

    userOptions   : Combobox[];
    userSelect    : Combobox;

    roleOptions   : Combobox[];
    roleSelect    : Combobox;

    clientOptions : Combobox[];
    clientSelect  : Combobox;
}