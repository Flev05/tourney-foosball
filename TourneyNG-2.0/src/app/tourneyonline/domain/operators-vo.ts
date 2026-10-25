import { UserVO } from "./user-vo";

export class OperatorsVO 
{
    clientId          : number | null = null;
    tourneyId         : number | null = null;
    allOperators      : UserVO[] = [];
}