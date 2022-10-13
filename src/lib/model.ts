export interface RequestParams {
    method?: string;
    ndcId: number;
    contentType?: string;
    data?: any;
}

export interface LoginWithEmail {
    email: string;
    secret: string;
    clientType: number;
    deviceID: string;
    action: string;
    timestamp: number;
}

export interface BasicResponse {
    "api:message"?: string;
    "api:duration": string;
    "api:timestamp": string;
    "api:statuscode": number;
}

export interface Account {
    status: number;
    uid: string;
    modifiedTime: string;
    nickname: string;
    googleID: string;
    icon: string;
    securityLevel: number;
    role: number;
    aminoIdEditable: boolean;
    aminoId: string;
    createdTime: string;
    extensions: Extensions;
    email: string;
}

export interface Extensions {
    contentLanguage: string;
    adsFlags: number;
    adsLevel: number;
    avatarFrameId: string;
    adsEnabled: boolean;
    mediaLabAdsMigrationAugust2020: boolean;
}

export interface UserProfile {
    status: number;
    itemsCount: number;
    uid: string;
    modifiedTime: string;
    followingStatus: number;
    onlineStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    avatarFrameId: string;
    reputation: number;
    postsCount: number;
    membersCount: number;
    nickname: string;
    icon: string;
    isNicknameVerified: boolean;
    level: number;
    notificationSubscriptionStatus: number;
    pushEnabled: boolean;
    membershipStatus: number;
    joinedCount: number;
    role: number;
    commentsCount: number;
    aminoId: string;
    ndcId: number;
    createdTime: string;
    storiesCount: number;
    blogsCount: number;
}

export interface LoginResponse extends BasicResponse {
    auid: string;
    sid: string;
    secret: string;
    account: Account;
    userProfile: UserProfile;
}