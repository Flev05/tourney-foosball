
import { Login } from './login';

export interface Password extends Login
{
    newPassword? : string;
    confirmedPassword? : string;
}