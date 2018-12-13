
import { Player } from './player';
import { Country } from './country';

export interface Team {
    id:       number;
    teamName: string;
    address?: string;
    country?: Country;
    players?: Player[];
}
