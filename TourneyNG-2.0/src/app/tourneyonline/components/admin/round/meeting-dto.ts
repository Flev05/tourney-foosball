import { Meeting } from '../../../domain/meeting';

export class MeetingDto
{
    round     : string = "";
    direction : string = "";
    separator : boolean = false;
    signLine? : boolean = false;
    md        : number = 0;
    days      : number = 0;
    weekRange : string = "";
    meeting   : Meeting = new Meeting();
}
