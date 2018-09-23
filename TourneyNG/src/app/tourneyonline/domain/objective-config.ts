import { EliminatoryConfig } from './eliminatory-config';

export interface ObjectiveConfig extends EliminatoryConfig {
    eliminatoryName?: string;
    level?: number;
}
