import { UserVO } from "./user-vo";
import { RoleVO } from "./role-vo";

export interface Login extends UserVO
{
    roles?      : RoleVO[];
    minorRoles? : RoleVO[];
}