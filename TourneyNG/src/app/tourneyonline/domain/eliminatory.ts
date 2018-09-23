import { Round } from './round';
import { EliminatoryConfig } from './eliminatory-config';

export interface Eliminatory extends Round {
    level?: number;

    eliminatoryConfigs?: EliminatoryConfig[];
}
