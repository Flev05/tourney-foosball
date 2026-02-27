import { UserVO } from "./user-vo";
import { RoleVO } from "./role-vo";
import { ClientVO } from "./client-vo";

export class UserRoleClientVO {
    id           : number | null = null;
    userVo       : UserVO = new UserVO();
    roleVo       : RoleVO = new RoleVO();
    clientVO     : ClientVO = new ClientVO();
    tourneyId?   : number;
}