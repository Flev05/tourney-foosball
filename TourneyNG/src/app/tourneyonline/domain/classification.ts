import { Team } from './team';

export interface Classification
{
    id?            : number;
    teamName?      : string;
    points?        : number;
    played?        : number;
    won?           : number;
    lost?          : number;
    balanced?      : number;
    penalty?       : number;
    goalsDone?     : number;
    goalsDiff?     : number;
    goalsConceded? : number;
}
