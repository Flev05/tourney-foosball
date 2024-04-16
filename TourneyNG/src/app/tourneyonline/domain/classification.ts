export class Classification
{
    id?            : number;
    teamName?      : string;
    points?        : number;
    played         : number = 0;
    won?           : number;
    lost?          : number;
    balanced?      : number;
    penalty?       : number;
    goalsDone?     : number;
    goalsDiff?     : number;
    goalsConceded? : number;
    notResolveble? : boolean;
}
