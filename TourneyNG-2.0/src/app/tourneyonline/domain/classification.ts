export class Classification
{
    id            : number | null = null;
    teamName      : string = "";
    points        : number = 0;
    played        : number = 0;
    won           : number = 0;
    lost          : number = 0;
    balanced      : number = 0;
    penalty       : number = 0;
    goalsDone     : number = 0;
    goalsDiff     : number = 0;
    goalsConceded : number = 0;
    notResolveble : boolean = false;
    roundIndex    : number = 0;
}
