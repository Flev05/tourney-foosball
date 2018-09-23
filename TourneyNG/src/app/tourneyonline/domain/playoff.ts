import { Round } from './round';
import { PlayoffConfig } from './playoff-config';
import {SelectItem} from 'primeng/api';

export interface Playoff extends Round {
    playoffConfigs?: PlayoffConfig[];

    selectedPlayoffConfig?: PlayoffConfig;
}
