import { UserVO } from "./user-vo";

export interface OperatorsVO 
{
    clientId           : number;
    tourneyId          : number;
    allOperators?      : UserVO[];
    selectedOperators? : UserVO[];
}