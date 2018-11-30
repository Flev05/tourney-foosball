import { Team } from './team';

export interface Classification
{
    id?            : number;
    team?          : Team;
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
