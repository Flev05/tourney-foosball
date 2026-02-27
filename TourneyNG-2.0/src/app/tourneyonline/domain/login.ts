import { UserVO } from "./user-vo";
import { RoleVO } from "./role-vo";

export class Login extends UserVO {
    roles      : RoleVO[] = [];
    minorRoles : RoleVO[] = [];
}