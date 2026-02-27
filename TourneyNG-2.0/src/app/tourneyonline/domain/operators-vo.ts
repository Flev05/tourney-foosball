import { UserVO } from "./user-vo";

export class OperatorsVO 
{
    clientId          : number | null = null;
    tourneyId         : number = 0;
    allOperators      : UserVO[] = [];
    selectedOperators : UserVO[] = [];
}