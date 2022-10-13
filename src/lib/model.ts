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
    reply: (text: string, mentionedArray: MentionedArray[] | null, type: number)
        => Promise<ChatMessage>;
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
    text: string | null;
    threadId: string;
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