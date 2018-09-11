import { NextRoundConfig } from './next-round-config';

export interface RoundConfig extends NextRoundConfig {

    teamsNo?: number;
    roundTrip?: boolean;
}
