import { Role } from './role';
import { CommonUserVO } from './common-user-vo';

export interface UserVO extends CommonUserVO
{
    roles?      : Role[];
}
