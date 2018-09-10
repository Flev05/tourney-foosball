export interface MeetingConfig {

    racesNo?: number;
    atBestOf?: boolean;

    scoresToVictory?: number;

    pointsAtVictory?: number;
    pointsAtBalance?: number;
    pointsAtDefeat?: number;
    
    caseOfParity?: string; // golden Goal or Tie Break

    victoryPointsInCaseOfBalance?: number;
    defeatPointsInCaseOfBalance?: number;
}
