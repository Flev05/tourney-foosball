import { Team } from './team';
import { ObjectiveConfig } from './objective-config';

export interface Final
{
    id?     : number;
    team?   : Team;
    points? : number;

    objectiveConfigs?: ObjectiveConfig[];
}