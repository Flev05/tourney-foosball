import { Team } from './team';
import { ObjectiveConfig } from './objective-config';

export class Final {
    id     : number = 0;
    team   : Team = new Team();
    points : number = 0 ;
    objectiveConfigs: ObjectiveConfig[] = [];
}