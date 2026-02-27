import { Eliminatory } from "./eliminatory";

export class EliminatoryVO  {
    eliminatory : Eliminatory = new Eliminatory();
    rowNumber: number = 0;
    teamName1: string = "";
    teamName2: string = "";
    onewayDatetime?: Date;
    roundtripDatetime?: Date;
    position1: string = "";
    fromRound1: string = "";
    fromPlayoff1: string = "";
    versus: string = "";
    position2: string = "";
    fromRound2: string = "";
    fromPlayoff2: string = "";
}
