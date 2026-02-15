export enum PhaseType {
    R='round', P='playoff', O='playout', E='eliminatory', EB='eliminatoryB'
}

export enum EliminatoryMode {
    M='manual', A='auto'
}

export enum AccessMode {
    PU='public', PR='private'
}

export enum RoundType {
    R='round', P='playoff', E='eliminatory'
}

export enum TourneyType {
    Time='time', Score='score'
}

export enum TeamSortType {
    O='original', A='alphabetical', R="random"
}

export enum Direction {
    OneWay='A', RoundTrip="R"
}

export enum MeetingStatus {
    ToPlay='Da Giocare', InProgress='In Corso', Terminated='Terminata', Confirmed='Convalidata'
}
export enum ERoles {
    DEVELOPER, OWNER, ADMIN, OPERATOR, FOLLOWER
}
export enum EResultTool {
    R='Reduced', C='Complete'
}
export enum ETeamOperation {
    INSERT, UPDATE, DELETE
}
