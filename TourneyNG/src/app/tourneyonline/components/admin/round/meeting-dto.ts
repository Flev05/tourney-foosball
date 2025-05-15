import { Meeting } from 'app/tourneyonline/domain/meeting';
import { Direction } from 'app/tourneyonline/domain/enumerations';

export class MeetingDto
{
    direction : string;
    separator : boolean = false;
    md        : number = 0;
    days      : number = 0;
    weekRange : string;
    meeting?  : Meeting;
}
