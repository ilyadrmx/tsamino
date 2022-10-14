import * as community from "./models/community.js";

export interface RequestParams {
    method?: string;
    ndcId: number;
    contentType?: string;
    data?: any;
    withNot200Error?: boolean;
    not200Text?: string;
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
    extensions: AccountExtensions;
    email: string;
}

export interface AccountExtensions {
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

export interface SocketConnectionData {
    body: string;
    headers: {
        NDCDEVICEID: string,
        NDCAUTH: string,
        "NDC-MSG-SIG": string
    };
    url: string;
}

export interface SocketStruct {
    t: number;
    o: SocketO;
}

export interface SocketO {
    ndcId: number;
    chatMessage: ChatMessage;
    alertOption: number;
    membershipStatus: number;
    reply: (text: string, mentionedArray: MentionedArray[] | null, type: number)
        => Promise<ChatMessage>;
}

export interface ChatMessage {
    author: Author;
    threadId: string;
    mediaType: number;
    content: string;
    clientRefId: number;
    messageId: string;
    uid: string;
    createdTime: string;
    type: number;
    isHidden: boolean;
    includedInSummary: boolean;
    chatBubbleId: string;
    chatBubbleVersion: number;
    extensions: MessageExtensions;
}

export interface Author {
    uid: string;
    status: number;
    icon: string;
    reputation: number;
    role: number;
    nickname: string;
    level: number;
    accountMembershipStatus: number;
    avatarFrame: AvatarFrame;
}

export interface AvatarFrame {
    status: number;
    version: number;
    resourceUrl: string;
    name: string;
    icon: string;
    frameType: number;
    frameId: string;
}

export interface MentionedArray {
    uid: string;
}

export interface ReplyMessage {
    includedInSummary: boolean;
    uid: string;
    author: Author;
    isHidden: boolean;
    messageId: string;
    mediaType: number;
    content: string;
    clientRefId: number;
    threadId: string;
    createdTime: string;
    extensions: AccountExtensions;
    type: number;
}

export interface MessageExtensions {
    replyMessageId: string;
    replyMessage: ReplyMessage;
    mentionedArray: MentionedArray[];
}

export interface MessageParams {
    threadId: string;
    text: string | null;
    replyTo: string | null;
    mentionedArray: MentionedArray[] | null;
    type: number | null;
}

export interface MessageRequestExtensions {
    mentionedArray: MentionedArray[];
}

export interface MessageRequest {
    type: number;
    timestamp: number;
    replyMessageId: string | null;
    content: string | null;
    extensions: MessageRequestExtensions | null;
}

export type SocketCallback = (message: SocketO) => void;

export interface SocketCommands {
    command: string;
    callback: SocketCallback;
}

export interface Thread {
    userAddedTopicList: ThreadUserAddedTopicList[];
    uid: string;
    membersQuota: number;
    membersSummary: ThreadMembersSummary[];
    threadId: string;
    membersCount: number;
    strategyInfo: string;
    isPinned: boolean;
    title: string;
    tipInfo: ThreadTipInfo;
    membershipStatus: number;
    content: string;
    needHidden: boolean;
    alertOption: number;
    lastReadTime: string;
    type: number;
    status: number;
    publishToGlobal: number;
    lastMessageSummary: ThreadLastMessageSummary;
    condition: number;
    icon: string;
    latestActivityTime: string;
    author: Author;
    extensions: ThreadExtensions;
    ndcId: number;
}

export interface ThreadUserAddedTopicList {
    status: number;
    isOfficial: boolean;
    style: Style;
    isAlias: boolean;
    name: string;
    contentPoolId: string;
    topicId: number;
    advancedCommunityStatus: number;
    increaseId: number;
    visibility: number;
    source: number;
    chatStatus: number;
    scope: number;
    advancedStatus: number;
    isLocked: boolean;
    objectMappingScore: number;
    coverImage?: string;
    storyId?: string;
}

export interface Style {
    backgroundColor: string;
}

export interface ThreadMembersSummary {
    status: number;
    uid: string;
    membershipStatus: number;
    role: number;
    nickname: string;
    icon: string;
}

export interface ThreadTipInfo {
    tipOptionList: ThreadTipOptionList[];
    tipMaxCoin: number;
    tippersCount: number;
    tippable: boolean;
    tipMinCoin: number;
    tipCustomOption: ThreadTipCustomOption;
    tippedCoins: number;
}

export interface ThreadTipOptionList {
    value: number;
    icon: string;
}

export interface ThreadTipCustomOption {
    icon: string;
}

export interface ThreadLastMessageSummary {
    uid: string;
    type: number;
    mediaType: number;
    content: any;
    messageId: string;
    createdTime: string;
    isHidden: boolean;
    mediaValue: string;
}

export interface Author {
    status: number;
    isNicknameVerified: boolean;
    uid: string;
    level: number;
    followingStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    membershipStatus: number;
    avatarFrameId: string;
    reputation: number;
    role: number;
    avatarFrame: AvatarFrame;
    ndcId: number;
    membersCount: number;
    nickname: string;
    icon: string;
}

export interface AvatarFrame {
    status: number;
    version: number;
    resourceUrl: string;
    name: string;
    icon: string;
    frameType: number;
    frameId: string;
}

export interface ThreadExtensions {
    announcement: string;
    coHost: string[];
    language: string;
    membersCanInvite: boolean;
    screeningRoomPermission: ThreadScreeningRoomPermission;
    bm: [number, string, any];
    avchatMemberUidList: string[];
    visibility: number;
    bannedMemberUidList: string[];
    lastMembersSummaryUpdateTime: number;
    fansOnly: boolean;
    channelType: number;
    pinAnnouncement: boolean;
    vvChatJoinType: number;
    viewOnly: boolean;
}

export interface ThreadScreeningRoomPermission {
    action: number;
    uidList: string[];
}

export interface ThreadResponse extends BasicResponse {
    thread: Thread;
}

export interface ThreadsResponse extends BasicResponse {
    threadList: Thread[];
}

export interface SidInfo {
    "1": any;
    "0": number;
    "3": number;
    /** UID */ "2": string;
    /** Timestamp */ "5": number;
    /** IP */ "4": string;
    /** Client type */ "6": number;
}

export interface UserProfileResponse extends BasicResponse {
    userProfile: UserProfile;
}

export interface AccountResponse extends BasicResponse {
    account: Account;
}

export interface ClientParams {
    deviceId?: string | null;
    debug?: boolean;
}

export { community }