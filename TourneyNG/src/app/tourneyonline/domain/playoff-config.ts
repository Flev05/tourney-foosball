import { NextRoundConfig } from './next-round-config';
import {SelectItem} from 'primeng/api';

export interface PlayoffConfig extends NextRoundConfig {
    roundName?: SelectItem;
}
