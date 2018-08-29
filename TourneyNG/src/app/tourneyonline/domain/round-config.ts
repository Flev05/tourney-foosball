import { Calendar } from './calendar';
import { MeetingConfig } from './meeting-config';

export interface RoundConfig extends MeetingConfig {

    teamsNo?: number;
    roundTrip?: boolean;
}
