import { Combobox } from "./tourney-combobox";

export class UserRoleClientRow {
    id            : number | null = null;
    userOptions   : Combobox[] = [];
    userSelect    : Combobox = new Combobox();
    roleOptions   : Combobox[] = [];
    roleSelect    : Combobox = new Combobox();
    clientOptions : Combobox[] = [];
    clientSelect  : Combobox = new Combobox();
}