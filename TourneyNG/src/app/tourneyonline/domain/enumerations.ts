export enum PhaseType {
    R='round', P='playoff', E='eliminatory'
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
    ToPlay='P', InProgress='I', Terminated='T'
}
export enum Roles {
    Developer='DEVELOPER', Owner='OWNER', Admin='ADMIN', Operator='OPERATOR', Follower='FOLLOWER'
}
export enum TourneyStatus {
    Started='S', Running='R', Terminated='E'
}
