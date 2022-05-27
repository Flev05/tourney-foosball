import { UserVO } from "./user-vo";
import { RoleVO } from "./role-vo";
import { ClientVO } from "./client-vo";

export interface UserRoleClientVO 
{
    id?           : number;
    userVo?       : UserVO;
    roleVo?       : RoleVO;
    clientVO?     : ClientVO;
    tourneyId?    : number;
}