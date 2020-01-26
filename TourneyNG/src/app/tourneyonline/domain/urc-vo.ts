import { UserVO } from "./user-vo";
import { RoleVO } from "./role-vo";
import { ClientVO } from "./client-vo";
import { Combobox } from "./tourney-combobox";

export interface UserRoleClientVO 
{
    id?           : number;
    userVo?       : UserVO;
    roleVo?       : RoleVO;
    clientVO?     : ClientVO;
    tourneyId?    : number;
    disciplineId? : number;
}